import asyncio
import os
import traceback
from http import HTTPStatus
from ipaddress import ip_address
from urllib.parse import unquote

import httpx
import niquests
import orjson
from asyncwhois.client import DomainClient
from asyncwhois.errors import NotFoundError
from email_validator import EmailNotValidError, validate_email
from holehe.core import get_functions, import_submodules, launch_module
from robyn import Response, SubRouter, status_codes
from robyn.logger import logger
from robyn.robyn import QueryParams
from urllib3 import Retry

from exceptions import HTTPException
from utils.cache import cache_route
from utils.dns import CloudflareDNSResolver
from utils.net import is_cloudflare_ip, ping
from utils.validators import require_query_param, require_root_domain

router = SubRouter(__file__, prefix="/v1/resolve")

domain_client = DomainClient(timeout=15)


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
        description=orjson.dumps({"error": detail}),
        headers={"Content-Type": "application/json"},
    )


@cache_route("dns")
async def _compute_dns(root_domain: str):
    resolver = CloudflareDNSResolver()
    records = await resolver.resolve_records(root_domain)

    return {"q": root_domain, "data": records}


@router.get("/dns")
async def resolve_dns(query_params: QueryRequestParams):
    root_domain = require_root_domain(query_params)
    return await _compute_dns(root_domain)


@cache_route("whois")
async def _compute_whois(root_domain: str):
    raw_output, normalized_output = None, None
    whois_exc = None

    # resolve with WHOIS
    try:
        raw_output, normalized_output = await domain_client.aio_whois(root_domain)
    except NotFoundError:
        raise HTTPException(status_codes.HTTP_404_NOT_FOUND, "Domain not found")
    except Exception as exc:  # noqa: BLE001 — any failure should fall through to RDAP
        whois_exc = exc

    # fallback to RDAP
    if (
        raw_output is None
        or normalized_output is None
        or normalized_output["domain_name"] is None
    ):
        try:
            raw_output, normalized_output = await domain_client.aio_rdap(root_domain)
        except Exception as rdap_exc:  # noqa: BLE001 — either source failing is a valid outcome
            if whois_exc is not None:
                logger.error(f"Failed to resolve WHOIS for {root_domain}")
                logger.logger.exception("", exc_info=whois_exc)

            logger.error(f"Failed to resolve RDAP for {root_domain}")
            logger.logger.exception("", exc_info=rdap_exc)

    if normalized_output is None:
        raise HTTPException(
            status_codes.HTTP_500_INTERNAL_SERVER_ERROR,
            f"Failed to resolve {root_domain}",
        )

    del normalized_output["domain_name"]

    normalized_output = orjson.loads(
        orjson.dumps(
            normalized_output,
            default=str,
            option=orjson.OPT_NON_STR_KEYS,
        )
    )

    return {
        "q": root_domain,
        "data": normalized_output,
        "raw": raw_output.strip(),
    }


@router.get("/whois")
async def resolve_whois(query_params: QueryRequestParams):
    root_domain = require_root_domain(query_params)
    return await _compute_whois(root_domain)


@cache_route("subdomains", ttl=60 * 30)  # 30m
async def _compute_subdomains(root_domain: str):
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


@router.get("/subdomains")
async def resolve_subdomains(query_params: QueryRequestParams):
    root_domain = require_root_domain(query_params)
    return await _compute_subdomains(root_domain)


@cache_route("ip", ttl=60 * 60 * 24 * 3)  # 3d
async def _compute_ip(query: str):
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


@router.get("/ip")
async def resolve_ip(query_params: QueryRequestParams):
    query = require_query_param(query_params, "Address is required")

    try:
        ip_address(query)
    except ValueError:
        raise HTTPException(status_codes.HTTP_400_BAD_REQUEST, "Address is invalid")

    return await _compute_ip(query)


@cache_route("accounts", ttl=60 * 60)  # 1h
async def _compute_accounts(query: str):
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


@router.get("/accounts")
async def resolve_accounts(query_params: QueryRequestParams):
    query = require_query_param(query_params, "Email is required")
    query = unquote(query)

    try:
        validation_result = validate_email(query, check_deliverability=False)
        query = validation_result.normalized
    except EmailNotValidError as e:
        raise HTTPException(
            status_codes.HTTP_400_BAD_REQUEST, f"Invalid email address — {e!s}"
        )

    return await _compute_accounts(query)
