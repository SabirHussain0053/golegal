'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const HrElement = React.forwardRef<HTMLDivElement, any>(
  ({ children, className, element, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('my-4', className)} {...props}>
        <hr contentEditable={false} className="border-t border-muted-foreground/30" />
        {children}
      </div>
    );
  }
);
HrElement.displayName = 'HrElement';
