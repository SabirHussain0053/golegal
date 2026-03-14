'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const GhostText = React.forwardRef<HTMLSpanElement, any>(
  ({ children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn('text-muted-foreground/50', className)}
        contentEditable={false}
        {...props}
      >
        {children}
      </span>
    );
  }
);
GhostText.displayName = 'GhostText';
