import type { LucideIcon } from 'lucide-react';
import type { ReactNode, SVGProps } from 'react';

import type { TOOLS } from './lib/resources/tools';

export type Icon = (props: SVGProps<SVGSVGElement>) => void;

export interface InfoTable {
  name: string;
  icon?: LucideIcon;
  keys: Record<string, () => ReactNode | JSX.Element | undefined>;
}

export type Events = {
  Lookup: { tool: (typeof TOOLS)[number]['slug'] };
};
