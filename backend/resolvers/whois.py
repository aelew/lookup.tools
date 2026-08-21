import orjson
from asyncwhois.client import DomainClient
from asyncwhois.errors import NotFoundError
from robyn import status_codes
from robyn.logger import logger

from exceptions import HTTPException
from utils.cache import cache_route

domain_client = DomainClient(timeout=15)


class DomainResolutionError(Exception):
    """Raised when both WHOIS and RDAP fail to resolve a domain."""

    def __init__(self, whois_error: Exception | None, rdap_error: Exception):
        self.whois_error = whois_error
        self.rdap_error = rdap_error
        super().__init__("failed to resolve domain via WHOIS and RDAP")


async def resolve_domain_info(
    root_domain: str, client: DomainClient = domain_client
) -> tuple[str, dict, Exception | None]:
    """Resolves a domain via WHOIS, falling back to RDAP if WHOIS fails or comes back
    without a domain name. Returns (raw, normalized, rdap_error), where rdap_error is
    set only if RDAP failed but a usable WHOIS result was returned anyway.

    Raises NotFoundError if WHOIS reports the domain doesn't exist, or
    DomainResolutionError if neither source could resolve it.
    """
    raw_output, normalized_output = None, None
    whois_exc = None

    try:
        raw_output, normalized_output = await client.aio_whois(root_domain)
    except NotFoundError:
        raise
    except Exception as exc:  # noqa: BLE001 — any failure should fall through to RDAP
        whois_exc = exc

    if (
        raw_output is None
        or normalized_output is None
        or normalized_output["domain_name"] is None
    ):
        try:
            raw_output, normalized_output = await client.aio_rdap(root_domain)
        except Exception as rdap_exc:
            if raw_output is None or normalized_output is None:
                raise DomainResolutionError(whois_exc, rdap_exc) from rdap_exc

            return raw_output, normalized_output, rdap_exc

    return raw_output, normalized_output, None


@cache_route("whois")
async def get_whois_record(root_domain: str):
    try:
        raw_output, normalized_output, rdap_error = await resolve_domain_info(
            root_domain
        )
    except NotFoundError:
        raise HTTPException(status_codes.HTTP_404_NOT_FOUND, "Domain not found")
    except DomainResolutionError as exc:
        if exc.whois_error is not None:
            logger.error(f"Failed to resolve WHOIS for {root_domain}")
            logger.logger.exception("", exc_info=exc.whois_error)

        logger.error(f"Failed to resolve RDAP for {root_domain}")
        logger.logger.exception("", exc_info=exc.rdap_error)

        raise HTTPException(
            status_codes.HTTP_500_INTERNAL_SERVER_ERROR,
            f"Failed to resolve {root_domain}",
        )

    if rdap_error is not None:
        logger.error(f"Failed to resolve RDAP for {root_domain}")
        logger.logger.exception("", exc_info=rdap_error)

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
