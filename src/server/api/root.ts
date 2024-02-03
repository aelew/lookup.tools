import { lookupRouter } from '@/server/api/routers/lookup';
import { createTRPCRouter } from '@/server/api/trpc';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  lookup: lookupRouter
});

export type AppRouter = typeof appRouter;
