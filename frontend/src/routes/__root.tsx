import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router';
import { ThemeProvider } from 'tanstack-theme-kit';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Logo } from '@/components/layout/logo';
import appCss from '../styles.css?url';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { title: 'Lookup Tools' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss
      }
    ]
  }),
  shellComponent: RootDocument
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="container-layout relative flex min-h-screen flex-col">
        <ThemeProvider
          enableSystem
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          {/* <TanStackDevtools
            config={{ position: 'bottom-right' }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />
              }
            ]}
          /> */}
          <Scripts />
          <Logo className="pointer-events-none absolute top-1/6 left-1/3 -z-50 size-48 opacity-5 select-none sm:size-64 lg:top-1/10 lg:size-128" />
        </ThemeProvider>
      </body>
    </html>
  );
}
