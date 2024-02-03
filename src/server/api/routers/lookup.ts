import { domain as whoisLookup } from 'whoiser';

import { dnsSchema } from '@/app/(tools)/schema';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const lookupRouter = createTRPCRouter({
  dns: publicProcedure.input(dnsSchema).mutation(async ({ input }) => {
    return whoisLookup(input.domain, {
      raw: true,
      follow: 1,
      ignorePrivacy: false
    });
  })
});
