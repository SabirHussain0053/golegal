'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const MentionElement = React.forwardRef<HTMLSpanElement, any>(
  ({ children, className, element, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-block rounded-md bg-muted px-1.5 py-0.5 align-baseline text-sm font-medium',
          className
        )}
        data-slate-value={element?.value}
        contentEditable={false}
        {...props}
      >
        @{element?.value ?? 'mention'}
        {children}
      </span>
    );
  }
);
MentionElement.displayName = 'MentionElement';
