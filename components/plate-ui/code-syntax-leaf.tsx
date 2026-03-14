'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const CodeSyntaxLeaf = React.forwardRef<HTMLSpanElement, any>(
  ({ children, className, leaf, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(leaf?.tokenType && `prism-token token ${leaf.tokenType}`, className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);
CodeSyntaxLeaf.displayName = 'CodeSyntaxLeaf';
