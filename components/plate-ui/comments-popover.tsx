'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export function CommentsPopover({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'absolute z-50 w-80 rounded-md border bg-background p-4 shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
