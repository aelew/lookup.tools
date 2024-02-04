import type { SVGProps } from 'react';

export function MobilePhoneWithArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36 36"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        fill="#31373D"
        d="M18 36s-4 0-4-4V4s0-4 4-4h14s4 0 4 4v28s0 4-4 4z"
      />
      <path
        fill="#55ACEE"
        d="M16 5h18v26H16zm-3 11s1 1 1 2s-1 2-1 2l-5 5c-1 1-3 1-3-1v-3H2s-2 0-2-2v-2c0-2 2-2 2-2h3v-3c0-2 2-2 3-1z"
      />
    </svg>
  );
}
