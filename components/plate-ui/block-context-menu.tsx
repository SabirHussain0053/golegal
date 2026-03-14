'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export function BlockContextMenu({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}
