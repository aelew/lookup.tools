import { parse } from 'tldts';

export function parseDomain(hostname: string) {
  const decodedHostname = decodeURIComponent(hostname).trim().toLowerCase();
  const result = parse(decodedHostname);

  if (!result.isIcann || !result.domain) {
    throw new Error(`Invalid domain: ${hostname}`);
  }

  return result.domain;
}
