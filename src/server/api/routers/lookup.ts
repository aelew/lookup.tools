import { getAllRecords } from '@layered/dns-records';
import maxmind, { type CityResponse } from 'maxmind';

import { dnsSchema, ipSchema } from '@/app/(tools)/schema';
import { getRaw, WhoisParser } from '@/lib/whis';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const lookupRouter = createTRPCRouter({
  dns: publicProcedure
    .input(dnsSchema)
    .mutation(async ({ input }) => getAllRecords(input.domain)),
  whois: publicProcedure.input(dnsSchema).mutation(async ({ input }) => {
    let raw, result;
    try {
      raw = await getRaw(input.domain);
      result = WhoisParser(raw);
    } catch {
      return { raw, result };
    }
    return { raw, result };
  }),
  ip: publicProcedure.input(ipSchema).mutation(async ({ input }) => {
    const lookup = await maxmind.open<CityResponse>(
      process.cwd() + '/GeoLite2-City.mmdb'
    );
    return lookup.get(input.ip);
  })
});
