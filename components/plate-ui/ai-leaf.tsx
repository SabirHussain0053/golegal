'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const AILeaf = React.forwardRef<HTMLSpanElement, any>(
  ({ children, className, leaf, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'rounded bg-purple-100/50 px-0.5 text-purple-900',
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);
AILeaf.displayName = 'AILeaf';
