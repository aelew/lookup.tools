from http import HTTPStatus
import json
from robyn import Request, Response, Robyn, status_codes

from robyn.logger import logger
from robyn_rate_limits import InMemoryStore
from robyn_rate_limits import RateLimiter
from routers.v1.resolve import router as v1_resolve_router

app = Robyn(__file__)

limiter = RateLimiter(
    store=InMemoryStore,
    calls_limit=10,
    limit_ttl=60,
    exceeded_response=Response(
        status_code=status_codes.HTTP_429_TOO_MANY_REQUESTS,
        description=json.dumps({"error": HTTPStatus.TOO_MANY_REQUESTS.phrase}),
        headers={"Content-Type": "application/json"},
    ),
)


@app.before_request()
def middleware(request: Request):
    logger.info(f"{request.method} {request.url.path}")
    return limiter.handle_request(app, request)


@app.get("/health", const=True)
def health():
    return Response(
        status_code=status_codes.HTTP_204_NO_CONTENT, description="", headers={}
    )


app.include_router(v1_resolve_router)


if __name__ == "__main__":
    app.start(host="0.0.0.0", port=8080)
