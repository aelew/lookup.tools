import { HeartIcon } from 'lucide-react';

export function Footer() {
  return (
    <footer className="container-layout text-muted-foreground mt-6 flex h-14 items-center justify-between border-t text-sm">
      <p className="flex items-center gap-1">
        Made with{' '}
        <HeartIcon className="fill-muted-foreground/40 size-3.5 shrink-0" /> by{' '}
        <a
          className="decoration-muted-foreground/40 hover:text-muted-foreground/80 hover:decoration-muted-foreground/30 underline decoration-wavy underline-offset-[3px] transition-colors"
          href="https://aelew.com"
          target="_blank"
        >
          Andre Lew
        </a>
      </p>
      <div className="flex gap-6">
        <a
          className="hover:text-muted-foreground/80 transition-colors"
          href="https://iconkit.ai"
          target="_blank"
        >
          IconKit
        </a>
        <a
          className="hover:text-muted-foreground/80 transition-colors"
          href="https://devterms.com"
          target="_blank"
        >
          DevTerms
        </a>
      </div>
    </footer>
  );
}
