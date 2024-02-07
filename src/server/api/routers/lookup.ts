import isCloudflare from '@authentication/cloudflare-ip';
import ky from 'ky';
import ping from 'ping';
import { parse } from 'tldts';

import { domainSchema, ipSchema } from '@/app/(tools)/schema';
import { API_BASE_URL } from '@/lib/config';
import { GENERIC_ERROR } from '@/lib/constants';
import { assertFulfilled } from '@/lib/utils';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import type { DNSResolveResult } from '@/types/tools/dns';
import type { IPResult } from '@/types/tools/ip';
import type { CertificateInfo } from '@/types/tools/subdomain';
import type { WhoisResult } from '@/types/tools/whois';

export const lookupRouter = createTRPCRouter({
  dns: publicProcedure.input(domainSchema).mutation(async ({ input }) => {
    let result;
    try {
      result = await ky
        .get(`${API_BASE_URL}/dns/${encodeURIComponent(input.domain)}`, {
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
    } catch {
      result = GENERIC_ERROR;
    }
    return result;
  }),
  whois: publicProcedure.input(domainSchema).mutation(async ({ input }) => {
    let result;
    try {
      result = await ky
        .get(`${API_BASE_URL}/whois/${encodeURIComponent(input.domain)}`, {
          throwHttpErrors: false
        })
        .json<WhoisResult>();
    } catch {
      result = GENERIC_ERROR;
    }
    return result;
  }),
  ip: publicProcedure.input(ipSchema).mutation(async ({ input }) => {
    let result;
    try {
      result = await ky
        .get(`${API_BASE_URL}/ip/${encodeURIComponent(input.ip)}`, {
          throwHttpErrors: false
        })
        .json<IPResult>();
    } catch {
      result = GENERIC_ERROR;
    }
    return result;
  }),
  subdomain: publicProcedure.input(domainSchema).mutation(async ({ input }) => {
    const certs = await ky
      .get('https://crt.sh', {
        timeout: 20000,
        searchParams: {
          q: `%.${input.domain}`,
          output: 'json'
        }
      })
      .json<CertificateInfo[]>();

    // Remove duplicates with a set
    const hosts = [...new Set(certs.map((c) => c.common_name))]
      // Remove wildcard domains and other domains that don't match the input domain
      .filter(
        (h) =>
          !h.includes('*') &&
          (h === input.domain || h.endsWith(`.${input.domain}`))
      )
      // Root first, WWW second, then everything else alphabetically
      .sort((a, b) => {
        const isRootA = a === input.domain;
        const isRootB = b === input.domain;
        if (isRootA) return -1;
        if (isRootB) return 1;
        if (a === `www.${input.domain}`) return isRootB ? 1 : -1;
        if (b === `www.${input.domain}`) return isRootA ? -1 : 1;
        return a.localeCompare(b);
      });

    const pings = await Promise.allSettled(
      hosts.map((h) => ping.promise.probe(h))
    );

    return pings
      .filter(assertFulfilled)
      .filter((p) => {
        const ip = p.value.numeric_host?.replace(')', '');
        return ip && parse(ip).isIp;
      })
      .map((p) => {
        const ip = p.value.numeric_host!.replace(')', '');
        return {
          ip,
          subdomain: p.value.inputHost,
          cloudflare: isCloudflare(ip)
        };
      });
  })
});
