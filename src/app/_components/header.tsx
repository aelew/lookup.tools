import Link from 'next/link';

import { Logo } from '@/components/logo';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b">
      <div className="flex items-center gap-8">
        <Link className="flex items-center gap-2" href="/">
          <Logo />
          <span className="font-semibold tracking-tight">Lookup Tools</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="https://github.com/aelew/lookup.tools"
          className="group relative shrink-0"
          target="_blank"
        >
          <img
            src="https://img.shields.io/github/stars/aelew/lookup.tools"
            alt="GitHub"
          />
          <span className="pointer-events-none absolute left-0 top-0 h-full w-full rounded-[2px] transition-colors group-hover:bg-foreground/5" />
        </Link>
        <ThemeSwitcher />
      </div>
    </header>
  );
}
