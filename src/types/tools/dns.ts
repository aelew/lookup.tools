export type DNSRecordType =
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

export type DNSRecord = {
  type: DNSRecordType;
  ttl: number;
  name: string;
  data: string;
  cloudflare: boolean;
};

export type DNSResolveResult =
  | { success: true; records: Record<DNSRecordType, DNSRecord[]> }
  | { success: false; error: string };
