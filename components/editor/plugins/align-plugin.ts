'use client';

import { ParagraphPlugin } from 'platejs/react';
import { TextAlignPlugin } from '@platejs/basic-styles/react';
import { KEYS } from 'platejs';
import { ImagePlugin, MediaEmbedPlugin } from '@platejs/media/react';

export const alignPlugin = TextAlignPlugin.extend({
  inject: {
    targetPlugins: [
      ParagraphPlugin.key,
      KEYS.h1,
      KEYS.h2,
      KEYS.h3,
      KEYS.h4,
      KEYS.h5,
      KEYS.h6,
      MediaEmbedPlugin.key,
      ImagePlugin.key,
    ],
  },
});
