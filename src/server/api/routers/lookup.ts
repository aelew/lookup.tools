import isCloudflare from '@authentication/cloudflare-ip';
import ky from 'ky';

import { domainSchema, emailSchema, ipSchema } from '@/app/(tools)/schema';
import { env } from '@/env';
import { API_BASE_URL } from '@/lib/config';
import { GENERIC_ERROR } from '@/lib/constants';
import { assertFulfilled } from '@/lib/utils';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import type { DNSResolveResult } from '@/types/tools/dns';
import type {
  GoogleProfileResult,
  RegisteredAccountsResult
} from '@/types/tools/email';
import type { IPResult } from '@/types/tools/ip';
import type { CertificateInfo, PingResult } from '@/types/tools/subdomain';
import type { WhoisResult } from '@/types/tools/whois';

const api = ky.create({
  headers: { 'x-api-secret': env.API_SECRET_KEY },
  prefixUrl: API_BASE_URL
});

export const lookupRouter = createTRPCRouter({
  dns: publicProcedure.input(domainSchema).mutation(async ({ input }) => {
    const result = await api
      .get(`dns/${input.domain}`, {
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
  }),
  whois: publicProcedure.input(domainSchema).mutation(async ({ input }) => {
    return api
      .get(`whois/${input.domain}`, { throwHttpErrors: false })
      .json<WhoisResult>();
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
      hosts.map((h) => api.get(`ping/${h}`, { retry: 0 }).json<PingResult>())
    );

    return {
      success: true,
      data: pings
        .filter(assertFulfilled)
        .filter((p) => p.value.success && p.value.ip)
        .map((p) => {
          if (!p.value.success || !p.value.ip) {
            throw new Error(
              'This will never throw but I cba to fix the type guard right now :('
            );
          }
          return {
            ip: p.value.ip,
            subdomain: p.value.input,
            cloudflare: isCloudflare(p.value.ip)
          };
        })
    };
  }),
  ip: publicProcedure.input(ipSchema).mutation(async ({ input }) => {
    return api
      .get(`ip/${input.ip}`, { throwHttpErrors: false })
      .json<IPResult>();
  }),
  google: publicProcedure.input(emailSchema).mutation(async ({ input }) => {
    return api
      .get(`google/${input.email}`, { timeout: 10000 })
      .json<GoogleProfileResult>();
  }),
  accounts: publicProcedure.input(emailSchema).mutation(async ({ input }) => {
    let result;
    try {
      result = await api
        .get(`accounts/${input.email}`, { timeout: 20000 })
        .json<RegisteredAccountsResult>();
      result.websites = result.websites.filter(
        (w) => w.status === 'registered'
      );
    } catch {
      result = GENERIC_ERROR;
    }
    return result;
  })
});
