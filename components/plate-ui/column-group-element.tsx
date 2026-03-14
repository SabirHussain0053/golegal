'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const ColumnGroupElement = React.forwardRef<HTMLDivElement, any>(
  ({ children, className, element, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('my-2 flex gap-2', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ColumnGroupElement.displayName = 'ColumnGroupElement';
