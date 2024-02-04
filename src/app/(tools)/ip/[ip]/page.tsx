import { unstable_cache } from 'next/cache';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { type ReactNode } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { api } from '@/trpc/server';
import { Map } from './_components/map';

interface WHOISLookupResultPageProps {
  params: {
    ip: string;
  };
}

interface InfoTable {
  name: string;
  keys: Record<string, () => ReactNode | JSX.Element | undefined>;
}

const getCachedIPLookup = unstable_cache(
  async (ip: string) => api.lookup.ip.mutate({ ip }),
  ['ip_lookup'],
  { revalidate: 15 }
);

export default async function WHOISLookupResultPage({
  params
}: WHOISLookupResultPageProps) {
  const domain = decodeURIComponent(params.ip).toLowerCase();
  const result = await getCachedIPLookup(domain);
  if (!result) {
    notFound();
  }

  // const Map =dynamic(() => import('./_components/map'), { ssr: false })

  console.log(result);
  const tables: InfoTable[] = [
    {
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
    }
  ];

  return (
    <>
      <div className="my-4 flex items-center justify-between space-y-2">
        <div className="flex items-center gap-3 text-3xl font-semibold tracking-tight">
          <Image
            className="rounded-lg bg-white object-contain px-1 shadow ring-1 ring-muted-foreground/25"
            src={`https://flagsapi.com/${
              (
                result.country ??
                result.represented_country ??
                result.registered_country
              )?.iso_code
            }/shiny/64.png`}
            unoptimized
            height={40}
            width={40}
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
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {tables.map(({ name, keys }) => {
          // if all key values are undefined, skip the table
          if (Object.values(keys).every((value) => !value())) {
            return null;
          }
          return (
            <Card key={name}>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{name}</CardTitle>
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
        <Card className="min-h-80 p-1">
          <Map location={result.location} />
        </Card>
      </div>
    </>
  );
}
