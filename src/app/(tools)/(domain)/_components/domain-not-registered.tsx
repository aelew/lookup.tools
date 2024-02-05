import { XCircleIcon } from '@/components/icons/x-circle';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DomainNotRegisteredProps {
  domain: string;
}

export function DomainNotRegistered({ domain }: DomainNotRegisteredProps) {
  return (
    <Card className="p-4">
      <div className="flex min-h-48 flex-col items-center gap-4 rounded-lg border-4 border-dotted border-muted-foreground/15 px-4 py-12 text-center">
        <XCircleIcon className="size-20" />
        <h1 className="text-4xl font-semibold tracking-tighter">
          Domain not found
        </h1>
        <div className="max-w-sm text-balance break-words">
          Looks like <span className="font-medium">{domain}</span> hasn&apos;t
          been registered yet. Click the button below to purchase it!
        </div>
        <Button disabled>Coming soon!</Button>
      </div>
    </Card>
  );
}
