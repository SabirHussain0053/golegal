'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const HighlightLeaf = React.forwardRef<HTMLElement, any>(
  ({ children, className, leaf, ...props }, ref) => {
    return (
      <mark
        ref={ref}
        className={cn('bg-yellow-200/70 px-0', className)}
        {...props}
      >
        {children}
      </mark>
    );
  }
);
HighlightLeaf.displayName = 'HighlightLeaf';
