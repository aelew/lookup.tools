import type { AnyRouteMatch } from '@tanstack/react-router';

export const TOOL_METADATA = {
  dns: {
    queryType: 'domain',
    name: 'DNS Lookup',
    description:
      "Discover a domain's DNS\xa0records, including IP\xa0addresses, name servers, and MX\xa0records.",
    disableUniversalLookup: false
  },
  whois: {
    queryType: 'domain',
    name: 'WHOIS Lookup',
    description:
      'Look up information on domain owners, registration dates, nameservers, and more.',
    disableUniversalLookup: false
  },
  subdomains: {
    queryType: 'domain',
    name: 'Subdomain Finder',
    description:
      'Scan all live subdomains of a domain, including IP\xa0addresses and server information.',
    disableUniversalLookup: false
  },
  ip: {
    queryType: 'ip',
    name: 'IP Address Lookup',
    description:
      'Find information about an IP\xa0address, including its ASN, geolocation, and threat level.',
    disableUniversalLookup: false
  },
  email: {
    queryType: 'email',
    name: 'Email Address Lookup',
    description:
      'Locate sites with created accounts and other information associated with an email address.',
    disableUniversalLookup: true
  }
} as const;

export type ToolKey = keyof typeof TOOL_METADATA;
export type ToolMetadata = (typeof TOOL_METADATA)[ToolKey];

type Entries<T> = Array<{ [K in keyof T]: [K, T[K]] }[keyof T]>;
export type ToolMetadataEntries = Entries<typeof TOOL_METADATA>;

export const APP_NAME = 'Lookup Tools';
export const APP_DESCRIPTION =
  'The cyber swiss army knife of lookup tools. Research information on domains, IP addresses, email addresses, and more.';

export function t(s?: string) {
  return s ? `${s} | ${APP_NAME}` : APP_NAME;
}

export function getToolMetadata(
  tkey: ToolKey,
  query: boolean
): AnyRouteMatch['meta'] {
  const tool = TOOL_METADATA[tkey];

  return [
    { title: t(tool.name) },
    { name: 'description', content: tool.description },
    ...(query ? [{ name: 'robots', content: 'noindex' }] : [])
  ];
}
