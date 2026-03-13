'use client';

import { DndPlugin } from '@platejs/dnd';
import { PlaceholderPlugin } from '@platejs/media/react';
import { NodeIdPlugin } from 'platejs';

import { DraggableAboveNodes } from '@/components/plate-ui/draggable';

export const dndPlugins = [
  NodeIdPlugin,
  DndPlugin.configure({
    options: {
      enableScroller: true,
      onDropFiles: ({ dragItem, editor, target }) => {
        editor
          .getTransforms(PlaceholderPlugin)
          .insert.media(dragItem.files, { at: target, nextBlock: false });
      },
    },
    render: {
      aboveNodes: DraggableAboveNodes,
    },
  }),
] as const;
