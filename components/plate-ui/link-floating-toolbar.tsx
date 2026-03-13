'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const LinkFloatingToolbar = React.forwardRef<HTMLDivElement, any>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 rounded-md border bg-background p-2 shadow-md',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
LinkFloatingToolbar.displayName = 'LinkFloatingToolbar';
