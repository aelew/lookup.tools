import type { ReactNode, SVGProps } from 'react';

export type Icon = (props: SVGProps<SVGSVGElement>) => void;

export interface InfoTable {
  name: string;
  keys: Record<string, () => ReactNode | JSX.Element | undefined>;
}
