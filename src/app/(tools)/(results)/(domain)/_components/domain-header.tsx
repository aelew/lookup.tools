'use client';

import { ExternalLinkIcon, SearchIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSelectedLayoutSegments } from 'next/navigation';
import type { ComponentType } from 'react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import type { DomainTool } from '@/types';

const DNSLookupForm = dynamic(() => import('../dns/form'));
const WhoisLookupForm = dynamic(() => import('../whois/form'));
const SubdomainFinderForm = dynamic(() => import('../subdomain/form'));

const forms: Record<DomainTool, ComponentType> = {
  dns: DNSLookupForm,
  whois: WhoisLookupForm,
  subdomain: SubdomainFinderForm
};

export function DomainHeader() {
  const params = useParams();
  const segments = useSelectedLayoutSegments();
  const domain = params.domain as string | undefined;
  const toolSlug = segments[0] as DomainTool | undefined;
  if (!domain || !toolSlug) {
    throw new Error('<DomainHeader /> component used out of scope');
  }

  // get the form component for the current tool
  const SearchAgainForm = forms[toolSlug];

  return (
    <div className="my-4 flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
      <div className="flex items-center gap-3 text-3xl font-semibold tracking-tight">
        <Image
          className="aspect-square rounded-lg bg-accent/75 object-contain p-1 shadow ring-1 ring-muted-foreground/25"
          src={`https://api.favicon.victr.me/blob/https://${domain}`}
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
            className="rounded-full border-none bg-transparent p-0 shadow-none"
            sideOffset={8}
          >
            <SearchAgainForm />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
