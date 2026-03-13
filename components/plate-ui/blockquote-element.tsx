'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const BlockquoteElement = React.forwardRef<HTMLQuoteElement, any>(
  ({ children, className, element, ...props }, ref) => {
    return (
      <blockquote
        ref={ref}
        className={cn('my-1 border-l-2 border-primary pl-6 italic', className)}
        {...props}
      >
        {children}
      </blockquote>
    );
  }
);
BlockquoteElement.displayName = 'BlockquoteElement';
