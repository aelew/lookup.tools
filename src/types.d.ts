declare module '@layered/dns-records' {
  type DNSRecord = { type: string; name: string; ttl: string; value: string };
  const getAllRecords: (domain: string) => Promise<Record<string, DNSRecord[]>>;
}
