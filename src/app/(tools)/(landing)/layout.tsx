import type { PropsWithChildren } from 'react';

import { EASE_TRANSITION } from '@/lib/constants';
import { AnimatedSection } from '@/lib/framer';
import { ToolHero } from './_components/tool-hero';

export default function ToolLayout({ children }: PropsWithChildren) {
  return (
    <AnimatedSection
      {...EASE_TRANSITION}
      className="flex flex-col gap-6 py-24 sm:py-48"
    >
      <ToolHero />
      {children}
    </AnimatedSection>
  );
}
