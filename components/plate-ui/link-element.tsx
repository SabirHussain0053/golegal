'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const LinkElement = React.forwardRef<HTMLAnchorElement, any>(
  ({ children, className, element, ...props }, ref) => {
    return (
      <a
        ref={ref}
        href={element?.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'font-medium text-primary underline decoration-primary underline-offset-4',
          className
        )}
        {...props}
      >
        {children}
      </a>
    );
  }
);
LinkElement.displayName = 'LinkElement';
