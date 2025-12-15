import asyncio
import json
import traceback
from http import HTTPStatus

import niquests
import tldextract
from robyn import Response, SubRouter, status_codes
from robyn.robyn import QueryParams
from urllib3 import Retry

from exceptions import HTTPException
from utils import is_cloudflare_ip, ping

v1_router = SubRouter(__file__, prefix="/v1")


@v1_router.exception
def handle_exception(error: Exception):
    if isinstance(error, HTTPException):
        status_code = error.status_code
        detail = error.detail
    else:
        status_code = status_codes.HTTP_500_INTERNAL_SERVER_ERROR
        detail = HTTPStatus.INTERNAL_SERVER_ERROR.phrase

        traceback.print_exc()

    return Response(
        status_code=status_code,
        description=json.dumps({"error": detail}),
        headers={"Content-Type": "application/json"},
    )


@v1_router.get("/resolve/subdomains")
async def resolve_subdomains(query_params: QueryParams):
    domain = query_params.get("domain", None)

    if not domain:
        raise HTTPException(status_codes.HTTP_400_BAD_REQUEST, "Domain is required")

    extract_result = tldextract.extract(domain)
    root_domain = extract_result.top_domain_under_public_suffix

    if root_domain == "":
        raise HTTPException(status_codes.HTTP_400_BAD_REQUEST, "Domain is invalid")

    response = await niquests.aget(
        "https://crt.sh",
        params={"q": f"%.{root_domain}", "output": "json"},
        retries=Retry(total=5, status_forcelist=[502]),
        timeout=30,
    )
    if not response.ok:
        raise HTTPException(
            status_codes.HTTP_500_INTERNAL_SERVER_ERROR,
            "Third-party scan failed",
        )

    certs = response.json()

    # extract common names and dedupe
    common_names = set(c.get("common_name") for c in certs if c.get("common_name"))

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

    return {"domain": domain, "data": data}
