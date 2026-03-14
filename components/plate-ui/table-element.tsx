'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const TableElement = React.forwardRef<HTMLTableElement, any>(
  ({ children, className, element, ...props }, ref) => {
    return (
      <div className="my-4 overflow-x-auto">
        <table
          ref={ref}
          className={cn('w-full border-collapse border', className)}
          {...props}
        >
          <tbody>{children}</tbody>
        </table>
      </div>
    );
  }
);
TableElement.displayName = 'TableElement';
