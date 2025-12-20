export interface SubdomainsLookupResponse {
  q: string;
  data: Array<{
    fqdn: string;
    ip: string;
    attributes: {
      cloudflare: boolean;
    };
  }>;
}
