import { decompress } from '@cloudpss/zstd';

const ZST_URL =
  'https://raw.githubusercontent.com/wyot1/GeoLite2-Unwalled/downloads/CITY/MMDB-ZST/GeoLite2-City.mmdb.zst';

export function getGeoLite2CityBuffer() {
  return fetch(ZST_URL)
    .then((r) => r.arrayBuffer())
    .then(decompress)
    .then((uint8) => Buffer.from(uint8));
}
