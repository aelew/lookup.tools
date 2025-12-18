import { type QueryClient } from '@tanstack/react-query';
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts
} from '@tanstack/react-router';
import type { PropsWithChildren } from 'react';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Logo } from '@/components/layout/logo';
import { Providers } from '@/components/providers';
import styles from '../styles.css?url';

interface RootRouteContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RootRouteContext>()({
  shellComponent: RootDocument,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { title: 'Lookup Tools' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    links: [
      {
        rel: 'stylesheet',
        href: styles
      }
    ]
  })
});

function RootDocument({ children }: PropsWithChildren) {
  const { queryClient } = Route.useRouteContext();

  return (
    <html lang="en" suppressHydrationWarning={import.meta.env.DEV}>
      <head>
        <HeadContent />
      </head>
      <body className="relative flex min-h-screen flex-col">
        <Providers queryClient={queryClient}>
          <Header />
          <main className="container-layout flex-1">{children}</main>
          <Footer />
        </Providers>
        <Logo className="pointer-events-none fixed top-1/6 left-1/3 -z-50 size-48 opacity-5 select-none sm:size-64 lg:top-1/10 lg:size-128" />
        <Scripts />
      </body>
    </html>
  );
}
