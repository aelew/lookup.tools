import { TOOL_METADATA } from '@/lib/meta';
import type { ToolKey } from '@/lib/meta';

interface ToolHeroProps {
  tkey: ToolKey;
}

export function ToolHero({ tkey }: ToolHeroProps) {
  const tool = TOOL_METADATA[tkey];

  return (
    <hgroup className="grid gap-4 text-center">
      <h1 className="text-5xl font-semibold tracking-tighter md:text-6xl">
        {tool.name}
      </h1>
      <p className="text-muted-foreground mx-auto max-w-md text-sm sm:text-base">
        {tool.description}
      </p>
    </hgroup>
  );
}
