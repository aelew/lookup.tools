import {
  GlobeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIncomingIcon,
  SearchIcon
} from 'lucide-react';

import { Logo } from '@/components/logo';
import { Card } from '@/components/ui/card';
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
        <Card className="mx-auto max-w-sm p-2">
          <div className="relative flex items-center">
            <SearchIcon className="absolute ml-3 size-4 text-muted-foreground" />
            <Input className="pl-8" placeholder="Search tools" />
          </div>
        </Card>
      </section>
      <section className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} {...tool} />
        ))}
      </section>
    </>
  );
}
