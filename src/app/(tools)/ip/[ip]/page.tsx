import { CheckIcon, SearchIcon, XIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { CACHE_REVALIDATE_SECONDS } from '@/lib/config';
import { TOOLS } from '@/lib/resources/tools';
import { cn } from '@/lib/utils';
import { api } from '@/trpc/server';
import type { InfoTable } from '@/types';
import { IPLookupForm } from '../form';
import { Map } from './_components/map';

interface IPLookupResultPageProps {
  params: { ip: string };
}

const getCachedIPLookup = unstable_cache(
  async (ip: string) => api.lookup.ip.mutate({ ip }),
  ['ip_lookup'],
  { revalidate: CACHE_REVALIDATE_SECONDS }
);

export async function generateMetadata({ params }: IPLookupResultPageProps) {
  const ip = decodeURIComponent(params.ip).toLowerCase();
  const result = await getCachedIPLookup(ip);
  if (!result) {
    notFound();
  }
  return {
    title: `IP Lookup for ${ip}`,
    description: TOOLS.find((tool) => tool.slug === 'ip')?.description
  } satisfies Metadata;
}

export default async function IPLookupResultPage({
  params
}: IPLookupResultPageProps) {
  const ip = decodeURIComponent(params.ip).toLowerCase();
  const result = await getCachedIPLookup(ip);
  if (!result) {
    notFound();
  }

  const properties = [
    { label: 'Bogon', value: result.is_bogon },
    { label: 'Mobile', value: result.is_mobile },
    { label: 'Crawler', value: result.is_crawler },
    { label: 'Datacenter', value: result.is_datacenter },
    { label: 'Tor', value: result.is_tor },
    { label: 'Proxy', value: result.is_proxy },
    { label: 'VPN', value: result.is_vpn },
    { label: 'Abuser', value: result.is_abuser }
  ];

  const table = {
    name: 'IP Address Information',
    keys: {
      'Postal Code': () => result.location.zip,
      Location: () => `${result.location.city}, ${result.location.state}`,
      Country: () => result.location.country,
      'Time Zone': () => result.location.timezone,
      ISP: () => (
        <div className="space-y-1">
          <div>
            <p className="font-medium">{result.asn.org}</p>
            <p className="font-mono text-xs">{result.asn.descr}</p>
          </div>
          <div>
            <p className="text-xs">
              Abuse email:{' '}
              <Link
                className="font-mono hover:underline"
                rel="nofollow noopener"
                target="_blank"
                href={
                  result.asn.abuse.includes('@')
                    ? `mailto:${result.asn.abuse}`
                    : `https://${result.asn.abuse}`
                }
              >
                {result.asn.abuse}
              </Link>
            </p>
            <p className="whitespace-nowrap text-xs">
              Abuse score:{' '}
              <span className="font-mono">{result.asn.abuser_score}</span>
            </p>
          </div>
          <div>
            {result.asn.domain && (
              <p className="text-xs">
                Domain:{' '}
                <Link
                  href={`https://${result.asn.domain}`}
                  className="font-mono hover:underline"
                  rel="nofollow noopener"
                  target="_blank"
                >
                  {result.asn.domain}
                </Link>
              </p>
            )}
            <p className="text-xs">
              Route: <span className="font-mono">{result.asn.route}</span>
            </p>
            <p className="text-xs">
              Type:{' '}
              <span className="font-mono">{result.asn.type.toUpperCase()}</span>
            </p>
          </div>
        </div>
      ),
      Company: () => {
        if (!result.company) {
          return null;
        }
        return (
          <div className="space-y-1">
            <div>
              <p className="font-medium">{result.company.name}</p>
              <p className="text-xs">
                Network:{' '}
                <span className="font-mono">{result.company.network}</span>
              </p>
            </div>
            <div>
              <p className="whitespace-nowrap text-xs">
                Abuse score:{' '}
                <span className="font-mono">{result.company.abuser_score}</span>
              </p>
              {result.company.domain && (
                <p className="text-xs">
                  Domain:{' '}
                  <Link
                    href={`https://${result.company.domain}`}
                    className="font-mono hover:underline"
                    rel="nofollow noopener"
                    target="_blank"
                  >
                    {result.company.domain}
                  </Link>
                </p>
              )}
              <p className="text-xs">
                Type:{' '}
                <span className="font-mono">
                  {result.company.type.toUpperCase()}
                </span>
              </p>
            </div>
          </div>
        );
      },
      Properties: () => (
        <div className="grid grid-cols-2 gap-1 lg:grid-cols-4">
          {properties.map((property) => {
            const PropertyIcon = property.value ? CheckIcon : XIcon;
            return (
              <div key={property.label} className="flex items-center">
                <PropertyIcon
                  strokeWidth={2}
                  className={cn(
                    'mr-1 h-4 w-4 shrink-0',
                    property.value ? 'text-green-600' : 'text-red-600'
                  )}
                />
                {property.label}
              </div>
            );
          })}
        </div>
      )
    }
  } satisfies InfoTable;

  return (
    <>
      <div className="my-4 flex flex-col items-center justify-between gap-2 sm:flex-row">
        <div className="flex items-center gap-3 text-3xl font-semibold tracking-tight">
          <Image
            className="rounded-lg bg-white object-contain px-1 shadow ring-1 ring-muted-foreground/25"
            src={`https://flagsapi.com/${result.location.country_code}/shiny/32.png`}
            unoptimized
            height={40}
            width={40}
            alt=""
          />
          <h2>{ip}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <SearchIcon className="mr-2 h-4 w-4" />
                Search again
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="rounded-full p-0 shadow-none"
              sideOffset={8}
            >
              <IPLookupForm />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Card className="h-fit">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{table.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {Object.entries(table.keys).map(([label, value]) => {
                  if (!label || !value) {
                    return null;
                  }
                  const val = value();
                  if (!val) {
                    return null;
                  }
                  return (
                    <TableRow key={label}>
                      <TableCell className="whitespace-nowrap align-top font-medium">
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
        <Card className="aspect-square min-h-80 p-1">
          <Map location={result.location} />
        </Card>
      </div>
    </>
  );
}
