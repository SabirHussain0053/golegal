'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const CodeLineElement = React.forwardRef<HTMLDivElement, any>(
  ({ children, className, element, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('', className)} {...props}>
        {children}
      </div>
    );
  }
);
CodeLineElement.displayName = 'CodeLineElement';
