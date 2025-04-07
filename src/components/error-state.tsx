import type { PropsWithChildren, ReactNode } from 'react';

import { XCircleIcon } from './icons/x-circle';
import { Card } from './ui/card';

interface ErrorStateProps extends PropsWithChildren {
  title?: string;
  description: ReactNode;
}

export function ErrorState({
  title = 'An unexpected error occurred.',
  description,
  children
}: ErrorStateProps) {
  return (
    <Card className="p-4">
      <div className="flex min-h-48 flex-col items-center gap-4 rounded-lg border-4 border-dotted border-muted-foreground/15 px-4 py-12 text-center">
        <XCircleIcon className="size-20" />
        <h1 className="max-w-xs text-4xl font-semibold tracking-tighter">
          {title}
        </h1>
        <div className="max-w-sm text-balance">{description}</div>
        {children}
      </div>
    </Card>
  );
}
