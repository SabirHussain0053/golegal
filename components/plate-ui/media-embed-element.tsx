'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const MediaEmbedElement = React.forwardRef<HTMLDivElement, any>(
  ({ children, className, element, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('my-2', className)} {...props}>
        <div contentEditable={false}>
          <iframe
            src={element?.url}
            title={element?.title ?? 'Embedded media'}
            className="aspect-video w-full rounded-md border"
            allowFullScreen
          />
        </div>
        {children}
      </div>
    );
  }
);
MediaEmbedElement.displayName = 'MediaEmbedElement';
