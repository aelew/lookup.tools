import '@/styles/globals.css';

import { HeartIcon } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-6 flex h-14 items-center justify-between border-t text-sm text-muted-foreground">
      <p className="flex items-center gap-1">
        Made with <HeartIcon className="size-3.5 fill-muted-foreground/40" /> by{' '}
        <Link
          className="underline decoration-muted-foreground/40 decoration-wavy underline-offset-[3px] transition-colors hover:text-muted-foreground/80 hover:decoration-muted-foreground/30"
          href="https://aelew.com"
          target="_blank"
        >
          Andre Lew
        </Link>
      </p>
      <div className="flex gap-6">
        <Link
          className="transition-colors hover:text-muted-foreground/80"
          href="https://iconkit.ai"
          target="_blank"
        >
          IconKit
        </Link>
        <Link
          className="transition-colors hover:text-muted-foreground/80"
          href="https://devterms.io"
          target="_blank"
        >
          DevTerms
        </Link>
      </div>
    </footer>
  );
}
