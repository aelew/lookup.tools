import { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';

import { routeTree } from './routeTree.gen';

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5m
        gcTime: 1000 * 60 * 60 * 24 // 24h - cache time
      }
    }
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultNotFoundComponent: NotFound
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
    wrapQueryClient: false
  });

  return router;
}

function NotFound() {
  return <h1>404 Not Found</h1>;
}
