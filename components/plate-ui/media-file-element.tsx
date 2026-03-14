'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const MediaFileElement = React.forwardRef<HTMLDivElement, any>(
  ({ children, className, element, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('my-2', className)} {...props}>
        <div contentEditable={false}>
          <a
            href={element?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted"
          >
            📎 {element?.name ?? 'Download file'}
          </a>
        </div>
        {children}
      </div>
    );
  }
);
MediaFileElement.displayName = 'MediaFileElement';
