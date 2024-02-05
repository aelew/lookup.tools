import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { match } from 'ts-pattern';

import { CloudflareIcon } from '@/components/icons/cloudflare';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { CACHE_REVALIDATE_SECONDS } from '@/lib/config';
import { formatDuration } from '@/lib/format';
import { SERVICES } from '@/lib/resources/services';
import { TOOLS } from '@/lib/resources/tools';
import { cn, parseDomain } from '@/lib/utils';
import { api } from '@/trpc/server';
import { DomainHeader } from '../../_components/domain-header';
import { DomainNotRegistered } from '../../_components/domain-not-registered';
import { DomainTabsList } from '../../_components/domain-tabs-list';
import { CopyButton } from '../../../_components/copy-button';
import { DNSLookupForm } from '../form';

interface DNSLookupResultPageProps {
  params: { domain: string };
}

const getCachedDNSLookup = unstable_cache(
  async (domain: string) => api.lookup.dns.mutate({ domain }),
  ['dns_lookup'],
  { revalidate: CACHE_REVALIDATE_SECONDS }
);

export async function generateMetadata({ params }: DNSLookupResultPageProps) {
  const domain = parseDomain(params.domain);
  if (!domain) {
    notFound();
  }
  const result = await getCachedDNSLookup(domain);
  return {
    title: `DNS Lookup for ${domain}`,
    robots: result ? 'noindex' : null,
    description: TOOLS.find((tool) => tool.slug === 'dns')?.description
  } satisfies Metadata;
}

export default async function DNSLookupResultPage({
  params
}: DNSLookupResultPageProps) {
  const domain = parseDomain(params.domain);
  if (!domain) {
    notFound();
  }

  const result = await getCachedDNSLookup(domain);
  if (!result) {
    return (
      <>
        <DomainHeader domain={domain} searchAgainForm={DNSLookupForm} />
        <DomainNotRegistered domain={domain} />
      </>
    );
  }

  return (
    <>
      <DomainHeader domain={domain} searchAgainForm={DNSLookupForm} />
      <Tabs className="flex flex-col" value="dns">
        <DomainTabsList value="dns" domain={domain} />
        <TabsContent value="dns" className="mt-4 space-y-4">
          {Object.entries(result).map(([type, records]) => {
            if (!records.length) {
              return null;
            }
            return (
              <Card key={type}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">{type} records</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-72">Name</TableHead>
                        <TableHead className="w-16">TTL</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.map((record) => {
                        let value = record.value;
                        if (record.value.endsWith('.')) {
                          value = value.slice(0, -1);
                        }

                        let Icon = null;
                        if (record.cloudflare) {
                          Icon = CloudflareIcon;
                        } else {
                          for (const service of SERVICES) {
                            if (
                              service.matches.some((k) =>
                                value.toLowerCase().includes(k)
                              )
                            ) {
                              Icon = service.icon;
                              break;
                            }
                          }
                        }

                        if (record.type === 'TXT') {
                          value = value.substring(1, value.length - 1);
                        }

                        return (
                          <TableRow key={record.name + record.value}>
                            <TableCell className="whitespace-nowrap">
                              {record.name}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className="-space-x-0.5 whitespace-nowrap"
                                variant="secondary"
                              >
                                <span>
                                  {formatDuration(Number(record.ttl))}
                                </span>
                                <CopyButton text={record.ttl} />
                              </Badge>
                            </TableCell>
                            <TableCell className="flex items-center">
                              {Icon && (
                                <Icon
                                  className={cn(
                                    'mr-2 size-4 shrink-0',
                                    // @ts-expect-error SimpleIcon check
                                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                                    Icon.$$typeof?.toString() !==
                                      'Symbol(react.forward_ref)' &&
                                      'rounded shadow ring-1 ring-muted-foreground/25'
                                  )}
                                />
                              )}
                              {match(record.type)
                                .with('A', 'AAAA', () => (
                                  <Link
                                    className="whitespace-nowrap hover:underline"
                                    href={`/ip/${value}`}
                                  >
                                    {value}
                                  </Link>
                                ))
                                .with('NS', () => (
                                  <Link
                                    className="whitespace-nowrap hover:underline"
                                    href={`/whois/${parseDomain(value)}`}
                                  >
                                    {value}
                                  </Link>
                                ))
                                .otherwise(() => (
                                  <span className="whitespace-nowrap">
                                    {value}
                                  </span>
                                ))}
                              <CopyButton text={value} />
                            </TableCell>
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
