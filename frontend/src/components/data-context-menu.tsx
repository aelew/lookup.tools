import { Link } from '@tanstack/react-router';
import { cn } from 'cn';
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
import {
  useDataActions,
  type DataAction,
  type DataActionType
} from '@/lib/data-actions';

interface DataContextMenuProps extends PropsWithChildren {
  type?: DataActionType;
  className?: string;
  showActions?: boolean;
  value: string;
}

const ACTION_ICONS = {
  copy: CopyIcon,
  lookup: SearchIcon,
  open: ExternalLinkIcon
} as const;

interface DataActionItemsProps {
  actions: Array<DataAction>;
  menu: 'context' | 'dropdown';
  perform: ReturnType<typeof useDataActions>['perform'];
}

function DataActionItems({ actions, menu, perform }: DataActionItemsProps) {
  return actions.map((action) => {
    const Icon = ACTION_ICONS[action.kind];
    const content = (
      <>
        <Icon />
        <span className="max-w-80 truncate whitespace-nowrap">
          {action.label} <strong>{action.value}</strong>
        </span>
      </>
    );
    const render =
      action.kind === 'lookup' ? (
        <Link to={`/${action.tool}`} search={{ q: action.query }} />
      ) : undefined;
    const onClick =
      action.kind === 'lookup' ? undefined : () => perform(action);

    return menu === 'context' ? (
      <ContextMenuItem key={action.kind} onClick={onClick} render={render}>
        {content}
      </ContextMenuItem>
    ) : (
      <DropdownMenuItem key={action.kind} onClick={onClick} render={render}>
        {content}
      </DropdownMenuItem>
    );
  });
}

export function DataContextMenu({
  type = 'text',
  className,
  showActions = true,
  value,
  children
}: DataContextMenuProps) {
  const { actions, perform, status, statusMessage } = useDataActions(
    type,
    value
  );

  return (
    <div
      className={cn(
        'group/data relative flex w-full max-w-full min-w-0 items-center',
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
            <DataActionItems
              actions={actions}
              menu="context"
              perform={perform}
            />
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
              <DataActionItems
                actions={actions}
                menu="dropdown"
                perform={perform}
              />
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
