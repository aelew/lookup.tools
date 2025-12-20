'use client';

import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/query';

export function useVisitorIPQuery() {
  return useQuery({
    queryKey: ['visitor_ip'],
    queryFn: () => api.get('visitor').json<{ ip: string }>(),
    staleTime: 5,
    gcTime: 10
  });
}
