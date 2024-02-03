import type { PropsWithChildren, SVGProps } from 'react';

import { AnimatedSection } from '@/lib/framer';

interface ToolInformationProps extends PropsWithChildren {
  icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  name: string;
  description: string;
}

export function ToolLayout({
  icon: Icon,
  name,
  description,
  children
}: ToolInformationProps) {
  return (
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
        <h2 className="mx-auto max-w-2xl text-center font-medium tracking-tight text-muted-foreground">
          {description}
        </h2>
      </div>
      {children}
    </AnimatedSection>
  );
}
