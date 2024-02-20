import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export async function LoadingRegisteredWebsites() {
  return (
    <>
      {[...new Array(6)].map((_, i) => (
        <Card
          className="relative flex items-center rounded-xl p-2 shadow-md transition-color-transform hover:bg-accent/75 active:scale-[0.98]"
          key={i}
        >
          <div className="flex items-center gap-2">
            <div className="relative size-7 rounded-md shadow">
              <Skeleton className="size-full rounded-md" />
            </div>
            <Skeleton className="h-5 w-48" />
          </div>
        </Card>
      ))}
    </>
  );
}
