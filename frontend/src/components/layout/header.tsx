import { SiGithub } from '@icons-pack/react-simple-icons';
import { Link } from '@tanstack/react-router';
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'tanstack-theme-kit';

import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Logo } from './logo';

export function Header() {
  const { setTheme } = useTheme();

  return (
    <header className="container-layout flex h-14 items-center justify-between border-b">
      <Link
        className="flex items-center gap-2 transition-opacity hover:opacity-80 motion-reduce:transition-none"
        to="/"
      >
        <Logo className="size-5" />
        <span className="text-lg font-medium tracking-tighter whitespace-nowrap lowercase">
          Lookup
          <span className="-mr-1 before:opacity-60 before:content-['.']">
            {' '}
          </span>
          Tools
        </span>
      </Link>
      <div className="flex items-center gap-2">
        <a
          className={cn(buttonVariants({ variant: 'outline' }), 'shadow-xs')}
          href="https://github.com/aelew/lookup.tools"
          rel="noopener noreferrer"
          target="_blank"
        >
          <SiGithub data-icon="inline-start" /> Star
        </a>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                className="shadow-xs"
                variant="outline"
                type="button"
                size="icon"
              >
                <SunIcon className="scale-100 rotate-0 transition-all motion-reduce:transition-none dark:scale-0 dark:-rotate-90" />
                <MoonIcon className="absolute scale-0 rotate-90 transition-all motion-reduce:transition-none dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <SunIcon />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <MoonIcon />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <MonitorIcon />
                System
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
