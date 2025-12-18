import { useQuery } from '@tanstack/react-query';
import { createFileRoute, notFound } from '@tanstack/react-router';

import { getQueryOptions } from '@/lib/query';

interface ResolveDNSResponse {
  q: string;
  data: Record<
    string,
    {
      type: string;
      data: string;
      ttl: number;
    }
  >;
}

export const Route = createFileRoute('/_tool/dns')({
  component: RouteComponent
});

function RouteComponent() {
  const { q } = Route.useSearch();
  if (!q) {
    throw notFound();
  }

  const query = useQuery(getQueryOptions<ResolveDNSResponse>('dns', q));

  const records = query.data?.data;

  return <pre>{JSON.stringify(records, null, 4)}</pre>;
}
