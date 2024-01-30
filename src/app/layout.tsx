import { GeistSans } from 'geist/font/sans';
import type { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';
import { TRPCReactProvider } from '@/trpc/react';
import { Header } from './_components/header';

import '@/styles/globals.css';

export const metadata = { title: 'Lookup Tools' };

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body
        className={cn(
          GeistSans.variable,
          'container flex min-h-screen flex-col font-sans antialiased'
        )}
      >
        <TRPCReactProvider>
          <Header />
          <main>{children}</main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
