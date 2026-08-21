import tldextract
from robyn import status_codes
from robyn.robyn import QueryParams

from exceptions import HTTPException


def require_query_param(query_params: QueryParams, error_msg: str) -> str:
    query = query_params.get("q", None)

    if not query:
        raise HTTPException(status_codes.HTTP_400_BAD_REQUEST, error_msg)

    return query


def require_root_domain(query_params: QueryParams) -> str:
    query = require_query_param(query_params, "Domain is required")
    root_domain = tldextract.extract(query).top_domain_under_public_suffix

    if root_domain == "":
        raise HTTPException(status_codes.HTTP_400_BAD_REQUEST, "Domain is invalid")

    return root_domain
