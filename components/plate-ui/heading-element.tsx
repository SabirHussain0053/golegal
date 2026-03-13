'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const HeadingElement = React.forwardRef<HTMLHeadingElement, any>(
  ({ children, className, element, ...props }, ref) => {
    const level: number = element?.level ?? 1;
    const Tag = (`h${Math.min(Math.max(level, 1), 6)}`) as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

    return (
      <Tag
        ref={ref}
        className={cn(
          level === 1 && 'mb-1 mt-2 text-4xl font-bold',
          level === 2 && 'mb-1 mt-2 text-3xl font-semibold',
          level === 3 && 'mb-1 mt-2 text-2xl font-semibold',
          level === 4 && 'mb-1 mt-1 text-xl font-semibold',
          level === 5 && 'mb-1 mt-1 text-lg font-semibold',
          level === 6 && 'mb-1 mt-1 text-base font-semibold',
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);
HeadingElement.displayName = 'HeadingElement';
