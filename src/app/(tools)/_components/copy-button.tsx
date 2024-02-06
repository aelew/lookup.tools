'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, CopyIcon, XIcon } from 'lucide-react';
import { match } from 'ts-pattern';

import { cn } from '@/lib/utils';
import { useCopyToClipboard } from '../_hooks/use-copy-to-clipboard';

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

  const iconColor = match(status)
    .with('copied', () => 'text-green-500')
    .with('error', () => 'text-red-500')
    .otherwise(() => 'text-muted-foreground');

  return (
    <button onClick={() => copy(text)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <Icon
          className={cn('ml-2 size-3.5', iconColor, className)}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
        />
      </AnimatePresence>
    </button>
  );
}
