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
import { api } from '@/trpc/server';
import type { InfoTable } from '@/types';
import { WHOISLookupForm } from '../form';

interface WHOISLookupResultPageProps {
  params: {
    domain: string;
  };
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
  const { raw, result } = await getCachedWHOISLookup(domain);
  if (!result?.exists || !result.domain) {
    notFound();
  }

  const tables: InfoTable[] = [
    {
      name: 'Domain Information',
      keys: {
        Registrar: () => result.registrar,
        Registered: () =>
          result.created
            ? Array.isArray(result.created)
              ? result.created[0]?.toString()
              : result.created.toString()
            : null,
        Updated: () => result.updated?.toString(),
        Expires: () => result.expiration?.toString(),
        Status: () => {
          if (!result.status) {
            return null;
          }
          if (Array.isArray(result.status)) {
            return (
              <div className="inline-flex flex-col">
                {result.status.map((status) => {
                  const [code, href] = status.split(' ');
                  return (
                    <Link className="hover:underline" key={code} href={href!}>
                      {code}
                    </Link>
                  );
                })}
              </div>
            );
          }
          const [code, href] = result.status.split(' ');
          return (
            <Link className="hover:underline" href={href!}>
              {code}
            </Link>
          );
        },
        Nameservers: () => {
          const nameservers = result.nameservers as string[] | undefined;
          if (!nameservers) {
            return null;
          }
          return (
            <div className="inline-flex flex-col gap-1">
              {nameservers.map((ns, i) => {
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
          );
        }
      }
    },
    {
      name: 'Registrant Contact',
      keys: {
        Name: () => result.registrantName,
        Organization: () => result.registrantOrganization,
        Street: () => result.registrantStreet,
        City: () => result.registrantCity,
        State: () => result.registrantStateProvince,
        'Postal Code': () => result.registrantPostalCode,
        Country: () => result.registrantCountry,
        Phone: () => result.registrantPhone,
        Email: () =>
          result.registrantEmail?.toString().includes('@')
            ? result.registrantEmail
            : null
      }
    },
    {
      name: 'Admin Contact',
      keys: {
        Name: () => result.adminName,
        Organization: () => result.adminOrganization,
        Street: () => result.adminStreet,
        City: () => result.adminCity,
        State: () => result.adminStateProvince,
        'Postal Code': () => result.adminPostalCode,
        Country: () => result.adminCountry,
        Phone: () => result.adminPhone,
        Email: () =>
          result.adminEmail?.toString().includes('@') ? result.adminEmail : null
      }
    },
    {
      name: 'Technical Contact',
      keys: {
        Name: () => result.techName,
        Organization: () => result.techOrganization,
        Street: () => result.techStreet,
        City: () => result.techCity,
        State: () => result.techStateProvince,
        'Postal Code': () => result.techPostalCode,
        Country: () => result.techCountry,
        Phone: () => result.techPhone,
        Email: () =>
          result.techEmail?.toString().includes('@') ? result.techEmail : null
      }
    },
    {
      name: 'Billing Contact',
      keys: {
        Name: () => result.billingName,
        Organization: () => result.billingOrganization,
        Street: () => result.billingStreet,
        City: () => result.billingCity,
        State: () => result.billingStateProvince,
        'Postal Code': () => result.billingPostalCode,
        Country: () => result.billingCountry,
        Phone: () => result.billingPhone,
        Email: () =>
          result.billingEmail?.toString().includes('@')
            ? result.billingEmail
            : null
      }
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
          <div className="rounded-xl border bg-background px-4 py-3 text-sm">
            <code className="whitespace-pre-wrap">
              {raw?.replaceAll('   ', '').trim()}
            </code>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
