from robyn import Robyn

from routers.v1 import v1_router

app = Robyn(__file__)


if __name__ == "__main__":
    app.include_router(v1_router)
    app.start(port=8080)
