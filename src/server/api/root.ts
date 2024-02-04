import { createTRPCRouter } from '@/server/api/trpc';
import { clientRouter } from './routers/client';
import { lookupRouter } from './routers/lookup';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  client: clientRouter,
  lookup: lookupRouter
});

export type AppRouter = typeof appRouter;
