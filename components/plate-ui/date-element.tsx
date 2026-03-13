'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const DateElement = React.forwardRef<HTMLSpanElement, any>(
  ({ children, className, element, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-block rounded-md bg-muted px-1.5 py-0.5 text-sm',
          className
        )}
        contentEditable={false}
        {...props}
      >
        {element?.date ?? 'Select date'}
        {children}
      </span>
    );
  }
);
DateElement.displayName = 'DateElement';
