import { useQuery } from '@tanstack/react-query';
import { createFileRoute, notFound } from '@tanstack/react-router';
import { match } from 'ts-pattern';

import {
  DataContextMenu,
  type DataContextMenuType
} from '@/components/data-context-menu';
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
import { type DNSRecordType } from '@/lib/utils';

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
                <TableHead className="w-16 pr-3 text-center">TTL</TableHead>
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
                      <DataContextMenu type="domain" value={record.name}>
                        {record.name}
                      </DataContextMenu>
                    </TableCell>
                    <TableCell>
                      <DataContextMenu value={record.ttl.toString()}>
                        <Badge className="gap-0" variant="secondary">
                          {record.ttl}
                        </Badge>
                      </DataContextMenu>
                    </TableCell>
                    <TableCell className="flex items-center gap-1.5">
                      {Icon && <Icon className="size-5 shrink-0" />}

                      <DataContextMenu
                        value={record.data}
                        type={match<DNSRecordType, DataContextMenuType>(
                          record.type
                        )
                          .with('A', 'AAAA', () => 'ip')
                          .with('NS', () => 'domain')
                          .otherwise(() => 'text')}
                      >
                        {record.data}
                      </DataContextMenu>
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
