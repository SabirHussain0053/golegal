'use client';

import { BlockquotePlugin } from '@platejs/basic-nodes/react';
import { CodeBlockPlugin } from '@platejs/code-block/react';
import { KEYS } from 'platejs';
import { ListPlugin } from '@platejs/list/react';
import { IndentPlugin } from '@platejs/indent/react';
import { TogglePlugin } from '@platejs/toggle/react';
import { ParagraphPlugin } from 'platejs/react';

import { BlockList } from '@/components/plate-ui/block-list';

const HEADING_LEVELS = [KEYS.h1, KEYS.h2, KEYS.h3, KEYS.h4, KEYS.h5, KEYS.h6];

export const INDENT_STEP = 40; // px per indent level (≈ 0.4 in, close to standard legal indent)

export const ListPlugins = [
  IndentPlugin.configure({
    inject: {
      targetPlugins: [
        ParagraphPlugin.key,
        ...HEADING_LEVELS,
        BlockquotePlugin.key,
        CodeBlockPlugin.key,
        TogglePlugin.key,
      ],
    },
    options: {
      offset: INDENT_STEP,
      unit: 'px',
    },
  }),
  ListPlugin.configure({
    inject: {
      targetPlugins: [
        ParagraphPlugin.key,
        ...HEADING_LEVELS,
        BlockquotePlugin.key,
        CodeBlockPlugin.key,
        TogglePlugin.key,
      ],
    },
    render: {
      belowNodes: BlockList as any,
    },
  }),
];
