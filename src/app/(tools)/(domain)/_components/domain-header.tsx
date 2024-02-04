import { ExternalLinkIcon, SearchIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

interface DomainHeaderProps {
  domain: string;
  searchAgainForm: () => JSX.Element;
}

export function DomainHeader({
  domain,
  searchAgainForm: SearchAgainForm
}: DomainHeaderProps) {
  return (
    <div className="my-4 flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
      <div className="flex items-center gap-3 text-3xl font-semibold tracking-tight">
        <Image
          className="rounded-lg bg-white object-contain p-1 shadow ring-1 ring-muted-foreground/25"
          src={`https://icons.duckduckgo.com/ip3/${domain}.ico`}
          unoptimized
          height={36}
          width={36}
          alt=""
        />
        <h2>{domain}</h2>
        <Link href={`https://${domain}`} target="_blank">
          <ExternalLinkIcon className="mt-1 size-4 transition-colors hover:opacity-80" />
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <SearchIcon className="mr-2 h-4 w-4" />
              Search again
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="rounded-full p-0 shadow-none"
            sideOffset={8}
          >
            <SearchAgainForm />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
