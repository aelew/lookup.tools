export const TOOL_METADATA = {
  dns: {
    queryType: 'domain',
    name: 'DNS Lookup',
    description:
      "Discover a domain's DNS records, including IP address, name servers, and MX records."
  },
  whois: {
    queryType: 'domain',
    name: 'WHOIS Lookup',
    description:
      'Look up information on domain owners, registration dates, nameservers, and more.'
  },
  subdomains: {
    queryType: 'domain',
    name: 'Subdomain Finder',
    description:
      'Scan all live subdomains of a domain, including IP addresses and server information.'
  },
  ip: {
    queryType: 'ip',
    name: 'IP Address Lookup',
    description:
      'Find information about an IP address, including its ASN, geolocation, and threat level.'
  },
  email: {
    queryType: 'email',
    name: 'Email Address Lookup',
    description:
      'Locate sites with created accounts and other information associated with an email address.'
  }
} as const;

export type ToolKey = keyof typeof TOOL_METADATA;
export type ToolMetadata = (typeof TOOL_METADATA)[ToolKey];

type Entries<T> = Array<{ [K in keyof T]: [K, T[K]] }[keyof T]>;
export type ToolMetadataEntries = Entries<typeof TOOL_METADATA>;
