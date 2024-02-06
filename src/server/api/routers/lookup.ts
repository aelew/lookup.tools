import isCloudflare from '@authentication/cloudflare-ip';
// @ts-expect-error package has no types
import { getAllRecords } from '@layered/dns-records';
import ky from 'ky';
import ping from 'ping';

import { domainSchema, ipSchema } from '@/app/(tools)/schema';
import { getIPData } from '@/lib/ip';
import { assertFulfilled } from '@/lib/utils';
import { getWhoisData } from '@/lib/whois';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

type GetAllRecordsFn = (domain: string) => Promise<
  Record<
    string,
    {
      type: string;
      name: string;
      ttl: string;
      value: string;
      cloudflare?: boolean;
    }[]
  >
>;

type CertificateInfo = {
  issuer_ca_id: number;
  issuer_name: string;
  common_name: string;
  name_value: string;
  id: number;
  entry_timestamp: string;
  not_before: string;
  not_after: string;
  serial_number: string;
  result_count: number;
};

export const lookupRouter = createTRPCRouter({
  dns: publicProcedure.input(domainSchema).mutation(async ({ input }) => {
    let result;
    try {
      result = await (getAllRecords as GetAllRecordsFn)(input.domain);
      // Perform Cloudflare checks
      result.A?.forEach((r) => (r.cloudflare = isCloudflare(r.value)));
      result.AAAA?.forEach((r) => (r.cloudflare = isCloudflare(r.value)));
    } catch {
      result = null;
    }
    return result;
  }),
  whois: publicProcedure.input(domainSchema).mutation(async ({ input }) => {
    return getWhoisData(input.domain);
  }),
  ip: publicProcedure.input(ipSchema).mutation(async ({ input }) => {
    return getIPData(input.ip);
  }),
  subdomain: publicProcedure.input(domainSchema).mutation(async ({ input }) => {
    const certs = await ky
      .get('https://crt.sh', {
        searchParams: {
          q: `%.${input.domain}`,
          output: 'json'
        }
      })
      .json<CertificateInfo[]>();

    // Remove duplicates with a set, then sort the subdomains by root domain first and everything else alphabetically
    const hosts = [...new Set(certs.map((c) => c.common_name))]
      .filter((h) => h !== 'sni.cloudflaressl.com')
      .sort((a, b) => {
        if (a === input.domain) {
          return -1;
        }
        if (b === input.domain) {
          return 1;
        }
        return a.localeCompare(b);
      });

    const pings = await Promise.allSettled(
      hosts.map((h) => ping.promise.probe(h))
    );

    return pings.filter(assertFulfilled).map((p) => {
      const ip = p.value.numeric_host?.replace(')', '');
      return {
        ip,
        subdomain: p.value.inputHost,
        cloudflare: ip ? isCloudflare(ip) : false
      };
    });
  })
});
