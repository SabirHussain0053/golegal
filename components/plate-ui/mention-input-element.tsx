'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const MentionInputElement = React.forwardRef<HTMLSpanElement, any>(
  ({ children, className, element, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn('inline-block', className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);
MentionInputElement.displayName = 'MentionInputElement';
