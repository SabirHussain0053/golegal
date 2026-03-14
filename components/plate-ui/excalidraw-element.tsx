'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const ExcalidrawElement = React.forwardRef<HTMLDivElement, any>(
  ({ children, className, element, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('my-2', className)} {...props}>
        <div
          contentEditable={false}
          className="flex h-64 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground"
        >
          Excalidraw canvas
        </div>
        {children}
      </div>
    );
  }
);
ExcalidrawElement.displayName = 'ExcalidrawElement';
