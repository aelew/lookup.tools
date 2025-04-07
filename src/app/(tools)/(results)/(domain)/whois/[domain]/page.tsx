import { GlobeIcon, UserSearchIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Date } from '@/components/date';
import { ErrorState } from '@/components/error-state';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { CACHE_REVALIDATE_SECONDS } from '@/lib/config';
import { EPP_STATUS_CODES } from '@/lib/constants';
import { TOOLS } from '@/lib/resources/tools';
import { parseDomain } from '@/lib/utils';
import { api } from '@/trpc/server';
import type { InfoTable } from '@/types';
import type { ContactInfo } from '@/types/tools/whois';
import { DomainNotRegistered } from '../../_components/domain-not-registered';

interface WhoisLookupResultPageProps {
  params: Promise<{ domain: string }>;
}

const getCachedWhoisLookup = unstable_cache(
  async (domain: string) => api.lookup.whois.mutate({ domain }),
  ['whois_lookup'],
  { revalidate: CACHE_REVALIDATE_SECONDS }
);

export async function generateMetadata(props: WhoisLookupResultPageProps) {
  const params = await props.params;
  const domain = parseDomain(params.domain);
  if (!domain) {
    notFound();
  }
  const result = await getCachedWhoisLookup(domain);
  return {
    title: `WHOIS Lookup for ${domain}`,
    robots: result ? 'noindex' : null,
    description: TOOLS.find((tool) => tool.slug === 'whois')?.description
  } satisfies Metadata;
}

export default async function WhoisLookupResultPage(
  props: WhoisLookupResultPageProps
) {
  const params = await props.params;
  const domain = parseDomain(params.domain);
  if (!domain) {
    notFound();
  }

  const result = await getCachedWhoisLookup(domain);
  if (!result.success) {
    if (result.error === 'domain_not_found') {
      return <DomainNotRegistered domain={domain} />;
    }
    return (
      <ErrorState
        description={
          <p>
            Error code:{' '}
            <span className="font-mono text-sm">{result.error}</span>
          </p>
        }
      />
    );
  }

  const getContactInfoKeys = (contact?: ContactInfo) => ({
    Name: () => contact?.name,
    Organization: () => contact?.organization,
    Street: () => contact?.street,
    City: () => contact?.city,
    State: () => contact?.province,
    'Postal Code': () => contact?.postal_code,
    Country: () => contact?.country,
    Phone: () => contact?.phone,
    Email: () => {
      if (!contact?.email) {
        return null;
      }
      if (contact.email.includes('@')) {
        return (
          <Link
            className="break-all hover:underline"
            href={`mailto:${contact.email}`}
          >
            {contact.email}
          </Link>
        );
      }
      if (contact.email.startsWith('http')) {
        return (
          <Link
            className="break-all hover:underline"
            href={contact.email}
            rel="nofollow noopener"
            target="_blank"
          >
            {contact.email}
          </Link>
        );
      }
      return <span className="break-all sm:break-normal">{contact.email}</span>;
    }
  });

  const tables: InfoTable[] = [
    {
      icon: GlobeIcon,
      name: 'Domain Information',
      keys: {
        Registrar: () => result.registrar?.name,
        Registered: () => {
          const dateTime =
            result.domain.created_date_in_time ?? result.domain.created_date;
          return dateTime ? <Date dateTime={dateTime} /> : null;
        },
        Expires: () => {
          const dateTime =
            result.domain.expiration_date_in_time ??
            result.domain.expiration_date;
          return dateTime ? <Date dateTime={dateTime} /> : null;
        },
        Updated: () => {
          const dateTime =
            result.domain.updated_date_in_time ?? result.domain.updated_date;
          return dateTime ? <Date dateTime={dateTime} /> : null;
        },
        Status: () => {
          if (!result.domain.status) {
            return null;
          }
          return (
            <div className="flex flex-col gap-2 sm:flex-row">
              {result.domain.status.map((s) => {
                const status =
                  EPP_STATUS_CODES.find((c) => s === c.toLowerCase()) ?? s;
                return (
                  <Link
                    href={`https://www.icann.org/epp#${status}`}
                    className="w-fit"
                    target="_blank"
                    key={status}
                  >
                    <Badge
                      className="-ml-[1px] border border-muted-foreground/25 shadow-sm hover:bg-muted-foreground/5"
                      variant="outline"
                    >
                      {status}
                    </Badge>
                  </Link>
                );
              })}
            </div>
          );
        },
        Nameservers: () => (
          <div className="flex flex-col gap-4 sm:flex-row">
            {result.domain.name_servers.map((ns, i) => {
              const nsDomain = parseDomain(ns);
              return (
                <div className="flex w-fit items-center gap-2" key={i}>
                  <div className="h-5 w-5 shrink-0 rounded p-0.5 shadow ring-1 ring-muted-foreground/25">
                    <Image
                      src={`https://api.favicon.victr.me/blob/https://${nsDomain}`}
                      className="aspect-square select-none"
                      draggable={false}
                      unoptimized
                      height={20}
                      width={20}
                      alt=""
                    />
                  </div>
                  <Link
                    className="flex items-center gap-2 hover:underline"
                    href={`/whois/${nsDomain}`}
                    key={ns}
                  >
                    {ns}
                  </Link>
                </div>
              );
            })}
          </div>
        )
      }
    },
    {
      icon: UserSearchIcon,
      name: 'Registrant Contact',
      keys: getContactInfoKeys(result.registrant)
    },
    {
      icon: UserSearchIcon,
      name: 'Administrative Contact',
      keys: getContactInfoKeys(result.administrative)
    },
    {
      icon: UserSearchIcon,
      name: 'Technical Contact',
      keys: getContactInfoKeys(result.technical)
    },
    {
      icon: UserSearchIcon,
      name: 'Billing Contact',
      keys: getContactInfoKeys(result.billing)
    }
  ];

  return (
    <>
      {tables.map(({ icon: CardIcon, name, keys }) => {
        // if all key values are undefined, skip the table
        if (Object.values(keys).every((value) => !value())) {
          return null;
        }
        return (
          <Card key={name}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                {CardIcon && <CardIcon className="size-6" />}
                <CardTitle className="text-2xl">{name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  {Object.entries(keys).map(([label, value]) => {
                    if (!label || !value) {
                      return null;
                    }
                    const val = value();
                    if (!val) {
                      return null;
                    }
                    return (
                      <TableRow key={label}>
                        <TableCell className="w-36 align-top font-medium">
                          {label}
                        </TableCell>
                        <TableCell>{val}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}
