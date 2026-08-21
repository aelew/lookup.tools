from utils.cache import cache_route
from utils.dns import CloudflareDNSResolver


@cache_route("dns")
async def get_dns_records(root_domain: str):
    resolver = CloudflareDNSResolver()
    records = await resolver.resolve_records(root_domain)

    return {"q": root_domain, "data": records}
