import asyncio

import httpx
from holehe.core import get_functions, import_submodules, launch_module

from utils.cache import cache_route

DEFAULT_CHECKERS = get_functions(import_submodules("holehe.modules"))


async def check_accounts(
    query: str, checkers: list = DEFAULT_CHECKERS
) -> dict[str, bool]:
    client = httpx.AsyncClient(timeout=10)
    out = []

    await asyncio.gather(*[launch_module(c, query, client, out) for c in checkers])
    await client.aclose()

    data = {}
    for w in sorted(out, key=lambda w: w["name"]):
        if not w["rateLimit"]:
            data[w["domain"]] = w["exists"]

    return data


@cache_route("accounts", ttl=60 * 60)  # 1h
async def get_accounts(query: str):
    data = await check_accounts(query)
    return {"q": query, "data": data}
