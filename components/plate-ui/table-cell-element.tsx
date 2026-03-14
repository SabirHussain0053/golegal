'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const TableCellElement = React.forwardRef<HTMLTableCellElement, any>(
  ({ children, className, element, ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={cn('border p-2 align-top', className)}
        {...props}
      >
        {children}
      </td>
    );
  }
);
TableCellElement.displayName = 'TableCellElement';

export const TableCellHeaderElement = React.forwardRef<HTMLTableCellElement, any>(
  ({ children, className, element, ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={cn('border bg-muted p-2 text-left font-bold align-top', className)}
        {...props}
      >
        {children}
      </th>
    );
  }
);
TableCellHeaderElement.displayName = 'TableCellHeaderElement';
