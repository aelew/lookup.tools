import Link from 'next/link';

import { TabsList, TabsTrigger } from '@/components/ui/tabs';

const TABS = [
  { value: 'dns', label: 'DNS Lookup' },
  { value: 'whois', label: 'WHOIS Lookup' },
  { value: 'subdomain', label: 'Subdomain Finder' }
] as const;

interface DomainTabsListProps {
  value: (typeof TABS)[number]['value'];
  domain: string;
}

export function DomainTabsList({ value, domain }: DomainTabsListProps) {
  return (
    <div className="overflow-auto">
      <TabsList className="w-max">
        {TABS.map((tab) =>
          tab.value === value ? (
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
