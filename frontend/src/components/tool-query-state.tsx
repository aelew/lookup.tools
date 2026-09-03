import type { UseQueryResult } from '@tanstack/react-query';
import { CircleAlertIcon, RefreshCwIcon } from 'lucide-react';
import type { PropsWithChildren } from 'react';

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ToolQueryStateProps extends PropsWithChildren {
  query: Pick<UseQueryResult, 'isPending' | 'isError' | 'refetch'>;
}

export function ToolQueryState({ children, query }: ToolQueryStateProps) {
  if (query.isPending) {
    return (
      <Card aria-busy="true" aria-label="Loading lookup results" role="status">
        <CardContent className="flex min-h-24 flex-col justify-center gap-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (query.isError) {
    return (
      <Alert className="mx-auto max-w-lg">
        <CircleAlertIcon />
        <AlertTitle>Couldn&apos;t load results</AlertTitle>
        <AlertDescription>Try again later.</AlertDescription>
        <AlertAction>
          <Button
            onClick={() => query.refetch()}
            size="xs"
            type="button"
            variant="ghost"
          >
            <RefreshCwIcon data-icon="inline-start" />
            Retry
          </Button>
        </AlertAction>
      </Alert>
    );
  }

  return children;
}
