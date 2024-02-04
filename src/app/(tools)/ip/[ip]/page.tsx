import { SearchIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { TOOLS } from '@/lib/resources/tools';
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
  { revalidate: 15 }
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

  const table = {
    name: 'IP Address Information',
    keys: {
      'Time Zone': () => result.location?.time_zone,
      Continent: () => result.continent?.names.en,
      Country: () =>
        (
          result.country ??
          result.represented_country ??
          result.registered_country
        )?.names.en,
      Location: () =>
        result.city
          ? result.city.names.en +
            (result.subdivisions?.length
              ? `, ${result.subdivisions[0]!.iso_code}`
              : null)
          : null,
      'Postal Code': () => result.postal?.code
    }
  } satisfies InfoTable;

  return (
    <>
      <div className="my-4 flex flex-col items-center justify-between gap-2 sm:flex-row">
        <div className="flex items-center gap-3 text-3xl font-semibold tracking-tight">
          <Image
            className="rounded-lg bg-white object-contain px-1 shadow ring-1 ring-muted-foreground/25"
            src={`https://flagsapi.com/${
              (
                result.country ??
                result.represented_country ??
                result.registered_country
              )?.iso_code
            }/shiny/32.png`}
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
        <Card>
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
        <Card className="min-h-80 p-1">
          <Map location={result.location} />
        </Card>
      </div>
    </>
  );
}
