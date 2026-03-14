'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const MediaPlaceholderElement = React.forwardRef<HTMLDivElement, any>(
  ({ children, className, element, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('my-2', className)} {...props}>
        <div
          contentEditable={false}
          className="flex items-center justify-center rounded-md border border-dashed p-8 text-sm text-muted-foreground"
        >
          Drop media here or click to upload
        </div>
        {children}
      </div>
    );
  }
);
MediaPlaceholderElement.displayName = 'MediaPlaceholderElement';
