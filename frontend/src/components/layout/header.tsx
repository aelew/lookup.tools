import { SiGithub } from '@icons-pack/react-simple-icons';
import { Link } from '@tanstack/react-router';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'tanstack-theme-kit';

import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Logo } from './logo';

export function Header() {
  const { setTheme } = useTheme();

  return (
    <header className="container-layout flex h-14 items-center justify-between border-b">
      <Link
        className="flex items-center gap-2 transition-opacity hover:opacity-80"
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
        <Button
          className="shadow-xs"
          nativeButton={false}
          variant="outline"
          render={
            <a href="https://github.com/aelew/lookup.tools" target="_blank" />
          }
        >
          <SiGithub /> Star
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                className="shadow-xs"
                variant="outline"
                type="button"
                size="icon"
              >
                <Sun className="size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
