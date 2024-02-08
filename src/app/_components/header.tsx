import Link from 'next/link';
import { Suspense } from 'react';

import { Logo } from '@/components/logo';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { GitHubButton } from './github-button';

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b">
      <div className="flex items-center gap-8">
        <Link className="flex items-center gap-2" href="/">
          <Logo />
          <span className="whitespace-nowrap font-semibold tracking-tight">
            Lookup Tools
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Suspense>
          <GitHubButton />
        </Suspense>
        <ThemeSwitcher />
      </div>
    </header>
  );
}
