'use client';

import { usePathname } from 'next/navigation';

import { TOOLS } from '@/lib/resources/tools';

export function ToolHero() {
  const pathname = usePathname();
  const tool = TOOLS.find((t) => t.slug === pathname.slice(1));
  if (!tool) {
    throw new Error(`Tool with pathname \`${pathname}\` does not exist`);
  }
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {tool.icon && <tool.icon className="size-12 shrink-0 sm:size-16" />}
      <h1 className="text-5xl font-semibold tracking-tighter md:text-6xl">
        {tool.name}
      </h1>
      <h2 className="mx-auto text-center text-sm tracking-tight text-muted-foreground sm:text-base">
        {tool.description}
      </h2>
    </div>
  );
}
