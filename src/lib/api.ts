import isCloudflare from '@authentication/cloudflare-ip';
import ky from 'ky';

import { env } from '@/env';
import { GENERIC_ERROR } from '@/lib/constants';
import { assertFulfilled } from '@/lib/utils';
import type { DNSResolveResult } from '@/types/tools/dns';
import type {
  GoogleProfileResult,
  RegisteredAccountsResult
} from '@/types/tools/email';
import type { IPResult } from '@/types/tools/ip';
import type { CertificateInfo, PingResult } from '@/types/tools/subdomain';
import type { WHOISResult } from '@/types/tools/whois';

const client = ky.create({
  headers: { 'X-API-Secret': env.API_SECRET_KEY },
  prefixUrl: 'https://api.lookup.tools'
});

export async function lookupDNS(domain: string) {
  const result = await client
    .get(`dns/${domain}`, {
      searchParams: { type: 'cloudflare' },
      throwHttpErrors: false
    })
    .json<DNSResolveResult>();

  if (result.success) {
    Object.entries(result.records)
      .filter(([type]) => type === 'A' || type === 'AAAA')
      .forEach(([_, records]) => {
        records.forEach((record) => {
          record.cloudflare = isCloudflare(record.data);
        });
      });
  }

  return result;
}

export async function lookupWHOIS(domain: string) {
  return client
    .get(`whois/${domain}`, { throwHttpErrors: false })
    .json<WHOISResult>();
}

export async function lookupSubdomains(domain: string) {
  const certs = await ky
    .get('https://crt.sh', {
      timeout: 30000,
      searchParams: {
        q: `%.${domain}`,
        output: 'json'
      }
    })
    .json<CertificateInfo[]>();

  // Remove duplicates with a set
  const hosts = [...new Set(certs.map((c) => c.common_name))]
    // Remove wildcard domains and other domains that don't match the input domain
    .filter(
      (h) => !h.includes('*') && (h === domain || h.endsWith(`.${domain}`))
    )
    // Root first, WWW second, then everything else alphabetically
    .sort((a, b) => {
      const isRootA = a === domain;
      const isRootB = b === domain;
      if (isRootA) return -1;
      if (isRootB) return 1;
      if (a === `www.${domain}`) return isRootB ? 1 : -1;
      if (b === `www.${domain}`) return isRootA ? -1 : 1;
      return a.localeCompare(b);
    });

  const pings = await Promise.allSettled(
    hosts.map((h) => client.get(`ping/${h}`, { retry: 0 }).json<PingResult>())
  );

  return {
    success: true,
    data: pings
      .filter(assertFulfilled)
      .filter((p) => p.value.success && p.value.ip)
      .map((p) => {
        if (!p.value.success || !p.value.ip) {
          throw new Error('This should never throw!');
        }
        return {
          ip: p.value.ip,
          subdomain: p.value.input,
          cloudflare: isCloudflare(p.value.ip)
        };
      })
  };
}

export async function lookupIP(ip: string) {
  return client.get(`ip/${ip}`, { throwHttpErrors: false }).json<IPResult>();
}

export async function lookupGoogle(email: string) {
  return client
    .get(`google/${email}`, { timeout: 30000 })
    .json<GoogleProfileResult>();
}

export async function lookupAccounts(email: string) {
  let result;

  try {
    result = await client
      .get(`accounts/${email}`, { timeout: 30000 })
      .json<RegisteredAccountsResult>();

    result.websites = result.websites.filter((w) => w.status === 'registered');
  } catch {
    result = GENERIC_ERROR;
  }

  return result;
}
