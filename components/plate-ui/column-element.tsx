'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const ColumnElement = React.forwardRef<HTMLDivElement, any>(
  ({ children, className, element, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex-1 rounded-md border border-dashed p-2', className)}
        style={{ width: element?.width ?? '50%' }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ColumnElement.displayName = 'ColumnElement';
