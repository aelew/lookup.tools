import { GeistSans } from 'geist/font/sans';
import type { Metadata, Viewport } from 'next';
import type { PropsWithChildren } from 'react';

import { AnimatedMain } from '@/lib/framer';
import { cn } from '@/lib/utils';
import { Header } from './_components/header';
import { Providers } from './providers';

import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Lookup Tools',
    template: '%s | Lookup Tools'
  },
  description:
    'The cyber swiss army knife of lookup tools. Research information on domains, IP addresses, email addresses, phone numbers, and more.'
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

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
          <Header />
          <AnimatedMain initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {children}
          </AnimatedMain>
        </Providers>
      </body>
    </html>
  );
}
