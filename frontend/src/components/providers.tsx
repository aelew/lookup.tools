'use client';

import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import type { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import type { PropsWithChildren } from 'react';
import { ThemeProvider } from 'tanstack-theme-kit';

export function Providers({
  queryClient,
  children
}: PropsWithChildren<{ queryClient: QueryClient }>) {
  const persister = createAsyncStoragePersister({
    storage:
      typeof window !== 'undefined'
        ? window.localStorage //
        : undefined
  });

  return (
    <ThemeProvider
      enableSystem
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
    >
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        {children}
      </PersistQueryClientProvider>
    </ThemeProvider>
  );
}
