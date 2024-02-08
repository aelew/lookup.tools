import { SearchIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { TOOLS } from '@/lib/resources/tools';
import { parseDomain } from '@/lib/utils';
import { CopyButton } from '../../_components/copy-button';
import { EmailLookupForm } from '../form';
import { AccountsCard } from './_components/accounts/card';
import { GoogleCard } from './_components/google/card';

interface EmailLookupResultPageProps {
  params: { email: string };
}

export async function generateMetadata({ params }: EmailLookupResultPageProps) {
  const email = decodeURIComponent(params.email).toLowerCase();
  return {
    title: `Email Lookup for ${email}`,
    description: TOOLS.find((tool) => tool.slug === 'email')?.description
  } satisfies Metadata;
}

export default async function EmailLookupResultPage({
  params
}: EmailLookupResultPageProps) {
  const email = decodeURIComponent(params.email).toLowerCase();
  const domain = parseDomain(email);
  return (
    <>
      <div className="my-4 flex flex-col items-center justify-between gap-2 sm:flex-row">
        <div className="flex items-center gap-3 text-3xl font-semibold tracking-tight">
          <Image
            className="aspect-square rounded-lg bg-accent/75 object-contain p-1 shadow ring-1 ring-muted-foreground/25"
            src={`https://favicon.victr.me/blob/https://${domain}`}
            height={36}
            width={36}
            alt=""
          />
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
      <div className="mt-4 flex flex-col gap-4">
        <GoogleCard email={email} />
        <AccountsCard email={email} />
      </div>
    </>
  );
}
