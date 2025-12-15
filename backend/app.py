from robyn import Robyn

from routers.v1 import router as v1_router

app = Robyn(__file__)
app.include_router(v1_router)


if __name__ == "__main__":
    app.start(port=8080)
