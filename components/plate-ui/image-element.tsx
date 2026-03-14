'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const ImageElement = React.forwardRef<HTMLDivElement, any>(
  ({ children, className, element, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('my-2', className)} {...props}>
        <figure contentEditable={false}>
          <img
            src={element?.url}
            alt={element?.caption ?? ''}
            className="mx-auto max-w-full rounded-md"
          />
        </figure>
        {children}
      </div>
    );
  }
);
ImageElement.displayName = 'ImageElement';
