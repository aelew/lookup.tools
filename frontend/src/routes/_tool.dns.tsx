import { useQuery } from '@tanstack/react-query';
import { createFileRoute, notFound } from '@tanstack/react-router';
import { ChevronDownIcon } from 'lucide-react';
import { match } from 'ts-pattern';

import {
  DataContextMenu,
  type DataContextMenuType
} from '@/components/data-context-menu';
import { CloudflareIcon } from '@/components/icons/cloudflare';
import { ToolQueryState } from '@/components/tool-query-state';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
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

type DNSRecord = DNSLookupResponse['data'][DNSRecordType][number];

function dedupeRecords(records: Array<DNSRecord>) {
  return [
    ...new Map(
      records.map((record) => [
        `${record.type}:${record.name}:${record.data}`,
        record
      ])
    ).values()
  ];
}

export const Route = createFileRoute('/_tool/dns')({
  component: RouteComponent,
  head: ({ match: { search } }) => ({
    meta: getToolMetadata('dns', !!search.q)
  })
});

function RouteComponent() {
  const { q } = Route.useSearch();
  if (!q) {
    throw notFound();
  }

  const query = useQuery(getToolQueryOptions<DNSLookupResponse>('dns', q));
  const data = query.data?.data;

  if (!data) {
    return <ToolQueryState query={query} />;
  }

  const recordGroups = Object.entries(data).flatMap(([type, records]) => {
    const uniqueRecords = dedupeRecords(records);

    return uniqueRecords.length
      ? ([[type as DNSRecordType, uniqueRecords]] as const)
      : [];
  });

  const recordCount = recordGroups.reduce(
    (count, [, records]) => count + records.length,
    0
  );

  return (
    <section className="grid gap-4">
      <Card size="sm">
        <CardHeader>
          <CardTitle>{recordGroups.length} record types found</CardTitle>
          <CardAction className="row-span-1">
            <Badge variant="secondary">
              {recordCount} {recordCount === 1 ? 'record' : 'records'}
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {recordGroups.map(([type, records]) => (
        <Collapsible defaultOpen key={type}>
          <Card className="gap-0 py-0">
            <CollapsibleTrigger
              aria-label={`Toggle ${type} records`}
              nativeButton={false}
              render={
                <CardHeader className="hover:bg-muted/50 focus-visible:ring-ring/50 cursor-pointer grid-cols-[1fr_auto] py-4 outline-none transition-colors focus-visible:ring-1 data-[panel-open]:[&_svg]:rotate-180 motion-reduce:transition-none" />
              }
            >
              <div className="grid gap-1">
                <CardTitle>{type} records</CardTitle>
                <CardDescription>
                  {records.length} {records.length === 1 ? 'record' : 'records'}
                </CardDescription>
              </div>
              <CardAction className="flex size-8 items-center justify-center">
                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-4 transition-transform motion-reduce:transition-none"
                />
              </CardAction>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-72">Name</TableHead>
                      <TableHead className="w-16 text-center">TTL</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((record, idx) => {
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
                        <TableRow key={record.name + record.data + idx}>
                          <TableCell>
                            <DataContextMenu
                              className="w-full"
                              type="domain"
                              value={record.name}
                            >
                              {record.name}
                            </DataContextMenu>
                          </TableCell>
                          <TableCell>
                            <DataContextMenu
                              className="flex justify-center"
                              showActions={false}
                              value={record.ttl.toString()}
                            >
                              <Badge className="gap-0" variant="secondary">
                                {record.ttl}
                              </Badge>
                            </DataContextMenu>
                          </TableCell>
                          <TableCell className="flex items-center gap-1.5">
                            {Icon && <Icon className="size-5 shrink-0" />}

                            <DataContextMenu
                              className="min-w-0 flex-1"
                              type={match<DNSRecordType, DataContextMenuType>(
                                record.type
                              )
                                .with('A', 'AAAA', () => 'ip')
                                .with('NS', () => 'domain')
                                .otherwise(() => 'text')}
                              value={
                                record.type === 'NS' &&
                                record.data.endsWith('.')
                                  ? record.data.slice(0, -1)
                                  : record.data
                              }
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
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}
    </section>
  );
}
