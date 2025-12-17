import { Link } from '@tanstack/react-router';
import { Moon, Sun } from 'lucide-react';
import GitHubButton from 'react-github-btn';
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
    <header className="flex h-14 items-center justify-between border-b">
      <Link
        className="flex items-center gap-2 transition-opacity hover:opacity-80"
        to="/"
      >
        <Logo className="size-5" />
        <span className="text-lg font-medium tracking-tighter whitespace-nowrap">
          lookup<span className="opacity-80">.</span>tools
        </span>
      </Link>
      <div className="flex items-center gap-2">
        <div className="h-7">
          <GitHubButton
            href="https://github.com/aelew/lookup.tools"
            data-color-scheme="no-preference: light; light: light; dark: dark;"
            aria-label="Star Lookup Tools on GitHub"
            data-show-count="true"
            data-size="large"
          >
            <span className="sr-only">Star</span>
          </GitHubButton>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" className="shadow-xs" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
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
