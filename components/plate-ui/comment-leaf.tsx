'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const CommentLeaf = React.forwardRef<HTMLSpanElement, any>(
  ({ children, className, leaf, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'border-b-2 border-yellow-300 bg-yellow-100/50',
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);
CommentLeaf.displayName = 'CommentLeaf';
