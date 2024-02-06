import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CopyButton } from '@/app/(tools)/_components/copy-button';
import { CloudflareIcon } from '@/components/icons/cloudflare';
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
import { TOOLS } from '@/lib/resources/tools';
import { cn, parseDomain } from '@/lib/utils';
import { api } from '@/trpc/server';
import { DomainHeader } from '../../_components/domain-header';
import { DomainNotRegistered } from '../../_components/domain-not-registered';
import { DomainTabsList } from '../../_components/domain-tabs-list';
import { SubdomainFinderForm } from '../form';

interface SubdomainFinderResultPageProps {
  params: { domain: string };
}

const getCachedSubdomainScan = unstable_cache(
  async (domain: string) => api.lookup.subdomain.mutate({ domain }),
  ['subdomain_scan'],
  { revalidate: CACHE_REVALIDATE_SECONDS }
);

export async function generateMetadata({
  params
}: SubdomainFinderResultPageProps) {
  const domain = parseDomain(params.domain);
  if (!domain) {
    notFound();
  }
  const result = await getCachedSubdomainScan(domain);
  return {
    title: `Subdomain Scan for ${domain}`,
    robots: result ? 'noindex' : null,
    description: TOOLS.find((tool) => tool.slug === 'subdomain')?.description
  } satisfies Metadata;
}

export default async function SubdomainFinderResultPage({
  params
}: SubdomainFinderResultPageProps) {
  const domain = parseDomain(params.domain);
  if (!domain) {
    notFound();
  }

  const result = await getCachedSubdomainScan(domain);
  if (!result) {
    return (
      <>
        <DomainHeader domain={domain} searchAgainForm={SubdomainFinderForm} />
        <DomainNotRegistered domain={domain} />
      </>
    );
  }

  return (
    <>
      <DomainHeader domain={domain} searchAgainForm={SubdomainFinderForm} />
      <Tabs className="flex flex-col" value="subdomain">
        <DomainTabsList value="subdomain" domain={domain} />
        <TabsContent value="subdomain" className="mt-4 grid md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Subdomain Scan</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subdomain</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.map((record) => (
                    <TableRow key={record.subdomain}>
                      <TableCell>
                        <div className="flex items-center">
                          {record.subdomain}
                          <CopyButton text={record.subdomain} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {record.ip ? (
                            <>
                              <CloudflareIcon
                                className={cn(
                                  'mr-2 size-4 shrink-0 rounded shadow ring-1 ring-muted-foreground/25',
                                  !record.cloudflare && 'grayscale'
                                )}
                              />
                              <Link
                                className="whitespace-nowrap hover:underline"
                                href={`/ip/${record.ip}`}
                              >
                                {record.ip}
                              </Link>
                              <CopyButton text={record.ip} />
                            </>
                          ) : (
                            '--'
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
