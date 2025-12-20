import os
from http import HTTPStatus

import orjson
from robyn import ALLOW_CORS, Request, Response, Robyn, status_codes
from robyn.logger import logger
from robyn_rate_limits import InMemoryStore, RateLimiter

from exceptions import HTTPException
from routers.v1.resolve import router as v1_resolve_router

app = Robyn(__file__)

limiter = RateLimiter(
    store=InMemoryStore,
    calls_limit=30,
    limit_ttl=60,
    exceeded_response=Response(
        status_code=status_codes.HTTP_429_TOO_MANY_REQUESTS,
        description=orjson.dumps({"error": HTTPStatus.TOO_MANY_REQUESTS.phrase}),
        headers={"Content-Type": "application/json"},
    ),
)

allowed_origins = os.getenv("ALLOWED_ORIGINS")
allowed_origins = allowed_origins.split(",") if allowed_origins else []

ALLOW_CORS(app, allowed_origins)


@app.before_request()
def middleware(request: Request):
    path = request.url.path
    if not request.query_params.empty():
        params = "&".join(
            f"{key}={values[0]}"
            for key, values in request.query_params.to_dict().items()
        )
        path = f"{path}?{params}"

    logger.info(f"{request.method} {path}")
    return limiter.handle_request(app, request)


@app.get("/health", const=True)
def health():
    return Response(
        status_code=status_codes.HTTP_204_NO_CONTENT,
        description="",
        headers={},
    )


@app.get("/visitor")
def visitor(request: Request):
    visitor_ip = (
        request.headers.get("cf-connecting-ip")
        or request.headers.get("x-forwarded-for")
        or request.ip_addr
    )

    if not visitor_ip:
        raise HTTPException(
            status_codes.HTTP_500_INTERNAL_SERVER_ERROR,
            "Failed to get visitor IP",
        )

    return {"ip": visitor_ip}


app.include_router(v1_resolve_router)


if __name__ == "__main__":
    app.start(host="0.0.0.0", port=8080)
