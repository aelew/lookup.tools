import { cn } from 'cn';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'bg-muted animate-pulse rounded-none motion-reduce:animate-none',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
