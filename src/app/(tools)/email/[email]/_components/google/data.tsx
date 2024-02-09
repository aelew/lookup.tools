import { unstable_cache } from 'next/cache';
import Link from 'next/link';

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { CACHE_REVALIDATE_SECONDS } from '@/lib/config';
import { formatDate } from '@/lib/format';
import { api } from '@/trpc/server';
import type { EmailCardProps } from '@/types/tools/email';

const getCachedGoogleLookup = unstable_cache(
  async (email: string) => {
    if (email === 'react_devtools_backend_compact.js.map') {
      return { success: false } as const;
    }
    return api.lookup.google.mutate({ email });
  },
  ['email_google_lookup'],
  { revalidate: CACHE_REVALIDATE_SECONDS }
);

export async function GoogleAccountTable({ email }: EmailCardProps) {
  const result = await getCachedGoogleLookup(email);
  if (!result.success) {
    return (
      <span className="text-sm text-destructive">
        An unexpected error occurred while fetching Google account data.
      </span>
    );
  }
  if (!result.google) {
    return (
      <span className="text-sm text-muted-foreground">
        No Google account found for this email address.
      </span>
    );
  }
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className="font-bold">Profile</TableCell>
        </TableRow>
        {result.google.profile.names.PROFILE && (
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>
              {result.google.profile.names.PROFILE.fullname}
            </TableCell>
          </TableRow>
        )}
        {result.google.profile.names.DOMAIN_PROFILE && (
          <TableRow>
            <TableCell>Domain Profile</TableCell>
            <TableCell>
              {result.google.profile.names.DOMAIN_PROFILE.fullname}
            </TableCell>
          </TableRow>
        )}
        <TableRow>
          <TableCell>GAIA ID</TableCell>
          <TableCell>{result.google.profile.personId}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Last updated</TableCell>
          <TableCell>
            {formatDate(
              result.google.profile.sourceIds.PROFILE.lastUpdated.replace(
                '(UTC)',
                'UTC'
              )
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-bold">Services</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Google Maps</TableCell>
          <TableCell>
            <Link
              href={`https://www.google.com/maps/contrib/${result.google.profile.personId}`}
              rel="nofollow noopener noreferrer"
              className="hover:underline"
              target="_blank"
            >
              {`https://www.google.com/maps/contrib/${result.google.profile.personId}`}
            </Link>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Google Calendar</TableCell>
          <TableCell>
            <Link
              href={`https://calendar.google.com/calendar/u/0/embed?src=${encodeURIComponent(email)}`}
              rel="nofollow noopener noreferrer"
              className="hover:underline"
              target="_blank"
            >
              {`https://calendar.google.com/calendar/u/0/embed?src=${encodeURIComponent(email)}`}
            </Link>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            Google Plus <span className="text-xs">(Archive)</span>
          </TableCell>
          <TableCell>
            <Link
              href={`https://web.archive.org/web/*/plus.google.com/${result.google.profile.personId}*`}
              rel="nofollow noopener noreferrer"
              className="hover:underline"
              target="_blank"
            >
              {`https://web.archive.org/web/*/plus.google.com/${result.google.profile.personId}*`}
            </Link>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-bold">Photos</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Avatar</TableCell>
          <TableCell>
            <Link
              href={result.google.profile.profilePhotos.PROFILE.url ?? '#'}
              rel="nofollow noopener noreferrer"
              className="hover:underline"
              target="_blank"
            >
              {result.google.profile.profilePhotos.PROFILE.url}
            </Link>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Cover</TableCell>
          <TableCell>
            <Link
              href={result.google.profile.coverPhotos.PROFILE.url ?? '#'}
              rel="nofollow noopener noreferrer"
              className="hover:underline"
              target="_blank"
            >
              {result.google.profile.coverPhotos.PROFILE.url}
            </Link>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
