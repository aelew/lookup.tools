import { TerminalIcon } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { WhoisSearchResult } from 'whoiser';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { api } from '@/trpc/server';
import { keys } from './constants';
import {
  formatWhoisKey,
  formatWhoisTableName,
  formatWhoisValue
} from './utils';

interface DNSLookupResultPageProps {
  params: {
    domain: string;
  };
}

export default async function DNSLookupResultPage({
  params
}: DNSLookupResultPageProps) {
  const result = (await api.lookup.dns.mutate({
    domain: decodeURIComponent(params.domain)
  })) as Record<string, WhoisSearchResult> | null;
  if (!result) {
    notFound();
  }

  const server = Object.keys(result)[0];
  if (!server) {
    notFound();
  }

  const data = Object.values(result)[0];
  if (!data || data.error) {
    notFound();
  }

  console.log
  const domain = (data['Domain Name'] as string).toLowerCase();

  const renderTableRows = (category: string[]) => {
    return category.map((key) => {
      const value = data[key];
      if (key === 'Domain Name' || !value) {
        return null;
      }
      return (
        <tr key={key}>
          <th className="flex p-2 text-left font-semibold sm:whitespace-nowrap">
            {formatWhoisKey(key)}
          </th>
          <td
            className={cn(
              'p-2 text-muted-foreground',
              key === 'text' && 'text-xs'
            )}
          >
            {formatWhoisValue(key, value)}
          </td>
        </tr>
      );
    });
  };

  const renderTables = () => {
    return Object.entries(keys).map(([tableName, tableKeys]) => (
      <Card key={tableName}>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">
            {formatWhoisTableName(tableName)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data[tableKeys[0]!] ? (
            <table className="w-full">
              <tbody className="divide-y divide-muted-foreground/15">
                {renderTableRows(tableKeys)}
              </tbody>
            </table>
          ) : (
            <p className="text-muted-foreground">(empty)</p>
          )}
        </CardContent>
      </Card>
    ));
  };

  return (
    <>
      <div className="my-4 flex items-center justify-between space-y-2">
        <div className="flex gap-3 text-3xl font-semibold tracking-tight">
          <Image
            className="rounded-lg bg-white object-contain p-1 shadow ring-1 ring-muted-foreground/25"
            src={`https://logo.clearbit.com/${domain}?size=48`}
            draggable={false}
            height={36}
            width={36}
            alt=""
          />
          <h2>{domain}</h2>
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
      <Tabs defaultValue="styled">
        <TabsList className="shadow">
          <TabsTrigger value="styled">WHOIS Lookup</TabsTrigger>
          <TabsTrigger value="raw">Raw Data</TabsTrigger>
        </TabsList>
        <TabsContent value="styled" className="mt-4 space-y-4">
          <Alert className="bg-transparent shadow">
            <AlertDescription className="flex items-center">
              <TerminalIcon className="mr-2 h-4 w-4" />{' '}
              <p>
                This information was returned by the{' '}
                {server === data['Registrar WHOIS Server']
                  ? 'registrar'
                  : 'registry'}{' '}
                server{' '}
                <span className="rounded bg-accent px-1 font-mono">
                  {server}
                </span>
                .
              </p>
            </AlertDescription>
          </Alert>
          {renderTables()}
        </TabsContent>
        <TabsContent value="raw" className="mt-4">
          <div className="rounded-xl border bg-background px-4 py-3 text-sm">
            <code className="whitespace-pre-wrap">
              {(data.__raw as string | null)?.replaceAll('   ', '').trim()}
            </code>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
