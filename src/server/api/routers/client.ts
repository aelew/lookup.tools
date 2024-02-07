import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const clientRouter = createTRPCRouter({
  ip: publicProcedure.query(({ ctx }) => {
    return {
      data:
        ctx.headers.get('cf-connecting-ip') ??
        ctx.headers.get('x-forwarded-for')
    };
  })
});
