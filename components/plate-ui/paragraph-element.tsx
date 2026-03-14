'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const ParagraphElement = React.forwardRef<HTMLParagraphElement, any>(
  ({ children, className, element, ...props }, ref) => {
    return (
      <p ref={ref} className={cn('m-0 px-0 py-1', className)} {...props}>
        {children}
      </p>
    );
  }
);
ParagraphElement.displayName = 'ParagraphElement';
