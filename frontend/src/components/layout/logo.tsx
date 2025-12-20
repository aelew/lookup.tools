import type { SVGProps } from 'react';

import { cn } from '@/lib/utils';

export function Logo({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={cn('shrink-0', className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36 36"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        d="m13.503 19.693l2.828 2.828l-4.95 4.95l-2.828-2.829z"
        fill="#9AAAB4"
      />
      <path
        d="m1.257 29.11l5.88-5.879a2 2 0 0 1 2.828 0l2.828 2.828a2 2 0 0 1 0 2.828l-5.879 5.879a4 4 0 1 1-5.657-5.656"
        fill="#66757F"
      />
      <circle cx={22.355} cy={13.669} r={13.5} fill="#8899A6" />
      <circle cx={22.355} cy={13.669} r={9.5} fill="#BBDDF5" />
    </svg>
  );
}
