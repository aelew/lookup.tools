import { createFileRoute, Link } from '@tanstack/react-router';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';

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
import { TOOL_METADATA } from '@/lib/meta';
import type { ToolKey } from '@/lib/meta';

export const Route = createFileRoute('/')({
  component: RouteComponent
});

function RouteComponent() {
  const [search, setSearch] = useState('');

  return (
    <>
      <section className="grid gap-6 py-12 sm:py-24">
        {/* hero */}
        <hgroup className="grid gap-4 text-center">
          <h1 className="text-5xl font-semibold tracking-tighter md:text-6xl">
            Lookup Tools
          </h1>
          <p className="text-muted-foreground mx-auto max-w-lg text-sm sm:text-base">
            The cyber swiss army knife of lookup tools. Research information on
            domains, IP addresses, email addresses, and more.
          </p>
        </hgroup>

        {/* tool search */}
        <InputGroup className="mx-auto max-w-sm shadow-lg">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            autoFocus
            type="search"
            placeholder="Search tools..."
            onChange={(e) => setSearch(e.target.value.trim().toLowerCase())}
          />
        </InputGroup>
      </section>

      {/* tools */}
      <section className="flex flex-wrap justify-center gap-8 pb-12">
        {Object.entries(TOOL_METADATA)
          .filter(([, t]) => t.name.toLowerCase().includes(search))
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
