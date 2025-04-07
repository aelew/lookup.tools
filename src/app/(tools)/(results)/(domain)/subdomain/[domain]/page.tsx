import { ClipboardListIcon, MapPinIcon, RadarIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CopyButton } from '@/components/copy-button';
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
import { CACHE_REVALIDATE_SECONDS } from '@/lib/config';
import { TOOLS } from '@/lib/resources/tools';
import { cn, parseDomain } from '@/lib/utils';
import { api } from '@/trpc/server';

interface SubdomainFinderResultPageProps {
  params: Promise<{ domain: string }>;
}

const getCachedSubdomainScan = unstable_cache(
  async (domain: string) => api.lookup.subdomain.mutate({ domain }),
  ['subdomain_scan'],
  { revalidate: CACHE_REVALIDATE_SECONDS }
);

export async function generateMetadata(props: SubdomainFinderResultPageProps) {
  const params = await props.params;
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

export default async function SubdomainFinderResultPage(
  props: SubdomainFinderResultPageProps
) {
  const params = await props.params;
  const domain = parseDomain(params.domain);
  if (!domain) {
    notFound();
  }

  const result = await getCachedSubdomainScan(domain);
  if (!result.success) {
    notFound();
  }

  const ipStore: Record<string, number> = {};
  result.data.forEach((record) => {
    ipStore[record.ip] = (ipStore[record.ip] ?? 0) + 1;
  });
  const mostCommonIp = Object.keys(ipStore).sort(
    (a, b) => ipStore[b]! - ipStore[a]!
  )[0];

  return (
    <div className="flex flex-col-reverse gap-4 md:grid md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <RadarIcon className="size-6" />
            <CardTitle className="text-2xl">Subdomain Scan</CardTitle>
          </div>
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
              {result.data.map((record) => (
                <TableRow key={record.subdomain}>
                  <TableCell>
                    <Link
                      href={`https://${record.subdomain}`}
                      className="hover:underline"
                      rel="nofollow noopener"
                      target="_blank"
                    >
                      {record.subdomain}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CloudflareIcon
                        className={cn(
                          'mr-2 size-4 shrink-0 rounded shadow ring-1 ring-muted-foreground/25',
                          !record.cloudflare && 'grayscale'
                        )}
                      />
                      <Link
                        className="whitespace-nowrap tabular-nums hover:underline"
                        href={`/ip/${record.ip}`}
                      >
                        {record.ip}
                      </Link>
                      <CopyButton text={record.ip} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <ClipboardListIcon className="size-6" />
              <CardTitle className="text-2xl">Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="w-36 font-medium">
                    Subdomains found
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {result.data.length}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="w-36 font-medium">
                    Most common IP
                  </TableCell>
                  <TableCell>
                    {mostCommonIp ? (
                      <div className="flex items-center">
                        <Link
                          className="whitespace-nowrap tabular-nums hover:underline"
                          href={`/ip/${mostCommonIp}`}
                        >
                          {mostCommonIp}
                        </Link>
                        <CopyButton text={mostCommonIp} />
                      </div>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <MapPinIcon className="size-6" />
              <CardTitle className="text-2xl">IP addresses found</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Occurrences</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(ipStore)
                  .sort(([_, a], [__, b]) => b - a)
                  .map(([ip, occurrences]) => (
                    <TableRow className="tabular-nums" key={ip}>
                      <TableCell>
                        <div className="flex items-center">
                          <CloudflareIcon
                            className={cn(
                              'mr-2 size-4 shrink-0 rounded shadow ring-1 ring-muted-foreground/25',
                              !result.data.find((r) => r.ip === ip)
                                ?.cloudflare && 'grayscale'
                            )}
                          />
                          <Link
                            className="whitespace-nowrap hover:underline"
                            href={`/ip/${ip}`}
                          >
                            {ip}
                          </Link>
                          <CopyButton text={ip} />
                        </div>
                      </TableCell>
                      <TableCell>{occurrences}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
