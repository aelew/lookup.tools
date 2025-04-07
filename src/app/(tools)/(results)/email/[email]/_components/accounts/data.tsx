import { ExternalLinkIcon } from 'lucide-react';
import { unstable_cache } from 'next/cache';
import Image from 'next/image';
import Link from 'next/link';

import { Card } from '@/components/ui/card';
import { lookupAccounts } from '@/lib/api';
import { TOOL_REVALIDATION_INTERVAL } from '@/lib/config';
import type { EmailCardProps } from '@/types/tools/email';

const getCachedAccountsLookup = unstable_cache(
  async (email: string) => {
    if (email === 'react_devtools_backend_compact.js.map') {
      return { success: false } as const;
    }
    return lookupAccounts(email);
  },
  ['lookup_email_accounts'],
  { revalidate: TOOL_REVALIDATION_INTERVAL }
);

export async function RegisteredWebsites({ email }: EmailCardProps) {
  const result = await getCachedAccountsLookup(email);
  if (!result.success) {
    return (
      <span
        className="text-sm text-destructive"
        style={{ gridColumn: '1 / -1' }}
      >
        An unexpected error occurred while fetching registered account data.
      </span>
    );
  }
  if (!result.websites.length) {
    return (
      <span
        className="text-sm text-muted-foreground"
        style={{ gridColumn: '1 / -1' }}
      >
        No registered accounts were found with the requested email address.
      </span>
    );
  }
  return (
    <>
      {result.websites.map((website) => (
        <Link
          href={`https://${website.domain}`}
          rel="nofollow noopener noreferrer"
          key={website.domain}
          className="contents"
          target="_blank"
        >
          <Card className="relative flex items-center justify-between rounded-xl p-2 shadow-md transition-color-transform hover:bg-accent/75 active:scale-[0.98]">
            <div className="flex items-center gap-2">
              <div className="relative size-7 rounded-md bg-white shadow ring-1 ring-muted-foreground/25">
                <Image
                  className="aspect-square select-none rounded-lg object-contain p-1"
                  src={`https://api.favicon.victr.me/blob/https://${website.domain}`}
                  draggable={false}
                  fill={true}
                  unoptimized
                  alt=""
                />
              </div>
              <p>{website.domain}</p>
            </div>
            <ExternalLinkIcon className="mr-1.5 size-4" />
          </Card>
        </Link>
      ))}
    </>
  );
}
