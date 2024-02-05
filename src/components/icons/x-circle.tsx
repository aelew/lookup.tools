import type { SVGProps } from 'react';

export function XCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="3 3 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          y1="986.67"
          y2="-2.623"
          x2="0"
        >
          <stop stopColor="#FFCE3B" />
          <stop stopColor="#FFD762" offset="1" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          y1="986.67"
          y2="-2.623"
          x2="0"
        >
          <stop stopColor="#FFCE3B" />
          <stop stopColor="#FEF4AB" offset="1" />
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" x2="1" x1="0" />
      </defs>
      <g transform="matrix(2 0 0 2-11-2071.72)">
        <path
          fill="#DA4453"
          transform="translate(7 1037.36)"
          d="m4 0c-2.216 0-4 1.784-4 4 0 2.216 1.784 4 4 4 2.216 0 4-1.784 4-4 0-2.216-1.784-4-4-4"
        />
        <path
          fill="#FFF"
          d="m11.906 1041.46l.99-.99c.063-.062.094-.139.094-.229 0-.09-.031-.166-.094-.229l-.458-.458c-.063-.062-.139-.094-.229-.094-.09 0-.166.031-.229.094l-.99.99-.99-.99c-.063-.062-.139-.094-.229-.094-.09 0-.166.031-.229.094l-.458.458c-.063.063-.094.139-.094.229 0 .09.031.166.094.229l.99.99-.99.99c-.063.062-.094.139-.094.229 0 .09.031.166.094.229l.458.458c.063.063.139.094.229.094.09 0 .166-.031.229-.094l.99-.99.99.99c.063.063.139.094.229.094.09 0 .166-.031.229-.094l.458-.458c.063-.062.094-.139.094-.229 0-.09-.031-.166-.094-.229l-.99-.99"
        />
      </g>
    </svg>
  );
}
