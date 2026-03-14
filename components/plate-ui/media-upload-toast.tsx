'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export function MediaUploadToast({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 rounded-md border bg-background p-4 shadow-lg',
        className
      )}
      {...props}
    />
  );
}
