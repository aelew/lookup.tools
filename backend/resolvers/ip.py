import os

import niquests
from robyn import status_codes

from exceptions import HTTPException
from utils.cache import cache_route


@cache_route("ip", ttl=60 * 60 * 24 * 3)  # 3d
async def get_ip_info(query: str):
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
