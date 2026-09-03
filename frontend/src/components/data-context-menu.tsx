import { Link } from '@tanstack/react-router';
import {
  CheckIcon,
  CircleAlertIcon,
  CopyIcon,
  EllipsisIcon,
  ExternalLinkIcon,
  SearchIcon
} from 'lucide-react';
import type { PropsWithChildren } from 'react';

import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { TOOL_METADATA, type ToolMetadataEntries } from '@/lib/meta';
import type { QueryType } from '@/lib/schema';
import { cn } from 'cn';

export type DataContextMenuType = QueryType | 'text';

interface DataContextMenuProps extends PropsWithChildren {
  type?: DataContextMenuType;
  className?: string;
  showActions?: boolean;
  value: string;
}

export function DataContextMenu({
  type = 'text',
  className,
  showActions = true,
  value,
  children
}: DataContextMenuProps) {
  const { copy, status } = useCopyToClipboard(1500);
  const firstToolOfType = (
    Object.entries(TOOL_METADATA) as ToolMetadataEntries
  ).find(([, tool]) => tool.queryType === type)?.[0];

  let openUrl: string | undefined;

  if (type === 'domain') {
    openUrl = value.startsWith('http') ? value : `https://${value}`;
  } else if (type === 'ip') {
    openUrl = value.startsWith('http')
      ? value
      : value.includes('::')
        ? `http://[${value}]`
        : `http://${value}`;
  }

  const statusMessage =
    status === 'copied'
      ? `Copied ${value}`
      : status === 'error'
        ? `Couldn't copy ${value}`
        : '';

  return (
    <div
      className={cn(
        'group/data relative inline-flex max-w-full min-w-0 items-center',
        showActions && 'pr-7',
        className
      )}
    >
      <ContextMenu>
        <ContextMenuTrigger className="min-w-0 whitespace-nowrap">
          {children}
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuItem onClick={() => copy(value)}>
              <CopyIcon />
              <span className="max-w-80 truncate whitespace-nowrap">
                Copy <strong>{value}</strong>
              </span>
            </ContextMenuItem>
            {openUrl && (
              <ContextMenuItem
                onClick={() => {
                  window.open(openUrl, '_blank', 'noopener,noreferrer');
                }}
              >
                <ExternalLinkIcon />
                <span className="max-w-80 truncate whitespace-nowrap">
                  Open <strong>{value}</strong>
                </span>
              </ContextMenuItem>
            )}
            {firstToolOfType && (
              <ContextMenuItem
                render={
                  <Link to={`/${firstToolOfType}`} search={{ q: value }} />
                }
              >
                <SearchIcon />
                <span className="max-w-80 truncate whitespace-nowrap">
                  Lookup <strong>{value}</strong>
                </span>
              </ContextMenuItem>
            )}
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>

      {showActions && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                aria-label={
                  status === 'idle' ? `Actions for ${value}` : statusMessage
                }
                className={cn(
                  'absolute top-1/2 right-0 shrink-0 -translate-y-1/2 opacity-60 transition-opacity motion-reduce:transition-none sm:opacity-0 sm:group-focus-within/data:opacity-100 sm:group-hover/data:opacity-100',
                  status === 'copied' && 'text-primary opacity-100',
                  status === 'error' && 'text-destructive opacity-100'
                )}
                size="icon-xs"
                type="button"
                variant="ghost"
              >
                {status === 'copied' ? (
                  <CheckIcon />
                ) : status === 'error' ? (
                  <CircleAlertIcon />
                ) : (
                  <EllipsisIcon />
                )}
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-auto max-w-80">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => copy(value)}>
                <CopyIcon />
                <span className="truncate">
                  Copy <strong>{value}</strong>
                </span>
              </DropdownMenuItem>
              {openUrl && (
                <DropdownMenuItem
                  onClick={() => {
                    window.open(openUrl, '_blank', 'noopener,noreferrer');
                  }}
                >
                  <ExternalLinkIcon />
                  <span className="truncate">
                    Open <strong>{value}</strong>
                  </span>
                </DropdownMenuItem>
              )}
              {firstToolOfType && (
                <DropdownMenuItem
                  render={
                    <Link to={`/${firstToolOfType}`} search={{ q: value }} />
                  }
                >
                  <SearchIcon />
                  <span className="truncate">
                    Lookup <strong>{value}</strong>
                  </span>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <span aria-live="polite" className="sr-only">
        {statusMessage}
      </span>
    </div>
  );
}
