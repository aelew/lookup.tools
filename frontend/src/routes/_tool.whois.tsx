import { useQuery } from '@tanstack/react-query';
import { createFileRoute, notFound } from '@tanstack/react-router';
import { EyeIcon } from 'lucide-react';
import { useState } from 'react';

import { DataContextMenu } from '@/components/data-context-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { getToolQueryOptions } from '@/lib/query';
import { parseDomain } from '@/lib/utils';
import type { WHOISLookupResponse } from '@/types/tools/whois';

const EPP_STATUS_CODES = [
  'addPeriod',
  'autoRenewPeriod',
  'inactive',
  'ok',
  'pendingCreate',
  'pendingDelete',
  'pendingRenew',
  'pendingRestore',
  'pendingTransfer',
  'pendingUpdate',
  'redemptionPeriod',
  'renewPeriod',
  'serverDeleteProhibited',
  'serverHold',
  'serverRenewProhibited',
  'serverTransferProhibited',
  'serverUpdateProhibited',
  'transferPeriod',
  'clientDeleteProhibited',
  'clientHold',
  'clientRenewProhibited',
  'clientTransferProhibited',
  'clientUpdateProhibited'
];

export const Route = createFileRoute('/_tool/whois')({
  component: RouteComponent
});

function RouteComponent() {
  const { q } = Route.useSearch();
  if (!q) {
    throw notFound();
  }

  const query = useQuery(getToolQueryOptions<WHOISLookupResponse>('whois', q));
  const [viewMode, setViewMode] = useState<'normalized' | 'raw'>('normalized');

  const result = query.data?.data;
  const raw = query.data?.raw;

  if (!result) {
    return null;
  }

  const getContactInfoKeys = (
    contact: 'registrant' | 'admin' | 'billing' | 'tech'
  ) => {
    return {
      Name: () => result[`${contact}_name`],
      Organization: () => result[`${contact}_organization`],
      Street: () => result[`${contact}_address`],
      City: () => result[`${contact}_city`],
      State: () => result[`${contact}_state`],
      'Postal Code': () => result[`${contact}_zipcode`],
      Country: () => result[`${contact}_country`],
      Phone: () => result[`${contact}_phone`],
      Email: () => {
        const email = result[`${contact}_email`];

        if (!email) {
          return null;
        }

        if (email.includes('@')) {
          return (
            <a
              className="break-all hover:underline hover:underline-offset-4"
              href={`mailto:${email}`}
            >
              {email}
            </a>
          );
        }

        if (email.startsWith('http://') || email.startsWith('https://')) {
          return (
            <a
              className="break-all hover:underline hover:underline-offset-4"
              rel="nofollow noopener"
              target="_blank"
              href={email}
            >
              {email}
            </a>
          );
        }

        return <span className="break-all sm:break-normal">{email}</span>;
      }
    };
  };

  const tables = [
    {
      name: 'Domain Information',
      keys: {
        Registrar: () => result.registrar,
        Registered: () => {
          if (!result.created) {
            return null;
          }

          return (
            <time dateTime={result.created}>
              {new Date(result.created).toLocaleString()}
            </time>
          );
        },
        Expires: () => {
          if (!result.expires) {
            return null;
          }

          return (
            <time dateTime={result.expires}>
              {new Date(result.expires).toLocaleString()}
            </time>
          );
        },
        Updated: () => {
          if (!result.updated) {
            return null;
          }

          return (
            <time dateTime={result.updated}>
              {new Date(result.updated).toLocaleString()}
            </time>
          );
        },
        Status: () => {
          if (!result.status?.length) {
            return null;
          }

          return (
            <div className="flex flex-wrap gap-2">
              {result.status.map((s) => {
                const status =
                  EPP_STATUS_CODES.find(
                    (c) =>
                      s.toLowerCase() === c.toLowerCase() ||
                      s.split(' ')[0].toLowerCase() === c.toLowerCase()
                  ) ?? s;

                return (
                  <a
                    href={`https://www.icann.org/epp#${status}`}
                    className="w-fit"
                    target="_blank"
                    key={status}
                  >
                    <Badge
                      className="border-muted-foreground/25 hover:bg-muted-foreground/5 -ml-px border font-mono shadow-sm"
                      variant="outline"
                    >
                      {status}
                    </Badge>
                  </a>
                );
              })}
            </div>
          );
        },
        Nameservers: () => {
          if (!result.name_servers?.length) {
            return null;
          }

          return (
            <div className="flex flex-col gap-4 sm:flex-row">
              {result.name_servers.map((ns, idx) => {
                const nsDomain = parseDomain(ns);

                return (
                  <div
                    className="flex w-fit items-center gap-1.5"
                    key={`${idx}-${ns}`}
                  >
                    <div className="bg-secondary size-5 shrink-0 p-0.75">
                      <img
                        src={`https://api.favicon.victr.me/blob/https://${nsDomain}`}
                        className="aspect-square select-none"
                        draggable={false}
                        height={20}
                        width={20}
                        alt=""
                      />
                    </div>
                    <DataContextMenu type="domain" value={nsDomain}>
                      {ns}
                    </DataContextMenu>
                  </div>
                );
              })}
            </div>
          );
        }
      }
    },
    {
      name: 'Registrant Contact',
      keys: getContactInfoKeys('registrant')
    },
    {
      name: 'Administrative Contact',
      keys: getContactInfoKeys('admin')
    },
    {
      name: 'Technical Contact',
      keys: getContactInfoKeys('tech')
    },
    {
      name: 'Billing Contact',
      keys: getContactInfoKeys('billing')
    }
  ];

  return (
    <>
      <button
        type="button"
        className="text-primary flex w-fit items-center gap-1 font-medium"
        onClick={() => {
          setViewMode((prev) => (prev === 'normalized' ? 'raw' : 'normalized'));
        }}
      >
        <EyeIcon className="size-4" />
        View {viewMode === 'normalized' ? 'Raw' : 'Normalized'} Data
      </button>

      {viewMode === 'normalized' &&
        tables.map(({ name, keys }) => {
          // if all key values are undefined, skip the table
          if (Object.values(keys).every((value) => !value())) {
            return null;
          }

          return (
            <Card key={name}>
              <CardHeader>
                <CardTitle>{name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    {Object.entries(keys).map(([label, value]) => {
                      if (!label || !value) {
                        return null;
                      }
                      const val = value();
                      if (!val) {
                        return null;
                      }
                      return (
                        <TableRow key={label}>
                          <TableCell className="w-36 align-top font-medium">
                            {label}
                          </TableCell>
                          <TableCell>{val}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          );
        })}

      {viewMode === 'raw' && (
        <Card>
          <CardHeader>
            <CardTitle>Raw Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-secondary px-2 py-1.5">
              <code className="wrap-break-word whitespace-pre-wrap">
                {raw
                  ? raw.startsWith('{')
                    ? JSON.stringify(JSON.parse(raw), null, 2)
                    : raw
                  : 'No data available'}
              </code>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
