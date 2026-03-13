'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const CodeLeaf = React.forwardRef<HTMLElement, any>(
  ({ children, className, leaf, ...props }, ref) => {
    return (
      <code
        ref={ref}
        className={cn(
          'rounded-md bg-muted px-[0.3em] py-[0.2em] font-mono text-sm',
          className
        )}
        {...props}
      >
        {children}
      </code>
    );
  }
);
CodeLeaf.displayName = 'CodeLeaf';
