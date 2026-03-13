'use client';

import { TocPlugin } from '@platejs/toc/react';

export const tocPlugin = TocPlugin.configure({
  options: {
    // isScroll: true,
    topOffset: 80,
  },
});
