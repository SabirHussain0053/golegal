'use client';

import { BasicMarksPlugin, BlockquotePlugin } from '@platejs/basic-nodes/react';
import { CodeBlockPlugin } from '@platejs/code-block/react';
import { HeadingPlugin } from '@platejs/basic-nodes/react';
import Prism from 'prismjs';

export const basicNodesPlugins = [
  HeadingPlugin.configure({ options: { levels: 6 } }),
  BlockquotePlugin,
  CodeBlockPlugin.configure({ options: { prism: Prism } }),
  BasicMarksPlugin,
] as const;
