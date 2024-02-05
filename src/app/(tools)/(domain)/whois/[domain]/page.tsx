import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Date } from '@/components/date';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { TOOLS } from '@/lib/resources/tools';
import type { ContactInfo } from '@/lib/whois';
import { api } from '@/trpc/server';
import type { InfoTable } from '@/types';
import { DomainHeader } from '../../_components/domain-header';
import { DomainTabsList } from '../../_components/domain-tabs-list';
import { WhoisLookupForm } from '../form';

interface WhoisLookupResultPageProps {
  params: { domain: string };
}

const getCachedWhoisLookup = unstable_cache(
  async (domain: string) => api.lookup.whois.mutate({ domain }),
  ['whois_lookup'],
  { revalidate: 15 }
);

export async function generateMetadata({ params }: WhoisLookupResultPageProps) {
  const domain = decodeURIComponent(params.domain).toLowerCase();
  const result = await getCachedWhoisLookup(domain);
  if (!result) {
    notFound();
  }
  return {
    title: `WHOIS Lookup for ${result.domain.domain}`,
    description: TOOLS.find((tool) => tool.slug === 'whois')?.description
  } satisfies Metadata;
}

export default async function WhoisLookupResultPage({
  params
}: WhoisLookupResultPageProps) {
  const domain = decodeURIComponent(params.domain).toLowerCase();
  const result = await getCachedWhoisLookup(domain);
  if (!result) {
    notFound();
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
    Email: () => contact?.email
  });

  const tables: InfoTable[] = [
    {
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
          <div className="flex gap-2">
            {result.domain.status.map((status) => (
              <Link
                href={`https://www.icann.org/epp#${status}`}
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
          <div className="inline-flex flex-col gap-1">
            {result.domain.name_servers.map((ns, i) => {
              const parts = ns.split('.');
              const baseDomain =
                parts.length > 2 ? parts.slice(1).join('.') : ns;
              return (
                <div className="flex items-center gap-2" key={i}>
                  <div className="h-5 w-5 shrink-0 rounded p-0.5 shadow ring-1 ring-muted-foreground/25">
                    <Image
                      src={`https://icons.duckduckgo.com/ip3/${baseDomain}.ico`}
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
                    href={`/whois/${baseDomain}`}
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
      name: 'Registrant Contact',
      keys: getContactInfoKeys(result.registrant)
    },
    {
      name: 'Administrative Contact',
      keys: getContactInfoKeys(result.administrative)
    },
    {
      name: 'Technical Contact',
      keys: getContactInfoKeys(result.technical)
    },
    {
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
          {tables.map(({ name, keys }) => {
            // if all key values are undefined, skip the table
            if (Object.values(keys).every((value) => !value())) {
              return null;
            }
            return (
              <Card key={name}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">{name}</CardTitle>
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
