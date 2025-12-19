import { useQueries } from '@tanstack/react-query';
import {
  createFileRoute,
  Link,
  notFound,
  Outlet,
  useLocation,
  useNavigate
} from '@tanstack/react-router';
import {
  CircleIcon,
  CornerDownLeftIcon,
  EthernetPortIcon,
  MailIcon,
  MapPinIcon
} from 'lucide-react';
import type { FormEvent } from 'react';
import { match } from 'ts-pattern';
import z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useMediaQuery from '@/hooks/use-media-query';
import { useVisitorIPQuery } from '@/hooks/use-visitor-ip-query';
import {
  TOOL_METADATA,
  type ToolKey,
  type ToolMetadataEntries
} from '@/lib/meta';
import { getQueryOptions } from '@/lib/query';
import { QUERY_SCHEMAS, type QueryType } from '@/lib/schema';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/_tool')({
  component: ToolLayoutRouteComponent,
  validateSearch: z
    .object({ q: z.union(Object.values(QUERY_SCHEMAS)) })
    .partial()
});

function ToolLayoutRouteComponent() {
  const { pathname } = useLocation();

  const tkey = pathname.split('/').pop() as ToolKey;
  const tool = TOOL_METADATA[tkey];

  if (!tool) {
    throw notFound();
  }

  const search = Route.useSearch();

  const toolsOfQueryType = Object.entries(TOOL_METADATA).filter(
    ([_, t]) =>
      t.queryType === tool.queryType && //
      !t.disableUniversalLookup
  ) as ToolMetadataEntries;

  const queries = useQueries({
    queries: toolsOfQueryType.map(([k]) => getQueryOptions(k, search.q))
  });

  if (search.q) {
    return (
      <article className="grid gap-2 sm:gap-0">
        <header className="grid gap-2 pt-3">
          <div className="flex flex-col items-center justify-between gap-2.5 sm:flex-row">
            <div className="flex flex-col items-center text-center leading-tight sm:flex-row sm:items-baseline sm:gap-2 sm:text-left">
              <Link to={`/${tkey}`}>
                <h1 className="text-lg/tight font-semibold tracking-tight whitespace-nowrap">
                  {tool.name}
                </h1>
              </Link>
              <p className="text-muted-foreground max-w-[50dvw] truncate">
                {search.q}
              </p>
            </div>

            <div className="w-full max-w-64">
              <ToolForm variant="compact" queryType={tool.queryType} />
            </div>
          </div>
        </header>

        <Tabs value={tkey} className="overflow-x-auto">
          {toolsOfQueryType.length > 1 && (
            <div className="overflow-x-auto py-2">
              <TabsList>
                {toolsOfQueryType.map(([key, t], i) => {
                  const query = queries[i];

                  let icon;
                  switch (query.status) {
                    case 'error':
                      icon = (
                        <div className="flex size-4 items-center justify-center">
                          <CircleIcon className="size-2 fill-red-500 text-red-600" />
                        </div>
                      );
                      break;
                    case 'success':
                      icon = (
                        <div className="flex size-4 items-center justify-center">
                          <CircleIcon className="size-2 fill-green-500 text-green-600" />
                        </div>
                      );
                      break;
                    default:
                      icon = <Spinner className="opacity-50" />;
                      break;
                  }

                  return (
                    <TabsTrigger
                      key={key}
                      value={key}
                      nativeButton={false}
                      render={
                        <Link to={`/${key}`} search={{ q: search.q }}>
                          {icon} {t.name}
                        </Link>
                      }
                    />
                  );
                })}
              </TabsList>
            </div>
          )}

          <TabsContent
            value={tkey}
            className={cn(
              'm-px grid gap-4 pb-4',
              toolsOfQueryType.length <= 1 && 'mt-3'
            )}
          >
            <Outlet />
          </TabsContent>
        </Tabs>
      </article>
    );
  }

  return (
    <section className="grid gap-6 py-24 sm:py-48">
      <hgroup className="grid gap-4 text-center">
        <h1 className="text-5xl font-semibold tracking-tighter md:text-6xl">
          {tool.name}
        </h1>
        <p className="text-muted-foreground mx-auto max-w-md text-base">
          {tool.description}
        </p>
      </hgroup>

      <Card className="mx-auto w-full max-w-sm">
        <CardContent>
          <ToolForm queryType={tool.queryType} />
        </CardContent>
      </Card>

      {tool.queryType === 'ip' && <UseMyIPAddressButton />}
    </section>
  );
}

interface ToolFormProps {
  queryType: QueryType;
  variant?: 'default' | 'compact';
}

function ToolForm({ queryType, variant = 'default' }: ToolFormProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isDesktop } = useMediaQuery();

  const shouldAutoFocus = variant === 'default' && isDesktop;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const parseResult = z
      .object({ q: QUERY_SCHEMAS[queryType] })
      .safeParse({ q: formData.get('q') });

    if (!parseResult.success) {
      alert(parseResult.error.issues[0].message);
      return;
    }

    navigate({
      to: pathname,
      search: parseResult.data
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      {match(queryType)
        .with('domain', () => (
          <FieldGroup>
            <Field>
              {variant === 'default' && (
                <FieldLabel htmlFor="domain">Domain</FieldLabel>
              )}

              <InputGroup className="shadow-lg/5">
                <InputGroupAddon>
                  <EthernetPortIcon className="mr-0.5" />
                </InputGroupAddon>

                <InputGroupInput
                  autoFocus={shouldAutoFocus}
                  placeholder="example.com"
                  type="text"
                  id="domain"
                  name="q"
                />

                <InputGroupButton type="submit">
                  <CornerDownLeftIcon />
                </InputGroupButton>
              </InputGroup>
            </Field>
          </FieldGroup>
        ))
        .with('ip', () => (
          <FieldGroup>
            <Field>
              {variant === 'default' && (
                <FieldLabel htmlFor="ip">IP Address</FieldLabel>
              )}

              <InputGroup className="shadow-lg/5">
                <InputGroupAddon>
                  <MapPinIcon className="mr-0.5" />
                </InputGroupAddon>

                <InputGroupInput
                  autoFocus={shouldAutoFocus}
                  placeholder="1.1.1.1"
                  type="text"
                  id="ip"
                  name="q"
                />

                <InputGroupButton type="submit">
                  <CornerDownLeftIcon />
                </InputGroupButton>
              </InputGroup>
            </Field>
          </FieldGroup>
        ))
        .with('email', () => (
          <FieldGroup>
            <Field>
              {variant === 'default' && (
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
              )}

              <InputGroup className="shadow-lg/5">
                <InputGroupAddon>
                  <MailIcon className="mr-0.5" />
                </InputGroupAddon>

                <InputGroupInput
                  autoFocus={shouldAutoFocus}
                  placeholder="me@example.com"
                  data-form-type="other"
                  data-1p-ignore="true"
                  data-bwignore="true"
                  data-lpignore="true"
                  autoComplete="off"
                  type="email"
                  id="email"
                  name="q"
                />

                <InputGroupButton type="submit">
                  <CornerDownLeftIcon />
                </InputGroupButton>
              </InputGroup>
            </Field>
          </FieldGroup>
        ))
        .exhaustive()}
    </form>
  );
}

function UseMyIPAddressButton() {
  const { data } = useVisitorIPQuery();
  const ip = data?.ip;

  return (
    <Button
      render={<Link to="/ip" search={{ q: ip }} />}
      className="mx-auto w-fit"
      variant="secondary"
      disabled={!ip}
    >
      Use my IP address
    </Button>
  );
}
