import asyncio

import httpx
from holehe.core import get_functions, import_submodules, launch_module

from utils.cache import cache_route


@cache_route("accounts", ttl=60 * 60)  # 1h
async def get_accounts(query: str):
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
