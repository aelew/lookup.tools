import {
  CloudCogIcon,
  GlobeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIncomingIcon
} from 'lucide-react';

import { Logo } from '@/components/logo';
import { SearchBar } from './_components/search-bar';
import { ToolCard } from './_components/tool-card';

interface HomePageProps {
  searchParams: { q?: string };
}

const tools = [
  {
    icon: GlobeIcon,
    name: 'DNS Lookup',
    slug: 'dns',
    description:
      "Discover a domain's DNS records, including IP address, name servers, A records, and more."
  },
  {
    icon: CloudCogIcon,
    name: 'WHOIS Lookup',
    slug: 'whois',
    description:
      'Look up information on domain owners, registration dates, nameservers, and more.'
  },
  {
    icon: MapPinIcon,
    name: 'IP Address Lookup',
    slug: 'ip',
    description: 'Coming soon!'
  },
  {
    icon: MailIcon,
    name: 'Email Address Lookup',
    slug: 'email',
    description: 'Coming soon!'
  },
  {
    icon: PhoneIncomingIcon,
    name: 'Phone Number Lookup',
    slug: 'phone-number',
    description: 'Coming soon!'
  }
];

export default function HomePage({ searchParams }: HomePageProps) {
  const query = searchParams.q?.toLowerCase();
  return (
    <>
      <section className="space-y-6 py-12 sm:py-24">
        <div className="space-y-4">
          <div className="mx-auto flex max-w-5xl items-center justify-center gap-4">
            <Logo className="size-12 sm:size-16" />
            <h1 className="text-5xl font-semibold tracking-tighter md:text-6xl">
              Lookup Tools
            </h1>
          </div>
          <h2 className="mx-auto max-w-lg text-center text-sm font-medium tracking-tight text-muted-foreground sm:text-base">
            The cyber swiss army knife of lookup tools. Research information on
            domains, IP addresses, email addresses, phone numbers, and more.
          </h2>
        </div>
        <SearchBar />
      </section>
      <section className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {tools
          .filter(
            (tool) =>
              !query ||
              tool.name.toLowerCase().includes(query) ||
              tool.description.toLowerCase().includes(query)
          )
          .map((tool) => (
            <ToolCard key={tool.slug} {...tool} />
          ))}
      </section>
    </>
  );
}
