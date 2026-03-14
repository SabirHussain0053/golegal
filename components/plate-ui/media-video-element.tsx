'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const MediaVideoElement = React.forwardRef<HTMLDivElement, any>(
  ({ children, className, element, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('my-2', className)} {...props}>
        <div contentEditable={false}>
          <video
            src={element?.url}
            controls
            className="mx-auto max-w-full rounded-md"
          />
        </div>
        {children}
      </div>
    );
  }
);
MediaVideoElement.displayName = 'MediaVideoElement';
