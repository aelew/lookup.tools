import type { PropsWithChildren } from 'react';

import { AnimatedSection } from '@/lib/framer';
import type { Tool } from '@/lib/resources/tools';

export function ToolLayout({
  icon: Icon,
  name,
  description,
  children
}: Tool & PropsWithChildren) {
  return (
    <>
      {/* eslint-disable-next-line react/no-children-prop */}
      <title children={`${name} | Lookup Tools`} />
      <AnimatedSection
        className="space-y-6 py-24 sm:py-48"
        initial={{ y: -96 }}
        animate={{ y: 0 }}
      >
        <div className="space-y-4">
          <div className="mx-auto flex max-w-5xl items-center justify-center gap-4">
            {Icon && <Icon className="size-12 sm:size-16" />}
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
    </>
  );
}
