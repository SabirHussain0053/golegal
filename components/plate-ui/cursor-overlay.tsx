'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const CursorOverlay = React.forwardRef<HTMLDivElement, any>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('pointer-events-none absolute inset-0 z-50', className)}
        {...props}
      />
    );
  }
);
CursorOverlay.displayName = 'CursorOverlay';
