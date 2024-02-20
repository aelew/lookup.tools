'use client';

import Link from 'next/link';
import { useParams, useSelectedLayoutSegments } from 'next/navigation';
import type { PropsWithChildren } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { DomainTool } from '@/types';

const TABS = [
  { value: 'dns', label: 'DNS Lookup' },
  { value: 'whois', label: 'WHOIS Lookup' },
  { value: 'subdomain', label: 'Subdomain Finder' }
] as const;

export function DomainTabs({ children }: PropsWithChildren) {
  const segments = useSelectedLayoutSegments();
  const toolSlug = segments[0] as DomainTool | undefined;
  if (!toolSlug) {
    throw new Error('<DomainTabs /> component used out of scope');
  }
  return (
    <Tabs className="flex flex-col" value={toolSlug}>
      <DomainTabsList />
      <TabsContent className="mt-4 space-y-4" value={toolSlug}>
        {children}
      </TabsContent>
    </Tabs>
  );
}

export function DomainTabsList() {
  const params = useParams();
  const segments = useSelectedLayoutSegments();
  const domain = params.domain as string | undefined;
  const toolSlug = segments[0] as DomainTool | undefined;
  if (!domain || !toolSlug) {
    throw new Error('<DomainTabsList /> component used out of scope');
  }
  return (
    <div className="overflow-auto">
      <TabsList className="w-max">
        {TABS.map((tab) =>
          tab.value === toolSlug ? (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ) : (
            <TabsTrigger key={tab.value} value={tab.value} asChild>
              <Link href={`/${tab.value}/${domain}`}>{tab.label}</Link>
            </TabsTrigger>
          )
        )}
      </TabsList>
    </div>
  );
}
