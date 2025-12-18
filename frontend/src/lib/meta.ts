export type QueryType = 'domain' | 'ip' | 'email';

export const TOOL_METADATA = {
  dns: {
    type: 'domain',
    name: 'DNS Lookup',
    description:
      "Discover a domain's DNS records, including IP address, name servers, and MX records."
  },
  whois: {
    type: 'domain',
    name: 'WHOIS Lookup',
    description:
      'Look up information on domain owners, registration dates, nameservers, and more.'
  },
  subdomains: {
    type: 'domain',
    name: 'Subdomain Finder',
    description:
      'Scan all live subdomains of a domain, including IP addresses and server information.'
  },
  ip: {
    type: 'ip',
    name: 'IP Address Lookup',
    description:
      'Find information about an IP address, including its ASN, geolocation, and threat level.'
  },
  email: {
    type: 'email',
    name: 'Email Address Lookup',
    description:
      'Locate sites with created accounts and other information associated with an email address.'
  }
};

export type ToolKey = keyof typeof TOOL_METADATA;
export type ToolMetadata = (typeof TOOL_METADATA)[ToolKey];

type Entries<T> = Array<{ [K in keyof T]: [K, T[K]] }[keyof T]>;
export type ToolMetadataEntries = Entries<typeof TOOL_METADATA>;
