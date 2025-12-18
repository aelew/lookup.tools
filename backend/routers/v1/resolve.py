import asyncio
import json
import os
import traceback
from http import HTTPStatus
from ipaddress import ip_address
from urllib.parse import unquote

import httpx
import niquests
import tldextract
from asyncwhois import aio_rdap, aio_whois
from email_validator import EmailNotValidError, validate_email
from holehe.core import get_functions, import_submodules, launch_module
from robyn import Response, SubRouter, status_codes
from robyn.logger import logger
from robyn.robyn import QueryParams
from urllib3 import Retry

from exceptions import HTTPException
from utils.dns import CloudflareDNSResolver
from utils.net import is_cloudflare_ip, ping

router = SubRouter(__file__, prefix="/v1/resolve")


class QueryRequestParams(QueryParams):
    q: str


@router.exception
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


@router.get("/dns")
async def resolve_dns(query_params: QueryRequestParams):
    query = query_params.get("q", None)

    if not query:
        raise HTTPException(status_codes.HTTP_400_BAD_REQUEST, "Domain is required")

    extract_result = tldextract.extract(query)
    root_domain = extract_result.top_domain_under_public_suffix

    if root_domain == "":
        raise HTTPException(status_codes.HTTP_400_BAD_REQUEST, "Domain is invalid")

    resolver = CloudflareDNSResolver()
    records = await resolver.resolve_records(root_domain)

    return {"q": root_domain, "data": records}


@router.get("/whois")
async def resolve_whois(query_params: QueryRequestParams):
    query = query_params.get("q", None)

    if not query:
        raise HTTPException(status_codes.HTTP_400_BAD_REQUEST, "Domain is required")

    extract_result = tldextract.extract(query)
    root_domain = extract_result.top_domain_under_public_suffix

    if root_domain == "":
        raise HTTPException(status_codes.HTTP_400_BAD_REQUEST, "Domain is invalid")

    normalized_output = None

    # resolve with WHOIS
    try:
        raw_output, normalized_output = await aio_whois(root_domain)
    except Exception:
        pass

    # fallback to RDAP
    if normalized_output is None or normalized_output["domain_name"] is None:
        try:
            raw_output, normalized_output = await aio_rdap(root_domain)
        except Exception as e:
            logger.error(f"Failed to resolve WHOIS and RDAP for {root_domain}", e)

    if normalized_output is None:
        raise HTTPException(
            status_codes.HTTP_500_INTERNAL_SERVER_ERROR,
            f"Failed to resolve {root_domain}",
        )

    del normalized_output["domain_name"]

    return Response(
        status_code=status_codes.HTTP_200_OK,
        description=json.dumps(
            {
                "q": root_domain,
                "data": normalized_output,
                "raw": raw_output.strip(),
            },
            default=str,
        ),
        headers={"Content-Type": "application/json"},
    )


@router.get("/subdomains")
async def resolve_subdomains(query_params: QueryRequestParams):
    query = query_params.get("q", None)

    if not query:
        raise HTTPException(status_codes.HTTP_400_BAD_REQUEST, "Domain is required")

    extract_result = tldextract.extract(query)
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
            f"Third-party lookup failed (status_code={response.status_code})",
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

    return {"q": root_domain, "data": data}


@router.get("/ip")
async def resolve_ip(query_params: QueryRequestParams):
    query = query_params.get("q", None)

    if not query:
        raise HTTPException(status_codes.HTTP_400_BAD_REQUEST, "Address is required")

    try:
        ip_address(query)
    except ValueError:
        raise HTTPException(status_codes.HTTP_400_BAD_REQUEST, "Address is invalid")

    res = await niquests.aget(
        f"https://api.ipdata.co/v1/{query}",
        params={"api-key": os.getenv("IPDATA_API_KEY")},
    )

    if not res.ok:
        raise HTTPException(
            status_codes.HTTP_500_INTERNAL_SERVER_ERROR,
            f"Third-party lookup failed (status_code={res.status_code})",
        )

    data = res.json()

    try:
        del data["ip"]
        del data["count"]
    except KeyError:
        pass

    return {"q": query, "data": data}


@router.get("/accounts")
async def resolve_accounts(query_params: QueryRequestParams):
    query = query_params.get("q", None)

    if not query:
        raise HTTPException(status_codes.HTTP_400_BAD_REQUEST, "Email is required")

    query = unquote(query)

    try:
        validation_result = validate_email(query, check_deliverability=False)
        query = validation_result.normalized
    except EmailNotValidError as e:
        raise HTTPException(
            status_codes.HTTP_400_BAD_REQUEST, f"Invalid email address — {str(e)}"
        )

    modules = import_submodules("holehe.modules")
    websites = get_functions(modules)

    client = httpx.AsyncClient(timeout=10)
    out = []

    await asyncio.gather(*[launch_module(w, query, client, out) for w in websites])
    await client.aclose()

    data = {}
    for w in sorted(out, key=lambda w: w["name"]):
        if not w["rateLimit"]:
            data[w["domain"]] = w["exists"]

    return {"q": query, "data": data}
