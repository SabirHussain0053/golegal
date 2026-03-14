'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const EquationElement = React.forwardRef<HTMLDivElement, any>(
  ({ children, className, element, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('my-2', className)} {...props}>
        <div
          contentEditable={false}
          className="rounded-md bg-muted p-4 text-center font-mono text-sm"
        >
          {element?.texExpression ?? 'Equation'}
        </div>
        {children}
      </div>
    );
  }
);
EquationElement.displayName = 'EquationElement';
