import { GeistSans } from 'geist/font/sans';
import type { PropsWithChildren } from 'react';

import { AnimatedMain } from '@/lib/framer';
import { cn } from '@/lib/utils';
import { Blob } from './_components/blob';
import { Header } from './_components/header';
import { Providers } from './providers';

import '@/styles/globals.css';

export const metadata = { title: 'Lookup Tools' };

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body
        className={cn(
          GeistSans.variable,
          'container flex min-h-screen flex-col pb-4 font-sans antialiased lg:pb-12'
        )}
      >
        <Providers>
          <Blob />
          <Header />
          <AnimatedMain initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {children}
          </AnimatedMain>
        </Providers>
      </body>
    </html>
  );
}
