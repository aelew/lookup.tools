import { env } from '@/env';

export const CACHE_REVALIDATE_SECONDS =
  env.NODE_ENV === 'development' ? 15 : 900;
