import { ExternalLinkIcon, SearchIcon } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ContactInfo } from '@/lib/whois';
import { api } from '@/trpc/server';
import type { InfoTable } from '@/types';
import { WHOISLookupForm } from '../form';

interface WHOISLookupResultPageProps {
  params: { domain: string };
}

const getCachedWHOISLookup = unstable_cache(
  async (domain: string) => api.lookup.whois.mutate({ domain }),
  ['whois_lookup'],
  { revalidate: 15 }
);

export default async function WHOISLookupResultPage({
  params
}: WHOISLookupResultPageProps) {
  const domain = decodeURIComponent(params.domain).toLowerCase();
  const result = await getCachedWHOISLookup(domain);
  if (!result) {
    notFound();
  }

  const getContactInfoKeys = (contact?: ContactInfo) => ({
    Name: () => contact?.name,
    Organization: () => contact?.organization,
    Street: () => contact?.street,
    City: () => contact?.city,
    State: () => contact?.province,
    'Postal Code': () => contact?.postal_code,
    Country: () => contact?.country,
    Phone: () => contact?.phone,
    Email: () => contact?.email
  });

  const tables: InfoTable[] = [
    {
      name: 'Domain Information',
      keys: {
        Registrar: () => result.registrar?.name,
        Registered: () =>
          result.domain.created_date
            ? new Date(
                result.domain.created_date_in_time ?? result.domain.created_date
              ).toString()
            : null,
        Updated: () =>
          result.domain.updated_date
            ? new Date(
                result.domain.updated_date_in_time ?? result.domain.updated_date
              ).toString()
            : null,
        Expires: () =>
          result.domain.expiration_date
            ? new Date(
                result.domain.expiration_date_in_time ??
                  result.domain.expiration_date
              ).toString()
            : null,
        Status: () => (
          <div className="inline-flex flex-col">
            {result.domain.status.map((status) => (
              <Link
                href={`https://www.icann.org/epp#${status}`}
                className="hover:underline"
                key={status}
              >
                {status}
              </Link>
            ))}
          </div>
        ),
        Nameservers: () => (
          <div className="inline-flex flex-col gap-1">
            {result.domain.name_servers.map((ns, i) => {
              const parts = ns.split('.');
              const baseDomain =
                parts.length > 2 ? parts.slice(1).join('.') : ns;
              return (
                <div className="flex items-center gap-2" key={i}>
                  <div className="h-5 w-5 shrink-0 rounded p-0.5 shadow ring-1 ring-muted-foreground/25">
                    <Image
                      src={`https://icons.duckduckgo.com/ip3/${baseDomain}.ico`}
                      className="select-none"
                      draggable={false}
                      unoptimized
                      height={20}
                      width={20}
                      alt=""
                    />
                  </div>
                  <Link
                    className="flex items-center gap-2 hover:underline"
                    href={`/whois/${baseDomain}`}
                    key={ns}
                  >
                    {ns}
                  </Link>
                </div>
              );
            })}
          </div>
        )
      }
    },
    {
      name: 'Registrant Contact',
      keys: getContactInfoKeys(result.registrant)
    },
    {
      name: 'Administrative Contact',
      keys: getContactInfoKeys(result.administrative)
    },
    {
      name: 'Technical Contact',
      keys: getContactInfoKeys(result.technical)
    },
    {
      name: 'Billing Contact',
      keys: getContactInfoKeys(result.billing)
    }
  ];

  return (
    <>
      <div className="my-4 flex flex-col items-center justify-between gap-2 sm:flex-row">
        <div className="flex items-center gap-3 text-3xl font-semibold tracking-tight">
          <Image
            className="rounded-lg bg-white object-contain p-1 shadow ring-1 ring-muted-foreground/25"
            src={`https://icons.duckduckgo.com/ip3/${domain}.ico`}
            unoptimized
            height={36}
            width={36}
            alt=""
          />
          <h2>{domain}</h2>
          <Link href={`https://${domain}`} target="_blank">
            <ExternalLinkIcon className="mt-1 size-4 transition-colors hover:opacity-80" />
          </Link>
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
              <WHOISLookupForm />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Tabs value="whois">
        <TabsList className="shadow">
          <Link href={`/dns/${domain}`}>
            <TabsTrigger value="dns">DNS Records</TabsTrigger>
          </Link>
          <TabsTrigger value="whois">WHOIS Lookup</TabsTrigger>
        </TabsList>
        <TabsContent value="whois" className="mt-4 space-y-4">
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
        </TabsContent>
      </Tabs>
    </>
  );
}
