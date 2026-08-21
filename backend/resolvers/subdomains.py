import asyncio

import niquests
from robyn import status_codes
from urllib3 import Retry

from exceptions import HTTPException
from utils.cache import cache_route
from utils.net import is_cloudflare_ip, ping


@cache_route("subdomains", ttl=60 * 30)  # 30m
async def get_subdomains(root_domain: str):
    cert_res = await niquests.aget(
        "https://crt.sh",
        params={"q": f"%.{root_domain}", "output": "json"},
        retries=Retry(total=5, status_forcelist=[502]),
        timeout=30,
    )
    if not cert_res.ok:
        raise HTTPException(
            status_codes.HTTP_500_INTERNAL_SERVER_ERROR,
            f"Third-party lookup failed (status_code={cert_res.status_code})",
        )

    certs = cert_res.json()

    # extract common names and dedupe
    common_names = {c.get("common_name") for c in certs if c.get("common_name")}

    # remove wildcard domains and other domains that don't match the input domain
    common_names = [
        cn
        for cn in common_names
        if "*" not in cn and (cn == root_domain or cn.endswith(f".{root_domain}"))
    ]

    def fdqn_sort(fqdn: str):
        # root first
        if fqdn == root_domain:
            return (0, fqdn)

        # WWW second
        if fqdn == f"www.{root_domain}":
            return (1, fqdn)

        # everything else alphabetically
        return (2, fqdn)

    common_names.sort(key=fdqn_sort)

    ping_tasks = [ping(cn) for cn in common_names]
    live_ips = await asyncio.gather(*ping_tasks)

    data = [
        {"fqdn": cn, "ip": ip, "attributes": {"cloudflare": is_cloudflare_ip(ip)}}
        for cn, ip in zip(common_names, live_ips)
        if ip
    ]

    return {"q": root_domain, "data": data}
