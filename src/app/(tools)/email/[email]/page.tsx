import { SearchIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Table, TableBody } from '@/components/ui/table';
import { CACHE_REVALIDATE_SECONDS } from '@/lib/config';
import { TOOLS } from '@/lib/resources/tools';
import { api } from '@/trpc/server';
import { CopyButton } from '../../_components/copy-button';
import { EmailLookupForm } from '../form';

interface EmailLookupResultPageProps {
  params: { email: string };
}

const getCachedEmailLookup = unstable_cache(
  async (email: string) => api.lookup.email.mutate({ email }),
  ['email_lookup'],
  { revalidate: CACHE_REVALIDATE_SECONDS }
);

export async function generateMetadata({ params }: EmailLookupResultPageProps) {
  const email = decodeURIComponent(params.email).toLowerCase();
  const result = await getCachedEmailLookup(email);
  if (!result) {
    notFound();
  }
  return {
    title: `Email Lookup for ${email}`,
    description: TOOLS.find((tool) => tool.slug === 'email')?.description
  } satisfies Metadata;
}

export default async function emailLookupResultPage({
  params
}: EmailLookupResultPageProps) {
  const email = decodeURIComponent(params.email).toLowerCase();
  const result = await getCachedEmailLookup(email);
  if (!result.success) {
    notFound();
  }

  return (
    <>
      <div className="my-4 flex flex-col items-center justify-between gap-2 sm:flex-row">
        <div className="flex items-center gap-3 text-3xl font-semibold tracking-tight">
          {/* <Image
            className="rounded-lg bg-white object-contain px-1 shadow ring-1 ring-muted-foreground/25"
            src={`https://flagsapi.com/${result.location.country}/shiny/32.png`}
            unoptimized
            height={40}
            width={40}
            alt=""
          /> */}
          <h2>{email}</h2>
          <CopyButton className="ml-0 size-4" text={email} />
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
              <EmailLookupForm />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Card className="h-fit">
          <CardHeader className="pb-2">
            {/* <CardTitle className="text-2xl">{table.name}</CardTitle> */}
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {/* {Object.entries(table.keys).map(([label, value]) => {
                  if (!label || !value) {
                    return null;
                  }
                  const val = value();
                  if (!val) {
                    return null;
                  }
                  return (
                    <TableRow key={label}>
                      <TableCell className="w-[1%] whitespace-nowrap align-top font-medium">
                        {label}
                      </TableCell>
                      <TableCell>{val}</TableCell>
                    </TableRow>
                  );
                })} */}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="aspect-square min-h-80 p-1">
          {/* <Map location={result.location} /> */}
        </Card>
      </div>
    </>
  );
}
