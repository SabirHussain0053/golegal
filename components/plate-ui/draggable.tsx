'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const DraggableAboveNodes = React.forwardRef<HTMLDivElement, any>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('relative', className)} {...props}>
        <div
          contentEditable={false}
          className="absolute -left-6 top-0 flex h-full cursor-grab items-start pt-1 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
        >
          ⠿
        </div>
        {children}
      </div>
    );
  }
);
DraggableAboveNodes.displayName = 'DraggableAboveNodes';
