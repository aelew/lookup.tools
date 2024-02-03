'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CircleIcon, XIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  showDeleteButton?: boolean;
  deleteButtonClassName?: string;
  clearHandler?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      showDeleteButton = true,
      deleteButtonClassName,
      clearHandler,
      className,
      type,
      onChange,
      ...props
    },
    outerRef
  ) => {
    const [valueEmpty, setValueEmpty] = React.useState(true);
    const innerRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(outerRef, () => innerRef.current!, []);

    const baseElement = (
      <input
        type={type}
        ref={innerRef}
        onChange={(e) => {
          setValueEmpty(e.currentTarget.value === '');
          onChange?.(e);
        }}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    );

    if (showDeleteButton) {
      return (
        <div className="relative flex w-full items-center">
          {baseElement}
          <AnimatePresence mode="wait">
            {!valueEmpty && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                type="button"
                className={cn(
                  'relative right-4 flex items-center',
                  deleteButtonClassName
                )}
                onClick={() => {
                  if (innerRef.current) {
                    clearHandler?.();
                    innerRef.current.value = '';
                    innerRef.current.focus();
                    setValueEmpty(true);
                  }
                }}
              >
                <CircleIcon
                  className="absolute right-0 size-5 fill-muted-foreground/20 text-muted-foreground"
                  strokeWidth={0}
                />
                <XIcon className="absolute right-0 mr-[0.1875rem] size-3.5 text-muted-foreground/75" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return baseElement;
  }
);
Input.displayName = 'Input';

export { Input };
