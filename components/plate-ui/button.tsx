'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: string;
    size?: string;
  }
>(({ children, className, variant, size, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
        variant === 'destructive' &&
          'bg-destructive text-destructive-foreground',
        variant === 'outline' &&
          'border border-input bg-background hover:bg-accent',
        variant === 'secondary' && 'bg-secondary text-secondary-foreground',
        variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
        variant === 'link' &&
          'text-primary underline-offset-4 hover:underline',
        !variant && 'bg-primary text-primary-foreground hover:bg-primary/90',
        size === 'sm' && 'h-9 px-3',
        size === 'lg' && 'h-11 px-8',
        size === 'icon' && 'h-10 w-10',
        !size && 'h-10 px-4 py-2',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});
Button.displayName = 'Button';
