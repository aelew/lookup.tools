import { env } from '@/env';

const dev = env.NODE_ENV === 'development';

export const TOOL_REVALIDATION_INTERVAL = dev ? 10 : 60; // s
