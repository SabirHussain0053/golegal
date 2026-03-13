'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const EditorContainer = React.forwardRef<HTMLDivElement, any>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('relative', className)} {...props}>
        {children}
      </div>
    );
  }
);
EditorContainer.displayName = 'EditorContainer';

export const Editor = React.forwardRef<HTMLDivElement, any>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'min-h-[200px] w-full rounded-md border bg-background px-6 py-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Editor.displayName = 'Editor';
