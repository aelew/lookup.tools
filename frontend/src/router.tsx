import { createRouter } from '@tanstack/react-router';

import { routeTree } from './routeTree.gen';

export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultNotFoundComponent: NotFound
  });

  return router;
};

function NotFound() {
  return <h1>404 Not Found</h1>;
}
