'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const CodeBlockElement = React.forwardRef<HTMLPreElement, any>(
  ({ children, className, element, ...props }, ref) => {
    return (
      <pre
        ref={ref}
        className={cn(
          'my-2 rounded-md bg-muted p-4 font-mono text-sm',
          className
        )}
        {...props}
      >
        <code>{children}</code>
      </pre>
    );
  }
);
CodeBlockElement.displayName = 'CodeBlockElement';
