import {
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
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.'
  },
  {
    icon: MapPinIcon,
    name: 'IP Address Lookup',
    slug: 'ip',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.'
  },
  {
    icon: MailIcon,
    name: 'Email Address Lookup',
    slug: 'email',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.'
  },
  {
    icon: PhoneIncomingIcon,
    name: 'Phone Number Lookup',
    slug: 'phone-number',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.'
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
              lookup.tools
            </h1>
          </div>
          <h2 className="mx-auto max-w-2xl text-center font-medium tracking-tight text-muted-foreground">
            The one-stop shop for all your research needs.
          </h2>
        </div>
        <div className="relative mx-auto flex max-w-sm items-center">
          <SearchIcon className="absolute ml-4 size-4 text-muted-foreground" />
          <Input
            className="h-auto rounded-full py-3 pl-10 pr-4 shadow-lg"
            placeholder="Search tools..."
          />
        </div>
      </section>
      <section className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} {...tool} />
        ))}
      </section>
    </>
  );
}
