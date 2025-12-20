import { useQueries } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { ExternalLinkIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
              <Button
                key={website}
                variant="secondary"
                nativeButton={false}
                className={cn(
                  'h-auto justify-between p-2 font-normal',
                  registered
                    ? 'border-green-600'
                    : 'border-red-500/50 opacity-65'
                )}
                render={
                  <a
                    rel="nofollow noopener noreferrer"
                    href={`https://${website}`}
                    target="_blank"
                  />
                }
              >
                <p className="flex min-w-0 items-center gap-2">
                  <span className="ring-muted-foreground/25 relative size-5 bg-white shadow ring-1">
                    <img
                      className="aspect-square rounded-lg object-contain p-0.5 select-none"
                      src={`https://api.favicon.victr.me/blob/https://${website}`}
                      draggable={false}
                      alt=""
                    />
                  </span>
                  <span className="truncate">{website}</span>
                </p>
                <ExternalLinkIcon className="mr-0.5 size-4 shrink-0 opacity-50" />
              </Button>
            ))}
        </CardContent>
      </Card>
    </section>
  );
}
