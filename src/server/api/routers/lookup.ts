import isCloudflare from '@authentication/cloudflare-ip';
// @ts-expect-error package has no types
import { getAllRecords } from '@layered/dns-records';

import { dnsSchema, ipSchema } from '@/app/(tools)/schema';
import { getIPData } from '@/lib/ip';
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

export const lookupRouter = createTRPCRouter({
  dns: publicProcedure.input(dnsSchema).mutation(async ({ input }) => {
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
  whois: publicProcedure.input(dnsSchema).mutation(async ({ input }) => {
    return getWhoisData(input.domain);
  }),
  ip: publicProcedure.input(ipSchema).mutation(async ({ input }) => {
    return getIPData(input.ip);
  })
});
