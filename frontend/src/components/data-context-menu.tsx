import type { PropsWithChildren } from 'react';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu';
import type { QueryType } from '@/lib/meta';

export type DataContextMenuType = QueryType | 'text';

interface DataContextMenuProps extends PropsWithChildren {
  type?: DataContextMenuType;
  value: string;
}

export function DataContextMenu({
  type = 'text',
  value,
  children
}: DataContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="whitespace-nowrap">
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
                url =
                  type === 'domain' ? `https://${value}` : `http://${value}`;
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
