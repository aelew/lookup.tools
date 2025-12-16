from robyn import Robyn

from routers.v1.resolve import router as v1_resolve_router

app = Robyn(__file__)
app.include_router(v1_resolve_router)


if __name__ == "__main__":
    app.start(port=8080)
