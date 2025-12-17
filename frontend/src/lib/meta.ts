export const TOOL_METADATA = {
  dns: {
    name: 'DNS Lookup',
    description:
      "Discover a domain's DNS records, including IP address, name servers, and MX records."
  },
  whois: {
    name: 'WHOIS Lookup',
    description:
      'Look up information on domain owners, registration dates, nameservers, and more.'
  },
  subdomain: {
    name: 'Subdomain Finder',
    description:
      'Scan all live subdomains of a domain, including IP addresses and server information.'
  },
  ip: {
    name: 'IP Address Lookup',
    description:
      'Find information about an IP address, including its ASN, geolocation, and threat level.'
  },
  email: {
    name: 'Email Address Lookup',
    description:
      'Locate sites with created accounts and other information associated with an email address.'
  }
};

export type ToolKey = keyof typeof TOOL_METADATA;
