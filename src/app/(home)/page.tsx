import {
  CloudCogIcon,
  GlobeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIncomingIcon,
  SearchIcon
} from 'lucide-react';

import { Logo } from '@/components/logo';
import { Input } from '@/components/ui/input';
import { ToolCard } from './_components/tool-card';

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
      'Find out who owns a domain, including contact information, registration dates, and more.'
  },
  {
    icon: MapPinIcon,
    name: 'IP Address Lookup',
    slug: 'ip',
    description:
      'Lookup information on an IP address, including location, ISP, and more.'
  },
  {
    icon: MailIcon,
    name: 'Email Address Lookup',
    slug: 'email',
    description: 'Lookup information on an email address.'
  },
  {
    icon: PhoneIncomingIcon,
    name: 'Phone Number Lookup',
    slug: 'phone-number',
    description:
      'Lookup information on a phone number, including owner name, carrier, location, and more.'
  }
];

export default function HomePage() {
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
        <div className="relative mx-auto flex max-w-sm items-center">
          <SearchIcon className="absolute ml-4 size-4 text-muted-foreground" />
          <Input
            className="h-auto rounded-full py-3 pl-10 pr-4 shadow-lg focus-visible:ring-0"
            placeholder="Search tools..."
            autoFocus
          />
        </div>
      </section>
      <section className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} {...tool} />
        ))}
      </section>
    </>
  );
}
