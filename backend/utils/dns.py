import asyncio
import functools
import operator
from collections import defaultdict
from typing import TypedDict

import niquests

DNS_RECORD_TYPES_BY_DECIMAL = {
    1: "A",
    28: "AAAA",
    257: "CAA",
    5: "CNAME",
    48: "DNSKEY",
    43: "DS",
    15: "MX",
    35: "NAPTR",
    2: "NS",
    12: "PTR",
    6: "SOA",
    33: "SRV",
    16: "TXT",
}

DNS_RECORD_TYPES = tuple(DNS_RECORD_TYPES_BY_DECIMAL.values())


class DNSRecord(TypedDict):
    type: str
    ttl: int
    name: str
    data: str


class DNSResolver:
    async def resolve_record(self, _domain: str, _type: str) -> DNSRecord:
        raise NotImplementedError

    async def resolve_records(self, domain: str) -> dict[str, list[DNSRecord]]:
        records = await asyncio.gather(
            *[self.resolve_record(domain, t) for t in DNS_RECORD_TYPES]
        )

        records = functools.reduce(operator.iconcat, records, [])

        result = defaultdict(list)
        for r in records:
            result[r["type"]].append(r)

        return result


class CloudflareDNSResolver(DNSResolver):
    def _normalize_record(self, record: dict) -> DNSRecord:
        type = DNS_RECORD_TYPES_BY_DECIMAL.get(record["type"])
        data = record["data"]

        if type == "TXT":
            data_len = len(data)
            if data_len >= 2 and data[0] == '"' and data[data_len - 1] == '"':
                data = data[1 : data_len - 1]

        return {
            "type": type,
            "data": data,
            "ttl": record["TTL"],
        }

    async def resolve_record(self, domain: str, type: str) -> DNSRecord:
        res = await niquests.aget(
            f"https://cloudflare-dns.com/dns-query?name={domain}&type={type}",
            headers={
                "Accept": "application/dns-json",
            },
        )

        data = res.json()

        if "Answer" in data:
            return [self._normalize_record(r) for r in data["Answer"]]

        if "Authority" in data:
            return [self._normalize_record(r) for r in data["Authority"]]

        raise Exception(f"Unknown DNS query response (domain={domain}, type={type})")
