type DNSRecordType =
  | 'A'
  | 'AAAA'
  | 'CAA'
  | 'CNAME'
  | 'DNSKEY'
  | 'DS'
  | 'MX'
  | 'NAPTR'
  | 'NS'
  | 'PTR'
  | 'SOA'
  | 'SRV'
  | 'TXT';

interface DNSLookupResponse {
  q: string;
  data: Record<
    DNSRecordType,
    Array<{
      type: DNSRecordType;
      name: string;
      data: string;
      ttl: number;
      attributes: {
        cloudflare?: boolean;
      };
    }>
  >;
}
