import { useQuery } from '@tanstack/react-query';
import { createFileRoute, notFound } from '@tanstack/react-router';
import { useMemo } from 'react';

import { DataContextMenu } from '@/components/data-context-menu';
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
import { getToolMetadata } from '@/lib/meta';
import { getToolQueryOptions } from '@/lib/query';
import { cn } from '@/lib/utils';
import type { SubdomainsLookupResponse } from '@/types/tools/subdomains';

export const Route = createFileRoute('/_tool/subdomains')({
  component: RouteComponent,
  head: ({ match: { search } }) => ({
    meta: getToolMetadata('subdomains', !!search.q)
  })
});

function RouteComponent() {
  const { q } = Route.useSearch();
  if (!q) {
    throw notFound();
  }

  const query = useQuery(
    getToolQueryOptions<SubdomainsLookupResponse>('subdomains', q)
  );

  const subdomains = query.data?.data;

  const addressOccurrences = useMemo(() => {
    if (!subdomains?.length) {
      return null;
    }

    const occurrences = new Map<string, number>();
    subdomains.forEach((s) => {
      occurrences.set(s.ip, (occurrences.get(s.ip) ?? 0) + 1);
    });

    return occurrences;
  }, [subdomains]);

  const mostCommonAddress = useMemo(() => {
    if (!addressOccurrences) {
      return null;
    }

    return Array.from(addressOccurrences.entries()).reduce((max, curr) =>
      curr[1] > max[1] ? curr : max
    )[0];
  }, [addressOccurrences]);

  return (
    <section className="flex flex-col-reverse gap-4 md:grid md:grid-cols-2">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Scan Results</CardTitle>
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
              {subdomains?.map((record) => (
                <TableRow key={record.fqdn}>
                  <TableCell>
                    <DataContextMenu type="domain" value={record.fqdn}>
                      {record.fqdn}
                    </DataContextMenu>
                  </TableCell>
                  <TableCell className="tabular-nums">
                    <DataContextMenu type="ip" value={record.ip}>
                      {record.ip}
                    </DataContextMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="w-36 font-medium">
                    Subdomains found
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {subdomains?.length ?? 0}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="w-36 font-medium">
                    Most common IP
                  </TableCell>
                  <TableCell>
                    {mostCommonAddress ? (
                      <DataContextMenu type="ip" value={mostCommonAddress}>
                        {mostCommonAddress}
                      </DataContextMenu>
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
          <CardHeader>
            <CardTitle>IP Addresses</CardTitle>
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
                {addressOccurrences &&
                  Array.from(addressOccurrences)
                    .sort(([_, a], [__, b]) => b - a)
                    .map(([address, occurrences]) => (
                      <TableRow key={address} className="tabular-nums">
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <CloudflareIcon
                              className={cn(
                                'size-5 shrink-0',
                                !subdomains?.find((r) => r.ip === address)
                                  ?.attributes.cloudflare && 'grayscale'
                              )}
                            />
                            <DataContextMenu type="ip" value={address}>
                              {address}
                            </DataContextMenu>
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
    </section>
  );
}
