import isCloudflare from '@authentication/cloudflare-ip';
// @ts-expect-error package has no types
import { getAllRecords } from '@layered/dns-records';
import { Reader, type CityResponse } from 'maxmind';

import { dnsSchema, ipSchema } from '@/app/(tools)/schema';
import { getGeoLite2CityBuffer } from '@/lib/maxmind';
import { getWHOISData } from '@/lib/whois';
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
    const result = await (getAllRecords as GetAllRecordsFn)(input.domain);

    // Perform Cloudflare checks
    result.A?.forEach((r) => (r.cloudflare = isCloudflare(r.value)));
    result.AAAA?.forEach((r) => (r.cloudflare = isCloudflare(r.value)));

    return result;
  }),
  whois: publicProcedure.input(dnsSchema).mutation(async ({ input }) => {
    return getWHOISData(input.domain);
  }),
  ip: publicProcedure.input(ipSchema).mutation(async ({ input }) => {
    let result;
    try {
      const buffer = await getGeoLite2CityBuffer();
      const lookup = new Reader<CityResponse>(buffer);
      result = lookup.get(input.ip);
    } catch {
      result = null;
    }
    return result;
  })
});
