import traceback
from http import HTTPStatus
from ipaddress import ip_address
from urllib.parse import unquote

import orjson
from email_validator import EmailNotValidError, validate_email
from robyn import Response, SubRouter, status_codes
from robyn.robyn import QueryParams

from exceptions import HTTPException
from resolvers.accounts import get_accounts
from resolvers.dns import get_dns_records
from resolvers.ip import get_ip_info
from resolvers.subdomains import get_subdomains
from resolvers.whois import get_whois_record
from utils.validators import require_query_param, require_root_domain

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
        description=orjson.dumps({"error": detail}),
        headers={"Content-Type": "application/json"},
    )


@router.get("/dns")
async def resolve_dns(query_params: QueryRequestParams):
    root_domain = require_root_domain(query_params)
    return await get_dns_records(root_domain)


@router.get("/whois")
async def resolve_whois(query_params: QueryRequestParams):
    root_domain = require_root_domain(query_params)
    return await get_whois_record(root_domain)


@router.get("/subdomains")
async def resolve_subdomains(query_params: QueryRequestParams):
    root_domain = require_root_domain(query_params)
    return await get_subdomains(root_domain)


@router.get("/ip")
async def resolve_ip(query_params: QueryRequestParams):
    query = require_query_param(query_params, "Address is required")

    try:
        ip_address(query)
    except ValueError:
        raise HTTPException(status_codes.HTTP_400_BAD_REQUEST, "Address is invalid")

    return await get_ip_info(query)


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

    return await get_accounts(query)
