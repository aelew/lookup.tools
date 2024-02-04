'use client';

import { AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import type { PropsWithChildren } from 'react';

import { TRPCReactProvider } from '@/trpc/react';

export function Providers({ children }: PropsWithChildren) {
  const pathname = usePathname();
  return (
    <TRPCReactProvider>
      <AnimatePresence mode="popLayout" key={encodeURIComponent(pathname)}>
        {children}
      </AnimatePresence>
    </TRPCReactProvider>
  );
}
