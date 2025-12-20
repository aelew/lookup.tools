import { z } from 'zod';

const DOMAIN_REGEX =
  /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/;

const m = (type: string) => `Please enter a valid ${type}.`;

export const QUERY_SCHEMAS = {
  domain: z
    .string()
    .trim()
    .toLowerCase()
    .refine((d) => DOMAIN_REGEX.test(d), { error: m('domain') }),

  email: z
    .email({
      message: m('email address')
    })
    .trim()
    .toLowerCase(),

  ip: z.union(
    [z.ipv4(), z.ipv6()], //
    { error: m('IP address') }
  )
};

export type QueryType = keyof typeof QUERY_SCHEMAS;
