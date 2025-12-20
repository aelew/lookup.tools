import asyncio
from functools import cache
from ipaddress import ip_address, ip_network

import niquests


async def ping(server: str, port=80, timeout=3) -> str | None:
    try:
        _, writer = await asyncio.wait_for(
            asyncio.open_connection(server, port), timeout
        )
        addr_info = writer.get_extra_info("peername")

        writer.close()
        await writer.wait_closed()

        return addr_info[0]
    except (OSError, asyncio.TimeoutError):
        return None


@cache
def get_cloudflare_ip_ranges():
    res = niquests.get("https://api.cloudflare.com/client/v4/ips")

    if not res.ok:
        raise Exception(
            f"Failed to fetch Cloudflare IP ranges (status_code={res.status_code})"
        )

    result = res.json()["result"]

    ipv4_cidrs = [ip_network(cidr) for cidr in result["ipv4_cidrs"]]
    ipv6_cidrs = [ip_network(cidr) for cidr in result["ipv6_cidrs"]]

    return ipv4_cidrs + ipv6_cidrs


def is_cloudflare_ip(address: str):
    cf_ranges = get_cloudflare_ip_ranges()
    ip = ip_address(address)

    return any(ip in network for network in cf_ranges)
