'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const ToggleElement = React.forwardRef<HTMLDivElement, any>(
  ({ children, className, element, ...props }, ref) => {
    const [open, setOpen] = React.useState(true);

    return (
      <div ref={ref} className={cn('my-1', className)} {...props}>
        <div contentEditable={false}>
          <button
            type="button"
            className="flex items-center gap-1 text-sm text-muted-foreground"
            onClick={() => setOpen(!open)}
          >
            <span className={cn('transition-transform', open && 'rotate-90')}>▶</span>
            Toggle
          </button>
        </div>
        {open && <div className="pl-6">{children}</div>}
      </div>
    );
  }
);
ToggleElement.displayName = 'ToggleElement';
