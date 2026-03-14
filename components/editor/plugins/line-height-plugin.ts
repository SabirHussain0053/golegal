'use client';

import { ParagraphPlugin } from 'platejs/react';
import { KEYS } from 'platejs';
import { LineHeightPlugin } from '@platejs/basic-styles/react';

export const lineHeightPlugin = LineHeightPlugin.configure({
  inject: {
    nodeProps: {
      defaultNodeValue: 2,
      validNodeValues: [1, 1.2, 1.5, 2, 3],
    },
    targetPlugins: [
      ParagraphPlugin.key,
      KEYS.h1,
      KEYS.h2,
      KEYS.h3,
      KEYS.h4,
      KEYS.h5,
      KEYS.h6,
    ],
  },
});
