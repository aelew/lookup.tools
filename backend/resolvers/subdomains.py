import asyncio

import niquests
from robyn import status_codes
from robyn.logger import logger
from urllib3 import Retry

from exceptions import HTTPException
from utils.cache import cache_route
from utils.net import is_cloudflare_ip, ping


async def fetch_crtname_subdomains(root_domain: str) -> set[str]:
    res = await niquests.aget(
        "https://crt.name/v1/search",
        params={"apex": root_domain, "format": "json"},
        timeout=15,
    )
    if not res.ok:
        raise RuntimeError(f"crt.name lookup failed (status_code={res.status_code})")

    return {entry["sub"] for entry in res.json() if entry.get("sub")}


async def fetch_crtsh_subdomains(root_domain: str) -> set[str]:
    res = await niquests.aget(
        "https://crt.sh",
        params={"q": f"%.{root_domain}", "output": "json"},
        retries=Retry(total=5, status_forcelist=[502]),
        timeout=30,
    )
    if not res.ok:
        raise RuntimeError(f"crt.sh lookup failed (status_code={res.status_code})")

    return {c["common_name"] for c in res.json() if c.get("common_name")}


@cache_route("subdomains", ttl=60 * 30)  # 30m
async def get_subdomains(root_domain: str):
    try:
        common_names = await fetch_crtname_subdomains(root_domain)
    except Exception:  # noqa: BLE001 — any failure should fall through to the fallback
        logger.error(
            f"crt.name lookup failed for {root_domain}, falling back to crt.sh"
        )

        try:
            common_names = await fetch_crtsh_subdomains(root_domain)
        except Exception as exc:
            raise HTTPException(
                status_codes.HTTP_500_INTERNAL_SERVER_ERROR,
                f"Third-party lookup failed for {root_domain}",
            ) from exc

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
