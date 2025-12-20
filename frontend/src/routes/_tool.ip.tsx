import { Gauge } from '@suyalcinkaya/gauge';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, notFound } from '@tanstack/react-router';
import { CheckIcon, MinusIcon } from 'lucide-react';

import { DataContextMenu } from '@/components/data-context-menu';
import { Map } from '@/components/map';
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
import { getToolMetadata } from '@/lib/meta';
import { getToolQueryOptions } from '@/lib/query';
import { cn } from '@/lib/utils';
import type { IPAddressLookupResponse } from '@/types/tools/ip';

export const Route = createFileRoute('/_tool/ip')({
  component: RouteComponent,
  head: ({ match: { search } }) => ({
    meta: getToolMetadata('ip', !!search.q)
  })
});

function RouteComponent() {
  const { q } = Route.useSearch();
  if (!q) {
    throw notFound();
  }

  const query = useQuery(getToolQueryOptions<IPAddressLookupResponse>('ip', q));
  const result = query.data?.data;

  if (!result) {
    return null;
  }

  const keys = {
    ASN: () => {
      if (!result.asn) {
        return null;
      }

      return (
        <div className="grid gap-0.5">
          <p className="-mt-0.5 font-medium">
            {result.asn.name}
            <Badge
              className="ml-2 px-1 py-0.25 font-mono text-[0.7rem]"
              variant="secondary"
            >
              {result.asn.asn}
            </Badge>
          </p>

          <Table>
            <TableBody className="[&>tr>td:first-child]:w-[1%] [&>tr>td:first-child]:align-top [&>tr>td:first-child]:font-medium [&>tr>td:first-child]:whitespace-nowrap">
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      result.asn.type === 'isp' ? 'uppercase' : 'capitalize'
                    )}
                  >
                    {result.asn.type}
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Domain</TableCell>
                <TableCell>
                  <DataContextMenu type="domain" value={result.asn.domain}>
                    {result.asn.domain}
                  </DataContextMenu>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Route</TableCell>
                <TableCell>{result.asn.route}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      );
    },
    Carrier: () => {
      if (!result.carrier) {
        return null;
      }

      return (
        <div className="grid gap-0.5">
          <p className="font-medium">{result.carrier.name}</p>

          <Table>
            <TableBody className="[&>tr>td:first-child]:w-[1%] [&>tr>td:first-child]:align-top [&>tr>td:first-child]:font-medium [&>tr>td:first-child]:whitespace-nowrap">
              <TableRow>
                <TableCell>MCC</TableCell>
                <TableCell>{result.carrier.mcc}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>MNC</TableCell>
                <TableCell>{result.carrier.mnc}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      );
    },
    Location: () => {
      const location = [
        result.city,
        result.region,
        result.postal,
        result.country_name
      ].filter(Boolean);

      if (!location.length) {
        return null;
      }

      return location.join(', ');
    },
    'Time Zone': () => {
      if (!result.time_zone.name) {
        return null;
      }

      return `${result.time_zone.abbr} - ${result.time_zone.name}`;
    },
    Languages: () => {
      if (!result.languages) {
        return null;
      }

      return result.languages.map((language) => language.name).join(', ');
    },
    Currency: () => {
      if (!result.currency.name) {
        return null;
      }

      return `${result.currency.name} (${result.currency.code} ${result.currency.symbol})`;
    }
  };

  return (
    <section className="grid gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody className="[&>tr>td:first-child]:w-[1%] [&>tr>td:first-child]:align-top [&>tr>td:first-child]:font-medium [&>tr>td:first-child]:whitespace-nowrap">
                {Object.entries(keys).map(([label, value]) => {
                  if (!value) {
                    return null;
                  }

                  const val = value();
                  if (!val) {
                    return null;
                  }

                  return (
                    <TableRow key={label}>
                      <TableCell>{label}</TableCell>
                      <TableCell>{val}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {result.threat && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                Threat Analysis
                <Gauge
                  size="xs"
                  variant="ascending"
                  gapPercent={5}
                  strokeWidth={10}
                  showValue
                  showAnimation
                  primary={{
                    '0': 'hsl(131 41% 46%)',
                    '30': 'hsl(39 100% 57%)',
                    '60': 'hsl(358 75% 59%)'
                  }}
                  secondary="color-mix(in oklab, var(--input) 80%, transparent)"
                  // const threatEntries = Object.entries(result.threat).filter(([k]) => k.startsWith('is_'));
                  // const trueCount = threatEntries.filter(([_, value]) => value === true).length;
                  // const threatScore = (trueCount / threatEntries.length) * 100;
                  value={Object.entries(result.threat)
                    .filter(([k]) => k.startsWith('is_'))
                    .reduce(
                      // uhh yeah
                      (acc, [_, v], i, arr) =>
                        i === arr.length - 1
                          ? ((acc + (v ? 1 : 0)) / arr.length) * 100
                          : acc + (v ? 1 : 0),
                      0
                    )}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div className="grid grid-cols-2 gap-1 md:grid-cols-3">
                {Object.entries(result.threat)
                  .filter(([k]) => k.startsWith('is_'))
                  .map(([key, value]) => {
                    const label = key.slice(3).replace('_', ' ');
                    const Icon = value ? CheckIcon : MinusIcon;

                    return (
                      <div
                        key={key}
                        className={cn(
                          'flex items-center gap-1 text-[0.7rem] tracking-wide uppercase',
                          !value && 'text-muted-foreground/70'
                        )}
                      >
                        <Icon
                          className={cn(
                            'size-4 shrink-0',
                            value
                              ? 'text-green-600'
                              : 'text-muted-foreground/60'
                          )}
                        />
                        {label}
                      </div>
                    );
                  })}
              </div>

              {result.threat.blocklists.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Blocklists</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Site</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="[&>tr>td:first-child]:w-[1%] [&>tr>td:first-child]:align-top [&>tr>td:first-child]:font-medium [&>tr>td:first-child]:whitespace-nowrap">
                        {result.threat.blocklists.map((blocklist) => (
                          <TableRow key={blocklist.name}>
                            <TableCell>{blocklist.name}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {blocklist.type
                                  .split('_')
                                  .map(
                                    (w) =>
                                      w.charAt(0).toUpperCase() + w.slice(1)
                                  )
                                  .join(' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <DataContextMenu
                                type="domain"
                                value={new URL(blocklist.site).hostname}
                              >
                                {new URL(blocklist.site).hostname}
                              </DataContextMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      {!!result.latitude && !!result.longitude && (
        <Card className="aspect-square min-h-80 p-1">
          <Map
            location={{
              latitude: result.latitude,
              longitude: result.longitude
            }}
          />
        </Card>
      )}
    </section>
  );
}
