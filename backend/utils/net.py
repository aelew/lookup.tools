import asyncio
import time
from ipaddress import ip_address, ip_network

import niquests
from robyn.logger import logger

CLOUDFLARE_IP_RANGES_TTL = 60 * 60 * 24  # 24h

_cloudflare_ip_ranges: list | None = None
_cloudflare_ip_ranges_fetched_at: float = 0


async def ping(server: str, port=80, timeout=3) -> str | None:
    try:
        _, writer = await asyncio.wait_for(
            asyncio.open_connection(server, port), timeout
        )
        addr_info = writer.get_extra_info("peername")

        writer.close()
        await writer.wait_closed()

        return addr_info[0]
    except (TimeoutError, OSError):
        return None


def _fetch_cloudflare_ip_ranges() -> list:
    res = niquests.get("https://api.cloudflare.com/client/v4/ips")

    if not res.ok:
        raise RuntimeError(
            f"Failed to fetch Cloudflare IP ranges (status_code={res.status_code})"
        )

    result = res.json()["result"]

    ipv4_cidrs = [ip_network(cidr) for cidr in result["ipv4_cidrs"]]
    ipv6_cidrs = [ip_network(cidr) for cidr in result["ipv6_cidrs"]]

    return ipv4_cidrs + ipv6_cidrs


def get_cloudflare_ip_ranges() -> list | None:
    """Returns the cached Cloudflare IP ranges, refreshing them if stale.

    If a refresh fails, the previous ranges are kept (None only if no
    successful fetch has ever completed).
    """
    global _cloudflare_ip_ranges, _cloudflare_ip_ranges_fetched_at

    is_stale = (
        time.monotonic() - _cloudflare_ip_ranges_fetched_at > CLOUDFLARE_IP_RANGES_TTL
    )

    if _cloudflare_ip_ranges is None or is_stale:
        try:
            _cloudflare_ip_ranges = _fetch_cloudflare_ip_ranges()
            _cloudflare_ip_ranges_fetched_at = time.monotonic()
        except Exception:  # noqa: BLE001 — keep serving stale data rather than fail the request
            logger.error("Failed to refresh Cloudflare IP ranges")

            if _cloudflare_ip_ranges is None:
                return None

    return _cloudflare_ip_ranges


def is_cloudflare_ip(address: str) -> bool | None:
    cf_ranges = get_cloudflare_ip_ranges()
    if cf_ranges is None:
        return None

    ip = ip_address(address)

    return any(ip in network for network in cf_ranges)
