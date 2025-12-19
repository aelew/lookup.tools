import type { PropsWithChildren } from 'react';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu';
import type { QueryType } from '@/lib/schema';
import { cn } from '@/lib/utils';

export type DataContextMenuType = QueryType | 'text';

interface DataContextMenuProps extends PropsWithChildren {
  type?: DataContextMenuType;
  className?: string;
  value: string;
}

export function DataContextMenu({
  type = 'text',
  className,
  value,
  children
}: DataContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger className={cn('whitespace-nowrap', className)}>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            navigator.clipboard.writeText(value);
          }}
        >
          <p className="max-w-80 truncate whitespace-nowrap">
            Copy <strong>{value}</strong>
          </p>
        </ContextMenuItem>
        {(type === 'domain' || type === 'ip') && (
          <ContextMenuItem
            onClick={() => {
              let url = value;

              if (!value.startsWith('http')) {
                if (type === 'domain') {
                  url = `https://${value}`;
                } else if (type === 'ip') {
                  url = value.includes('::')
                    ? `http://[${value}]`
                    : `http://${value}`;
                }
              }

              window.open(url, '_blank');
            }}
          >
            <p className="max-w-80 truncate whitespace-nowrap">
              Open <strong>{value}</strong>
            </p>
          </ContextMenuItem>
        )}
        {type !== 'text' && (
          <ContextMenuItem>
            <p className="max-w-80 truncate whitespace-nowrap">
              Lookup <strong>{value}</strong>
            </p>
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
