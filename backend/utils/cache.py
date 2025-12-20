import orjson
from aiocache.serializers import BaseSerializer


class CacheDataSerializer(BaseSerializer):
    def dumps(self, value):
        return orjson.dumps(value).decode("utf-8")

    def loads(self, value):
        if value is None:
            return None

        return orjson.loads(value)
