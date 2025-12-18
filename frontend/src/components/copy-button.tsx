'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, CopyIcon, XIcon } from 'lucide-react';
import { match } from 'ts-pattern';

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  className?: string;
  text: string;
}

export function CopyButton({ className, text }: CopyButtonProps) {
  const { status, copy } = useCopyToClipboard();

  const Icon = match(status)
    .with('copied', () => motion(CheckIcon))
    .with('error', () => motion(XIcon))
    .otherwise(() => motion(CopyIcon));

  return (
    <button type="button" onClick={() => copy(text)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <Icon
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            'ml-2 size-3.5',
            match(status)
              .with('copied', () => 'text-green-500')
              .with('error', () => 'text-red-500')
              .otherwise(() => 'text-muted-foreground'),
            className
          )}
        />
      </AnimatePresence>
    </button>
  );
}
