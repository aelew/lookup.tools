import { getAllRecords } from '@layered/dns-records';

import { dnsSchema } from '@/app/(tools)/schema';
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
  })
});
