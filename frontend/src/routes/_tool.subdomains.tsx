import { useQuery } from '@tanstack/react-query';
import { createFileRoute, notFound } from '@tanstack/react-router';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { getQueryOptions } from '@/lib/query';

interface ResolveSubdomainsResponse {
  q: string;
  data: Array<{
    fqdn: string;
    ip: string;
    attributes: {
      cloudflare: boolean;
    };
  }>;
}

export const Route = createFileRoute('/_tool/subdomains')({
  component: RouteComponent
});

function RouteComponent() {
  const { q } = Route.useSearch();
  if (!q) {
    throw notFound();
  }

  const query = useQuery(
    getQueryOptions<ResolveSubdomainsResponse>('subdomains', q)
  );

  const subdomains = query.data?.data;

  return (
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
              {subdomains?.map((subdomain) => (
                <TableRow key={subdomain.fqdn}>
                  <TableCell>{subdomain.fqdn}</TableCell>
                  <TableCell>{subdomain.ip}</TableCell>
                </TableRow>
              ))}
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
                  <TableCell className="tabular-nums">
                    {subdomains?.length ?? 0}
                  </TableCell>
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
  );
}
