import orjson
from asyncwhois.client import DomainClient
from asyncwhois.errors import NotFoundError
from robyn import status_codes
from robyn.logger import logger

from exceptions import HTTPException
from utils.cache import cache_route

domain_client = DomainClient(timeout=15)


@cache_route("whois")
async def get_whois_record(root_domain: str):
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
