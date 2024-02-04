import { ExternalLinkIcon } from 'lucide-react';
import { unstable_cache } from 'next/cache';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SERVICES } from '@/lib/resources/services';
import { cn, duration } from '@/lib/utils';
import { api } from '@/trpc/server';
import { CopyButton } from '../../_components/copy-button';

interface DNSLookupResultPageProps {
  params: {
    domain: string;
  };
}

const getCachedDNSLookup = unstable_cache(
  async (domain: string) => api.lookup.dns.mutate({ domain }),
  ['dns_lookup'],
  { revalidate: 15 }
);

export default async function DNSLookupResultPage({
  params
}: DNSLookupResultPageProps) {
  const domain = decodeURIComponent(params.domain).toLowerCase();
  const result = await getCachedDNSLookup(domain);
  if (!result) {
    notFound();
  }

  return (
    <>
      <div className="my-4 flex items-center justify-between space-y-2">
        <div className="flex items-center gap-3 text-3xl font-semibold tracking-tight">
          <Image
            className="rounded-lg bg-white object-contain p-1 shadow ring-1 ring-muted-foreground/25"
            src={`https://icons.duckduckgo.com/ip3/${domain}.ico`}
            unoptimized
            height={36}
            width={36}
            alt=""
          />
          <h2>{domain}</h2>
          <Link href={`https://${domain}`} target="_blank">
            <ExternalLinkIcon className="mt-1 size-4 transition-colors hover:opacity-80" />
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          {/* <ViewCounter count={stats?.count} />
          <SearchAgain type="domainName" /> */}
          {/*<RefreshButton*/}
          {/*  refetch={refetch}*/}
          {/*  refetching={refetching}*/}
          {/*  setRefetching={setRefetching}*/}
          {/*/>*/}
        </div>
      </div>
      <Tabs defaultValue="dns">
        <TabsList className="shadow">
          <TabsTrigger value="dns">DNS Records</TabsTrigger>
          <Link href={`/whois/${domain}`}>
            <TabsTrigger value="whois">WHOIS Lookup</TabsTrigger>
          </Link>
        </TabsList>
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
                                className="whitespace-nowrap"
                                variant="secondary"
                              >
                                {duration(Number(record.ttl))}
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
                              {value}
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
          {/* <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">DNS Records</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Type</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-16">TTL</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.map((record) => (
                    <TableRow key={record.type + record.name + record.data}>
                      <TableCell className="font-semibold">
                        {record.type}
                      </TableCell>
                      <TableCell>{record.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{record.ttl}</Badge>
                      </TableCell>
                      <TableCell>{record.data}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card> */}
        </TabsContent>
      </Tabs>
    </>
  );
}
