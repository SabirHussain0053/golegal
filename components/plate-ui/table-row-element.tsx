'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const TableRowElement = React.forwardRef<HTMLTableRowElement, any>(
  ({ children, className, element, ...props }, ref) => {
    return (
      <tr ref={ref} className={cn('border-b', className)} {...props}>
        {children}
      </tr>
    );
  }
);
TableRowElement.displayName = 'TableRowElement';
