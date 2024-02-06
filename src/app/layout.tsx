import { GeistSans } from 'geist/font/sans';
import type { Metadata, Viewport } from 'next';
import PlausibleProvider from 'next-plausible';
import type { PropsWithChildren } from 'react';

import { env } from '@/env';
import { AnimatedMain } from '@/lib/framer';
import { cn } from '@/lib/utils';
import { TRPCReactProvider } from '@/trpc/react';
import { Header } from './_components/header';

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
      <head>
        <PlausibleProvider
          customDomain="https://s.aelew.dev"
          domain="lookup.tools"
          trackOutboundLinks
          taggedEvents
          selfHosted
          enabled={
            env.NODE_ENV === 'production' &&
            env.NEXT_PUBLIC_IS_MAIN_INSTANCE === '1'
          }
        />
      </head>
      <body
        className={cn(
          GeistSans.variable,
          'flex min-h-screen flex-col pb-4 font-sans antialiased lg:pb-12'
        )}
      >
        <TRPCReactProvider>
          <div className="container">
            <Header />
            <AnimatedMain initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {children}
            </AnimatedMain>
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
