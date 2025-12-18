import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { parse } from 'tldts';

export const DNS_RECORD_TYPES_BY_DECIMAL = {
  1: 'A',
  28: 'AAAA',
  257: 'CAA',
  5: 'CNAME',
  48: 'DNSKEY',
  43: 'DS',
  15: 'MX',
  35: 'NAPTR',
  2: 'NS',
  12: 'PTR',
  6: 'SOA',
  33: 'SRV',
  16: 'TXT'
} as const;

export type DNSRecordType =
  (typeof DNS_RECORD_TYPES_BY_DECIMAL)[keyof typeof DNS_RECORD_TYPES_BY_DECIMAL];

export const DNS_RECORD_TYPES = Object.values(DNS_RECORD_TYPES_BY_DECIMAL);

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

export function parseDomain(hostname: string) {
  const decodedHostname = decodeURIComponent(hostname).trim().toLowerCase();
  const result = parse(decodedHostname);

  if (!result.isIcann || !result.domain) {
    throw new Error(`Invalid domain: ${hostname}`);
  }

  return result.domain;
}
