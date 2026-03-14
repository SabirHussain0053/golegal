'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const FloatingToolbar = React.forwardRef<HTMLDivElement, any>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'absolute z-50 flex items-center gap-1 rounded-md border bg-background p-1 shadow-md',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
FloatingToolbar.displayName = 'FloatingToolbar';
