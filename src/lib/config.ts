import { env } from '@/env';

export const CACHE_REVALIDATE_SECONDS =
  env.NODE_ENV === 'development' ? 15 : 900;

export const API_BASE_URL = 'https://api.lookup.tools';
