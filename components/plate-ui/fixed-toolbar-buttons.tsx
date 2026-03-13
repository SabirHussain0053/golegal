'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export function FixedToolbarButtons({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-wrap items-center gap-1', className)}
      {...props}
    />
  );
}
