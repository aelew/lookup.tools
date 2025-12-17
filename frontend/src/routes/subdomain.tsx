import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import {
  CheckCircle2Icon,
  CornerDownLeftIcon,
  EthernetPortIcon,
  XCircleIcon
} from 'lucide-react';
import type { FormEvent } from 'react';

import { ToolHero } from '@/components/tool/hero';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
              <EthernetPortIcon className="mr-0.5" />
            </InputGroupAddon>
            <InputGroupInput
              type="text"
              id="domain"
              name="domain"
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

function SubdomainScanResult() {
  const { domain } = Route.useSearch();

  if (!domain) {
    throw new Error('Domain is required');
  }

  return (
    <article className="grid gap-2 sm:gap-0">
      <header className="grid gap-2 pt-3">
        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
          <div className="flex flex-col items-center text-center leading-tight sm:flex-row sm:items-baseline sm:gap-2 sm:text-left">
            <Link to="/subdomain">
              <h1 className="text-lg/tight font-semibold tracking-tight whitespace-nowrap">
                Subdomain Finder
              </h1>
            </Link>
            <p className="text-muted-foreground max-w-[50dvw] truncate">
              {domain}
            </p>
          </div>

          <div className="w-full max-w-64">
            <DomainForm mode="existing" />
          </div>
        </div>
      </header>

      <Tabs value="subdomain" className="overflow-x-auto">
        <div className="overflow-x-auto">
          <TabsList className="my-2">
            <TabsTrigger value="dns">
              <CheckCircle2Icon className="text-green-500/50" />
              DNS Lookup
            </TabsTrigger>
            <TabsTrigger value="whois">
              <XCircleIcon className="text-red-500/50" />
              WHOIS Lookup
            </TabsTrigger>
            <TabsTrigger value="subdomain">
              <Spinner className="opacity-50" />
              Subdomain Finder
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="subdomain">
          <section className="flex flex-col-reverse gap-4 md:grid md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Scan Results</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subdomain</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>subdomain1.example.com</TableCell>
                      <TableCell>127.0.0.1</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="w-36 font-medium">
                          Subdomains found
                        </TableCell>
                        <TableCell className="tabular-nums">0</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="w-36 font-medium">
                          Most common IP
                        </TableCell>
                        <TableCell>
                          {/* {mostCommonIp ? (
                        <div className="flex items-center">
                          <Link
                            className="whitespace-nowrap tabular-nums hover:underline"
                            href={`/ip/${mostCommonIp}`}
                          >
                            {mostCommonIp}
                          </Link>
                          <CopyButton text={mostCommonIp} />
                        </div>
                      ) : (
                        'N/A'
                      )} */}
                          N/A
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>IP Addresses</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Occurrences</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>127.0.0.1</TableCell>
                        <TableCell>1</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </article>
  );
}
