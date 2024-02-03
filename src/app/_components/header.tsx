import { SiGithub } from '@icons-pack/react-simple-icons';
import Link from 'next/link';

import { Logo } from '@/components/logo';
import { buttonVariants } from '@/components/ui/button';

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
          className={buttonVariants({ variant: 'ghost', size: 'icon' })}
          href="https://github.com/aelew/lookup.tools"
        >
          <SiGithub className="size-5" />
        </Link>
        <Link className={buttonVariants()} href="/auth/login">
          Sign up
        </Link>
      </div>
    </header>
  );
}
