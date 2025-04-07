import Link from 'next/link';
import { Suspense } from 'react';

import { Logo } from '@/components/logo';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { GitHubButton } from './github-button';

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b">
      <Link
        className="flex items-center gap-2 transition-opacity hover:opacity-80"
        href="/"
      >
        <Logo className="size-5" />
        <span className="whitespace-nowrap text-lg font-semibold tracking-tight">
          Lookup Tools
        </span>
      </Link>
      <div className="flex items-center gap-2">
        <Suspense>
          <GitHubButton />
        </Suspense>
        <ThemeSwitcher />
      </div>
    </header>
  );
}
