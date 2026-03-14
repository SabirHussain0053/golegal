'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const KbdLeaf = React.forwardRef<HTMLElement, any>(
  ({ children, className, leaf, ...props }, ref) => {
    return (
      <kbd
        ref={ref}
        className={cn(
          'rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs shadow-sm',
          className
        )}
        {...props}
      >
        {children}
      </kbd>
    );
  }
);
KbdLeaf.displayName = 'KbdLeaf';
