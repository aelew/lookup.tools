import Image from 'next/image';
import Link from 'next/link';

import { XCircleIcon } from '@/components/icons/x-circle';
import { Card } from '@/components/ui/card';
import { env } from '@/env';

interface DomainNotRegisteredProps {
  domain: string;
}

export function DomainNotRegistered({ domain }: DomainNotRegisteredProps) {
  return (
    <Card className="p-4">
      <div className="flex min-h-48 flex-col items-center gap-4 rounded-lg border-4 border-dotted border-muted-foreground/15 px-4 py-12 text-center">
        <XCircleIcon className="size-20" />
        <h1 className="text-4xl font-semibold tracking-tighter">
          Domain not found
        </h1>
        <div className="max-w-sm text-balance break-words">
          Looks like the domain <span className="font-medium">{domain}</span>{' '}
          hasn&apos;t been registered yet.
        </div>
        {env.NEXT_PUBLIC_IS_MAIN_INSTANCE === '1' && (
          <>
            <Link
              id="1825518"
              target="_blank"
              href={
                'https://spaceship.sjv.io/c/5212322/1825518/21274?u=' +
                encodeURIComponent(
                  `https://www.spaceship.com/domain-search/?query=${domain}&tab=domains`
                )
              }
            >
              <Image
                className="rounded-lg shadow-lg transition-opacity hover:opacity-90"
                src="https://a.impactradius-go.com/display-ad/21274-1825518"
                alt="Spaceship affiliate ad"
                height={201}
                width={384}
              />
            </Link>
            <Image
              src="https://imp.pxf.io/i/5212322/1825518/21274"
              className="invisible absolute"
              unoptimized
              height={0}
              width={0}
              alt=""
            />
          </>
        )}
      </div>
    </Card>
  );
}
