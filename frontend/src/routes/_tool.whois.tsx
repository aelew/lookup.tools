import { useQuery } from '@tanstack/react-query';
import { createFileRoute, notFound } from '@tanstack/react-router';

import { getQueryOptions } from '@/lib/query';

interface ResolveWHOISResponse {
  q: string;
  data: Record<string, string | Array<string> | null>;
  raw: string;
}

export const Route = createFileRoute('/_tool/whois')({
  component: RouteComponent
});

function RouteComponent() {
  const { q } = Route.useSearch();
  if (!q) {
    throw notFound();
  }

  const query = useQuery(getQueryOptions<ResolveWHOISResponse>('whois', q));

  const raw = query.data?.raw;
  if (!raw) {
    return null;
  }

  return <pre className="break-all">{raw}</pre>;
}
