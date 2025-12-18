import { z } from 'zod';

const DOMAIN_REGEX =
  /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/;

const m = (type: string) => `Please enter a valid ${type}.`;

export const domainSchema = z.object({
  q: z.string().refine((d) => DOMAIN_REGEX.test(d), { error: m('domain') })
});

export const ipSchema = z.object({
  q: z.union([z.ipv4(), z.ipv6()], { error: m('IP address') })
});

export const emailSchema = z.object({
  q: z.email({ message: m('email address') })
});
