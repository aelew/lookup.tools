import type { PropsWithChildren } from 'react';

import { EASE_TRANSITION } from '@/lib/constants';
import { AnimatedSection } from '@/lib/framer';
import type { Tool } from '@/lib/resources/tools';

export function ToolLayout({
  icon: Icon,
  name,
  description,
  children
}: Tool & PropsWithChildren) {
  return (
    <AnimatedSection
      {...EASE_TRANSITION}
      className="flex flex-col space-y-6 py-24 sm:py-48"
    >
      <div className="space-y-4">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-4 text-center sm:flex-row">
          {Icon && <Icon className="size-12 shrink-0 sm:size-16" />}
          <h1 className="text-5xl font-semibold tracking-tighter md:text-6xl">
            {name}
          </h1>
        </div>
        <h2 className="mx-auto max-w-2xl text-center text-sm font-medium tracking-tight text-muted-foreground sm:text-base">
          {description}
        </h2>
      </div>
      {children}
    </AnimatedSection>
  );
}
