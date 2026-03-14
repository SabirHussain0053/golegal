'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const FixedToolbar = React.forwardRef<HTMLDivElement, any>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'sticky top-0 z-50 flex w-full items-center gap-1 overflow-x-auto border-b bg-background p-1',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
FixedToolbar.displayName = 'FixedToolbar';
