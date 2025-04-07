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
import { CACHE_REVALIDATE_SECONDS } from '@/lib/config';
import { formatDuration } from '@/lib/format';
import { SERVICES } from '@/lib/resources/services';
import { TOOLS } from '@/lib/resources/tools';
import { cn, parseDomain } from '@/lib/utils';
import { api } from '@/trpc/server';
import { DomainNotRegistered } from '../../_components/domain-not-registered';
import { CopyButton } from '../../../../../../components/copy-button';

interface DNSLookupResultPageProps {
  params: Promise<{ domain: string }>;
}

const getCachedDNSLookup = unstable_cache(
  async (domain: string) => api.lookup.dns.mutate({ domain }),
  ['dns_lookup'],
  { revalidate: CACHE_REVALIDATE_SECONDS }
);

export async function generateMetadata(props: DNSLookupResultPageProps) {
  const params = await props.params;
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

export default async function DNSLookupResultPage(
  props: DNSLookupResultPageProps
) {
  const params = await props.params;
  const domain = parseDomain(params.domain);
  if (!domain) {
    notFound();
  }

  const result = await getCachedDNSLookup(domain);
  if (!result.success) {
    return <DomainNotRegistered domain={domain} />;
  }

  return (
    <>
      {Object.entries(result.records).map(([type, records]) => {
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
                    let data = record.data;
                    if (record.data.endsWith('.')) {
                      data = record.data.slice(0, -1);
                    } else if (
                      record.type === 'TXT' &&
                      record.data.startsWith('"') &&
                      record.data.endsWith('"')
                    ) {
                      data = record.data.slice(1, -1);
                    }

                    let Icon = null;
                    if (record.cloudflare) {
                      Icon = CloudflareIcon;
                    } else {
                      for (const service of SERVICES) {
                        if (
                          service.matches.some((k) =>
                            data.toLowerCase().includes(k)
                          )
                        ) {
                          Icon = service.icon;
                          break;
                        }
                      }
                    }

                    return (
                      <TableRow key={record.name + record.data}>
                        <TableCell>
                          <Link
                            href={`https://${record.name}`}
                            className="hover:underline"
                            rel="nofollow noopener"
                            target="_blank"
                          >
                            {record.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge className="-space-x-0.5" variant="secondary">
                            <span className="whitespace-nowrap">
                              {formatDuration(Number(record.ttl))}
                            </span>
                            <CopyButton text={record.ttl.toString()} />
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
                                className="whitespace-nowrap tabular-nums hover:underline"
                                href={`/ip/${data}`}
                              >
                                {data}
                              </Link>
                            ))
                            .with('NS', () => (
                              <Link
                                className="whitespace-nowrap hover:underline"
                                href={`/whois/${parseDomain(data)}`}
                              >
                                {data}
                              </Link>
                            ))
                            .otherwise(() => (
                              <span className="whitespace-nowrap">{data}</span>
                            ))}
                          <CopyButton text={data} />
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
    </>
  );
}
