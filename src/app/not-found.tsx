import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';

export default function NotFound() {
  return (
    <section className="flex flex-col justify-center space-y-4 py-12 sm:py-24">
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-4">
        <h1 className="text-4xl font-semibold tracking-tighter md:text-5xl">
          404 Not Found
        </h1>
      </div>
      <h2 className="mx-auto max-w-sm text-center font-medium tracking-tight text-muted-foreground">
        Uh oh! We couldn&apos;t find the resource you were looking for. Please
        check your URL and try again.
      </h2>
      <Link className={buttonVariants({ className: 'mx-auto w-fit' })} href="/">
        <ArrowLeftIcon className="mr-2 size-4" /> Return home
      </Link>
    </section>
  );
}
