import orjson
from aiocache import SimpleMemoryCache, cached, caches
from aiocache.serializers import BaseSerializer

DEFAULT_ALIAS = "default"


class CacheDataSerializer(BaseSerializer):
    def dumps(self, value):
        return orjson.dumps(value).decode("utf-8")

    def loads(self, value):
        if value is None:
            return None

        return orjson.loads(value)


caches.set_config(
    {
        DEFAULT_ALIAS: {
            "cache": SimpleMemoryCache,
            "serializer": {"class": CacheDataSerializer},
            "namespace": "main",
            "ttl": 60 * 15,  # 15m
        }
    }
)


def cache_route(prefix: str, ttl: int | None = None):
    """Cache-aside decorator for a single-argument compute function, keyed as "{prefix}:{arg}"."""
    kwargs = {"ttl": ttl} if ttl is not None else {}
    return cached(
        alias=DEFAULT_ALIAS,
        key_builder=lambda _, arg: f"{prefix}:{arg}",
        **kwargs,
    )
