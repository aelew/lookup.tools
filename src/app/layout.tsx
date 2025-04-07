import { GeistSans } from 'geist/font/sans';
import type { Metadata, Viewport } from 'next';
import PlausibleProvider from 'next-plausible';
import { ThemeProvider } from 'next-themes';
import type { PropsWithChildren } from 'react';

import { env } from '@/env';
import { AnimatedMain } from '@/lib/framer';
import { cn } from '@/lib/utils';
import { TRPCReactProvider } from '@/trpc/react';
import { Footer } from './_components/footer';
import { Header } from './_components/header';

import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Lookup Tools',
    template: '%s | Lookup Tools'
  },
  description:
    'The cyber swiss army knife of lookup tools. Research information on domains, IP addresses, emails, and more.'
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PlausibleProvider
          customDomain="https://nom.aelew.dev"
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
        suppressHydrationWarning
        className={cn(
          GeistSans.variable,
          'flex min-h-screen flex-col font-sans antialiased'
        )}
      >
        <TRPCReactProvider>
          <ThemeProvider
            enableSystem
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
          >
            <div className="container flex flex-1 flex-col">
              <Header />
              <AnimatedMain
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1"
              >
                {children}
              </AnimatedMain>
              <Footer />
            </div>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
