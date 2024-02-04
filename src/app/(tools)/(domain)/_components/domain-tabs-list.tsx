import Link from 'next/link';

import { TabsList, TabsTrigger } from '@/components/ui/tabs';

const TABS = [
  { value: 'dns', label: 'DNS Lookup' },
  { value: 'whois', label: 'WHOIS Lookup' }
] as const;

interface DomainTabsListProps {
  value: (typeof TABS)[number]['value'];
  domain: string;
}

export function DomainTabsList({ value, domain }: DomainTabsListProps) {
  return (
    <TabsList className="mx-auto w-fit shadow sm:mx-0">
      {TABS.map((tab) =>
        tab.value === value ? (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ) : (
          <Link key={tab.value} href={`/${tab.value}/${domain}`}>
            <TabsTrigger value={tab.value}>{tab.label}</TabsTrigger>
          </Link>
        )
      )}
    </TabsList>
  );
}