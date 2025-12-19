import { queryOptions } from '@tanstack/react-query';
import ky from 'ky';

import type { ToolKey } from './meta';

export const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_BASE_URL
});

export function getToolQueryOptions<T>(tkey: ToolKey, q?: string) {
  return queryOptions({
    enabled: !!q,
    queryKey: [tkey, q],
    queryFn: () =>
      api
        .get(`v1/resolve/${tkey}`, { searchParams: { q } }) //
        .json<T>()
  });
}
