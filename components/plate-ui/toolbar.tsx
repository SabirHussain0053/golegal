'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const Toolbar = React.forwardRef<HTMLDivElement, any>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="toolbar"
        className={cn('flex items-center gap-1', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Toolbar.displayName = 'Toolbar';

export const ToolbarGroup = React.forwardRef<HTMLDivElement, any>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-1', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ToolbarGroup.displayName = 'ToolbarGroup';

export const ToolbarButton = React.forwardRef<HTMLButtonElement, any>(
  ({ children, className, active, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted',
          active && 'bg-muted',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
ToolbarButton.displayName = 'ToolbarButton';

export const ToolbarSeparator = React.forwardRef<HTMLDivElement, any>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mx-1 h-6 w-px bg-border', className)}
        {...props}
      />
    );
  }
);
ToolbarSeparator.displayName = 'ToolbarSeparator';
