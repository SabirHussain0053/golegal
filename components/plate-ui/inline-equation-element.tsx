'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const InlineEquationElement = React.forwardRef<HTMLSpanElement, any>(
  ({ children, className, element, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn('inline-block rounded bg-muted px-1 font-mono text-sm', className)}
        contentEditable={false}
        {...props}
      >
        {element?.texExpression ?? 'eq'}
        {children}
      </span>
    );
  }
);
InlineEquationElement.displayName = 'InlineEquationElement';
