import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { match } from 'ts-pattern';

import { CopyButton } from '@/components/copy-button';
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
import { getQueryOptions } from '@/lib/query';
import { parseDomain, type DNSRecordType } from '@/lib/utils';

interface ResolveDNSResponse {
  q: string;
  data: Record<
    DNSRecordType,
    Array<{
      type: DNSRecordType;
      name: string;
      data: string;
      ttl: number;
      attributes: {
        cloudflare?: boolean;
      };
    }>
  >;
}

export const Route = createFileRoute('/_tool/dns')({
  component: RouteComponent
});

function RouteComponent() {
  const { q } = Route.useSearch();
  if (!q) {
    throw notFound();
  }

  const query = useQuery(getQueryOptions<ResolveDNSResponse>('dns', q));

  const data = query.data?.data;

  if (!data) {
    return null;
  }

  return Object.entries(data).map(([type, records]) => {
    if (!records.length) {
      return null;
    }
    return (
      <Card key={type}>
        <CardHeader className="pbs-2">
          <CardTitle>{type} records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-72">Name</TableHead>
                <TableHead className="w-16 text-center">TTL</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => {
                let Icon = null;

                if (
                  'cloudflare' in record.attributes &&
                  record.attributes.cloudflare
                ) {
                  Icon = CloudflareIcon;
                } else {
                  // for (const service of SERVICES) {
                  //   if (
                  //     service.matches.some((k) =>
                  //       data.toLowerCase().includes(k)
                  //     )
                  //   ) {
                  //     Icon = service.icon;
                  //     break;
                  //   }
                  // }
                }

                return (
                  <TableRow key={record.name + record.data}>
                    <TableCell>
                      <a
                        className="hover:underline hover:underline-offset-4"
                        href={`https://${record.name}`}
                        rel="nofollow noopener"
                        target="_blank"
                      >
                        {record.name}
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge className="gap-0" variant="secondary">
                        <span className="whitespace-nowrap">
                          {/* {formatDuration(Number(record.ttl))} */}
                          {record.ttl}
                        </span>
                        <CopyButton text={record.ttl.toString()} />
                      </Badge>
                    </TableCell>
                    <TableCell className="flex items-center">
                      {Icon && <Icon className="mr-1.5 size-5 shrink-0" />}
                      {match(record.type)
                        .with('A', 'AAAA', () => (
                          <Link
                            className="whitespace-nowrap tabular-nums hover:underline"
                            search={{ q: record.data }}
                            to="/ip"
                          >
                            {record.data}
                          </Link>
                        ))
                        .with('NS', () => (
                          <Link
                            className="whitespace-nowrap hover:underline"
                            search={{ q: parseDomain(record.data) }}
                            to="/whois"
                          >
                            {record.data}
                          </Link>
                        ))
                        .otherwise(() => (
                          <span className="whitespace-nowrap">
                            {record.data}
                          </span>
                        ))}
                      <CopyButton text={record.data} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  });
}
