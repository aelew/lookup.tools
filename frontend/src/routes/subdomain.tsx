import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { CornerDownLeftIcon, EthernetPortIcon } from 'lucide-react';
import { useId } from 'react';
import type { FormEvent } from 'react';

import { ToolHero } from '@/components/tool/hero';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '@/components/ui/input-group';
import { domainSchema } from '@/lib/schema';

export const Route = createFileRoute('/subdomain')({
  component: RouteComponent,
  validateSearch: domainSchema.partial()
});

function RouteComponent() {
  const search = Route.useSearch();

  if (search.domain) {
    return <SubdomainScanResult />;
  }

  return (
    <section className="grid gap-6 py-24 sm:py-48">
      <ToolHero tkey="subdomain" />

      <Card className="mx-auto w-full max-w-sm">
        <CardContent>
          <DomainForm mode="new" />
        </CardContent>
      </Card>
    </section>
  );
}

function DomainForm({ mode }: { mode: 'new' | 'existing' }) {
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const domain = formData.get('domain');

    const parseResult = domainSchema.safeParse({ domain });

    if (!parseResult.success) {
      alert(parseResult.error.issues[0].message);
      return;
    }

    navigate({ to: '/subdomain', search: parseResult.data });
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          {mode === 'new' && <FieldLabel htmlFor="domain">Domain</FieldLabel>}
          <InputGroup>
            <InputGroupAddon>
              <EthernetPortIcon />
            </InputGroupAddon>
            <InputGroupInput
              type="text"
              id="domain"
              name="domain"
              placeholder="lookup.tools"
              autoFocus={mode === 'new'}
            />
            <InputGroupButton type="submit">
              <CornerDownLeftIcon />
            </InputGroupButton>
          </InputGroup>
        </Field>
      </FieldGroup>
    </form>
  );
}

function SubdomainScanResult() {
  const { domain } = Route.useSearch();

  if (!domain) {
    throw new Error('Domain is required');
  }

  return (
    <article>
      <header className="flex flex-col items-center justify-between gap-2 border-b py-3 sm:flex-row">
        <h1 className="text-lg font-semibold tracking-tight">
          <Link to="/subdomain">Subdomain Finder</Link>{' '}
          <span className="ml-1 font-normal opacity-60">{domain}</span>
        </h1>
        <div className="w-full max-w-64">
          <DomainForm mode="existing" />
        </div>
      </header>
    </article>
  );
}
