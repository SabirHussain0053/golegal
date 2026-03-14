'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export function FloatingToolbarButtons({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center gap-1', className)}
      {...props}
    />
  );
}
