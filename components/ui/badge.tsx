'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: string }
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      variant === 'secondary' &&
        'border-transparent bg-secondary text-secondary-foreground',
      variant === 'destructive' &&
        'border-transparent bg-destructive text-destructive-foreground',
      variant === 'outline' && 'text-foreground',
      !variant && 'border-transparent bg-primary text-primary-foreground',
      className
    )}
    {...props}
  />
));
Badge.displayName = 'Badge';
