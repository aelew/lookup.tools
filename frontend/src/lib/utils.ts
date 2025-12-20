import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { parse } from 'tldts';

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
