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
  CheckCircle2Icon,
  CornerDownLeftIcon,
  EthernetPortIcon,
  XCircleIcon
} from 'lucide-react';
import type { FormEvent } from 'react';

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
import {
  TOOL_METADATA,
  type ToolKey,
  type ToolMetadataEntries
} from '@/lib/meta';
import { getQueryOptions } from '@/lib/query';
import { domainSchema } from '@/lib/schema';

export const Route = createFileRoute('/_tool')({
  component: ToolLayoutRouteComponent,
  validateSearch: domainSchema.partial()
});

function ToolLayoutRouteComponent() {
  const { pathname } = useLocation();

  const tkey = pathname.split('/').pop() as ToolKey;
  const tool = TOOL_METADATA[tkey];

  if (!tool) {
    throw notFound();
  }

  const search = Route.useSearch();

  const toolsOfType = Object.entries(TOOL_METADATA).filter(
    ([_, t]) => t.type === tool.type
  ) as ToolMetadataEntries;

  const queries = useQueries({
    queries: toolsOfType.map(([k]) => getQueryOptions(k, search.q))
  });

  if (search.q) {
    return (
      <article className="grid gap-2 sm:gap-0">
        <header className="grid gap-2 pt-3">
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <div className="flex flex-col items-center text-center leading-tight sm:flex-row sm:items-baseline sm:gap-2 sm:text-left">
              {/* @ts-expect-error impl wip */}
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
              <DomainForm mode="existing" />
            </div>
          </div>
        </header>

        <Tabs value={tkey} className="overflow-x-auto">
          <div className="overflow-x-auto">
            <TabsList className="my-2">
              {toolsOfType.map(([key, t], i) => {
                const query = queries[i];

                let icon;
                switch (query.status) {
                  case 'error':
                    icon = <XCircleIcon className="text-red-500" />;
                    break;
                  case 'success':
                    icon = <CheckCircle2Icon className="text-green-500" />;
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
                      // @ts-expect-error impl wip
                      <Link to={`/${key}`} search={{ q: search.q }}>
                        {icon} {t.name}
                      </Link>
                    }
                  />
                );
              })}
            </TabsList>
          </div>

          <TabsContent value={tkey}>
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
        <p className="text-muted-foreground mx-auto max-w-md text-sm sm:text-base">
          {tool.description}
        </p>
      </hgroup>

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
  const { pathname } = useLocation();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const parseResult = domainSchema.safeParse({
      q: formData.get('q')
    });

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
      <FieldGroup>
        <Field>
          {mode === 'new' && <FieldLabel htmlFor="q">Domain</FieldLabel>}

          <InputGroup>
            <InputGroupAddon>
              <EthernetPortIcon className="mr-0.5" />
            </InputGroupAddon>

            <InputGroupInput
              type="text"
              id="q"
              name="q"
              placeholder="example.com"
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
