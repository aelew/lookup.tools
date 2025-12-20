import { createFileRoute, Link } from '@tanstack/react-router';
import { SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Logo } from '@/components/layout/logo';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '@/components/ui/input-group';
import useMediaQuery from '@/hooks/use-media-query';
import { APP_DESCRIPTION, t, TOOL_METADATA } from '@/lib/meta';
import type { ToolKey } from '@/lib/meta';

export const Route = createFileRoute('/')({
  component: RouteComponent,
  head: () => ({
    meta: [
      { title: t('Domain, IP, & Email Intelligence') },
      { name: 'description', content: APP_DESCRIPTION }
    ]
  })
});

function RouteComponent() {
  const [search, setSearch] = useState('');
  const { isDesktop } = useMediaQuery();

  useEffect(() => {
    if (isDesktop) {
      document.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
    }
  }, [isDesktop]);

  return (
    <>
      <section className="grid gap-6 py-12 sm:py-24">
        {/* hero */}
        <hgroup className="grid gap-4 text-center">
          <h1 className="flex items-center justify-center gap-4 text-5xl font-semibold tracking-tighter md:text-6xl">
            <Logo className="size-12 sm:size-16" />
            <span className="lowercase">
              Lookup
              <span className="-mr-2.75 before:opacity-60 before:content-['.']">
                {' '}
              </span>
              Tools
            </span>
          </h1>
          <p className="text-muted-foreground mx-auto max-w-lg text-base text-pretty">
            The cyber swiss army knife of lookup tools. Research information on
            domains, IP&nbsp;addresses, email addresses, and more.
          </p>
        </hgroup>

        {/* tool search */}
        <InputGroup className="mx-auto max-w-sm shadow-lg">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            placeholder="Search tools..."
            onChange={(e) => setSearch(e.target.value.trim().toLowerCase())}
          />
        </InputGroup>
      </section>

      {/* tools */}
      <section className="flex flex-wrap justify-center gap-8 pb-12">
        {Object.entries(TOOL_METADATA)
          .filter(([, tool]) => tool.name.toLowerCase().includes(search))
          .map(([key, tool]) => (
            <Card
              className="focus-within:ring-primary relative w-full gap-0 transition-opacity hover:opacity-75 md:max-w-77 dark:hover:opacity-90"
              key={key}
            >
              <CardHeader>
                <CardTitle>{tool.name}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <Link
                className="after:absolute after:inset-0"
                aria-label={`Open ${tool.name} tool`}
                to={`/${key as ToolKey}`}
              />
            </Card>
          ))}
      </section>
    </>
  );
}
