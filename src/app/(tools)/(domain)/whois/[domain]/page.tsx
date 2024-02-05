import { GlobeIcon, UserSearchIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Date } from '@/components/date';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { CACHE_REVALIDATE_SECONDS } from '@/lib/config';
import { TOOLS } from '@/lib/resources/tools';
import { parseDomain } from '@/lib/utils';
import type { ContactInfo } from '@/lib/whois';
import { api } from '@/trpc/server';
import type { InfoTable } from '@/types';
import { DomainHeader } from '../../_components/domain-header';
import { DomainNotRegistered } from '../../_components/domain-not-registered';
import { DomainTabsList } from '../../_components/domain-tabs-list';
import { WhoisLookupForm } from '../form';

interface WhoisLookupResultPageProps {
  params: { domain: string };
}

const getCachedWhoisLookup = unstable_cache(
  async (domain: string) => api.lookup.whois.mutate({ domain }),
  ['whois_lookup'],
  { revalidate: CACHE_REVALIDATE_SECONDS }
);

export async function generateMetadata({ params }: WhoisLookupResultPageProps) {
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

export default async function WhoisLookupResultPage({
  params
}: WhoisLookupResultPageProps) {
  const domain = parseDomain(params.domain);
  if (!domain) {
    notFound();
  }

  const result = await getCachedWhoisLookup(domain);
  if (!result) {
    return (
      <>
        <DomainHeader domain={domain} searchAgainForm={WhoisLookupForm} />
        <DomainNotRegistered domain={domain} />
      </>
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
    Email: () =>
      contact?.email && (
        <Link
          className="break-all hover:underline"
          rel="nofollow noopener"
          target="_blank"
          href={
            contact.email.includes('@')
              ? `mailto:${contact.email}`
              : contact.email.startsWith('http')
                ? contact.email
                : `https://${contact.email}`
          }
        >
          {contact.email}
        </Link>
      )
  });

  const tables: InfoTable[] = [
    {
      icon: GlobeIcon,
      name: 'Domain Information',
      keys: {
        Registrar: () => result.registrar?.name,
        Registered: () => (
          <Date
            dateTime={
              result.domain.created_date_in_time ?? result.domain.created_date
            }
          />
        ),
        Updated: () => (
          <Date
            dateTime={
              result.domain.updated_date_in_time ?? result.domain.updated_date
            }
          />
        ),
        Expires: () => (
          <Date
            dateTime={
              result.domain.expiration_date_in_time ??
              result.domain.expiration_date
            }
          />
        ),
        Status: () => (
          <div className="flex flex-col gap-2 sm:flex-row">
            {result.domain.status.map((status) => (
              <Link
                href={`https://www.icann.org/epp#${status}`}
                className="w-fit"
                target="_blank"
                key={status}
              >
                <Badge variant="outline" className="hover:bg-muted">
                  {status}
                </Badge>
              </Link>
            ))}
          </div>
        ),
        Nameservers: () => (
          <div className="flex flex-col gap-4 sm:flex-row">
            {result.domain.name_servers.map((ns, i) => {
              const nsDomain = parseDomain(ns);
              return (
                <div className="flex w-fit items-center gap-2" key={i}>
                  <div className="h-5 w-5 shrink-0 rounded p-0.5 shadow ring-1 ring-muted-foreground/25">
                    <Image
                      src={`https://icons.duckduckgo.com/ip3/${nsDomain}.ico`}
                      className="select-none"
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
      <DomainHeader domain={domain} searchAgainForm={WhoisLookupForm} />
      <Tabs className="flex flex-col" value="whois">
        <DomainTabsList value="whois" domain={domain} />
        <TabsContent value="whois" className="mt-4 space-y-4">
          {tables.map(({ icon: CardIcon, name, keys }) => {
            // if all key values are undefined, skip the table
            if (Object.values(keys).every((value) => !value())) {
              return null;
            }
            return (
              <Card key={name}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <CardIcon className="size-6" />
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
        </TabsContent>
      </Tabs>
    </>
  );
}
