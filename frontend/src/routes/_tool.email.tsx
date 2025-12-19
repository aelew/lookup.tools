import { useQueries } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { ExternalLinkIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/query';
import { cn } from '@/lib/utils';
import type { EmailAccountsLookupResponse } from '@/types/tools/email';

export const Route = createFileRoute('/_tool/email')({
  component: RouteComponent
});

function RouteComponent() {
  const { q } = Route.useSearch();

  const [accountsQuery] = useQueries({
    queries: [
      {
        enabled: !!q,
        queryKey: ['email', 'accounts', q],
        queryFn: () =>
          api
            .get('v1/resolve/accounts', {
              searchParams: { q },
              timeout: 60000
            })
            .json<EmailAccountsLookupResponse>()
      }
    ]
  });

  const accounts = accountsQuery.data?.data;

  if (!accounts) {
    return null;
  }

  return (
    <section className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Known Registered Accounts</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(accounts)
            .sort(([websiteA, registeredA], [websiteB, registeredB]) => {
              // registered first
              if (registeredA !== registeredB) {
                return registeredA ? -1 : 1;
              }
              // alphabetically
              return websiteA.localeCompare(websiteB);
            })
            .map(([website, registered]) => (
              <a
                rel="nofollow noopener noreferrer"
                href={`https://${website}`}
                className="contents"
                target="_blank"
                key={website}
              >
                <Card
                  className={cn(
                    'transition-color-transform hover:bg-accent/80 relative flex flex-row items-center justify-between p-2 shadow-md ring-1',
                    registered ? 'ring-green-500' : 'opacity-50 ring-red-500/50'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className="ring-muted-foreground/25 relative size-5 bg-white shadow ring-1">
                      <img
                        className="aspect-square rounded-lg object-contain p-0.5 select-none"
                        src={`https://api.favicon.victr.me/blob/https://${website}`}
                        draggable={false}
                        alt=""
                      />
                    </div>
                    <p>{website}</p>
                  </div>
                  <ExternalLinkIcon className="mr-1.5 size-4" />
                </Card>
              </a>
            ))}
        </CardContent>
      </Card>
    </section>
  );
}
