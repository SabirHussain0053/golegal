'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export function ImagePreview({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/80',
        className
      )}
      {...props}
    />
  );
}
