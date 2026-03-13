'use client';

import React from 'react';
import { cn } from '@udecode/cn';

export const MediaAudioElement = React.forwardRef<HTMLDivElement, any>(
  ({ children, className, element, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('my-2', className)} {...props}>
        <div contentEditable={false}>
          <audio src={element?.url} controls className="w-full" />
        </div>
        {children}
      </div>
    );
  }
);
MediaAudioElement.displayName = 'MediaAudioElement';
