'use client';

import type { PlateEditor } from 'platejs/react';

import {
  type NodeEntry,
  type Path,
  type TElement,
  PathApi,
  KEYS,
} from 'platejs';
import { insertCallout } from '@platejs/callout';
import { CalloutPlugin } from '@platejs/callout/react';
import { insertCodeBlock } from '@platejs/code-block';
import { CodeBlockPlugin } from '@platejs/code-block/react';
import { insertDate } from '@platejs/date';
import { DatePlugin } from '@platejs/date/react';
import { insertToc } from '@platejs/toc';
import { TocPlugin } from '@platejs/toc/react';
import { insertColumnGroup, toggleColumnGroup } from '@platejs/layout';
import { ColumnItemPlugin, ColumnPlugin } from '@platejs/layout/react';
import { LinkPlugin, triggerFloatingLink } from '@platejs/link/react';
import { insertEquation, insertInlineEquation } from '@platejs/math';
import { EquationPlugin, InlineEquationPlugin } from '@platejs/math/react';
import {
  insertAudioPlaceholder,
  insertFilePlaceholder,
  insertMedia,
  insertVideoPlaceholder,
} from '@platejs/media';
import {
  AudioPlugin,
  FilePlugin,
  ImagePlugin,
  MediaEmbedPlugin,
  VideoPlugin,
} from '@platejs/media/react';
import {
  TableCellPlugin,
  TablePlugin,
  TableRowPlugin,
} from '@platejs/table/react';

export const STRUCTURAL_TYPES: string[] = [
  ColumnPlugin.key,
  ColumnItemPlugin.key,
  TablePlugin.key,
  TableRowPlugin.key,
  TableCellPlugin.key,
];

const ACTION_THREE_COLUMNS = 'action_three_columns';

const insertList = (editor: PlateEditor, type: string) => {
  editor.tf.insertNodes(
    editor.api.create.block({
      indent: 1,
      listStyleType: type,
    }),
    { select: true },
  );
};

const insertBlockMap: Record<
  string,
  (editor: PlateEditor, type: string) => void
> = {
  [KEYS.listTodo]: insertList,
  [KEYS.ol]: insertList,
  [KEYS.ul]: insertList,
  [ACTION_THREE_COLUMNS]: (editor) =>
    insertColumnGroup(editor, { columns: 3, select: true }),
  [AudioPlugin.key]: (editor) =>
    insertAudioPlaceholder(editor, { select: true }),
  [CalloutPlugin.key]: (editor) => insertCallout(editor, { select: true }),
  [CodeBlockPlugin.key]: (editor) => insertCodeBlock(editor, { select: true }),
  [EquationPlugin.key]: (editor) => insertEquation(editor, { select: true }),
  [FilePlugin.key]: (editor) => insertFilePlaceholder(editor, { select: true }),
  [ImagePlugin.key]: (editor) =>
    insertMedia(editor, {
      select: true,
      type: ImagePlugin.key,
    }),
  [MediaEmbedPlugin.key]: (editor) =>
    insertMedia(editor, {
      select: true,
      type: MediaEmbedPlugin.key,
    }),
  [TablePlugin.key]: (editor) =>
    editor.getTransforms(TablePlugin).insert.table({}, { select: true }),
  [TocPlugin.key]: (editor) => insertToc(editor, { select: true }),
  [VideoPlugin.key]: (editor) =>
    insertVideoPlaceholder(editor, { select: true }),
};

const insertInlineMap: Record<
  string,
  (editor: PlateEditor, type: string) => void
> = {
  [DatePlugin.key]: (editor) => insertDate(editor, { select: true }),
  [InlineEquationPlugin.key]: (editor) =>
    insertInlineEquation(editor, '', { select: true }),
  [LinkPlugin.key]: (editor) => triggerFloatingLink(editor, { focused: true }),
};

export const insertBlock = (editor: PlateEditor, type: string) => {
  editor.tf.withoutNormalizing(() => {
    const block = editor.api.block();

    if (!block) return;
    if (type in insertBlockMap) {
      insertBlockMap[type](editor, type);
    } else {
      editor.tf.insertNodes(editor.api.create.block({ type }), {
        at: PathApi.next(block[1]),
        select: true,
      });
    }
    if (getBlockType(block[0]) !== type) {
      editor.tf.removeNodes({ previousEmptyBlock: true });
    }
  });
};

export const insertInlineElement = (editor: PlateEditor, type: string) => {
  if (insertInlineMap[type]) {
    insertInlineMap[type](editor, type);
  }
};

const setList = (
  editor: PlateEditor,
  type: string,
  entry: NodeEntry<TElement>,
) => {
  editor.tf.setNodes(
    editor.api.create.block({
      indent: 1,
      listStyleType: type,
    }),
    { at: entry[1] },
  );
};

const setBlockMap: Record<
  string,
  (editor: PlateEditor, type: string, entry: NodeEntry<TElement>) => void
> = {
  [KEYS.listTodo]: setList,
  [KEYS.ol]: setList,
  [KEYS.ul]: setList,
  [ACTION_THREE_COLUMNS]: (editor) => toggleColumnGroup(editor, { columns: 3 }),
};

export const setBlockType = (
  editor: PlateEditor,
  type: string,
  { at }: { at?: Path } = {},
) => {
  editor.tf.withoutNormalizing(() => {
    const setEntry = (entry: NodeEntry<TElement>) => {
      const [node, path] = entry;

      if (node[KEYS.listType]) {
        editor.tf.unsetNodes([KEYS.listType, 'indent'], { at: path });
      }
      if (type in setBlockMap) {
        return setBlockMap[type](editor, type, entry);
      }
      if (node.type !== type) {
        editor.tf.setNodes({ type }, { at: path });
      }
    };

    if (at) {
      const entry = editor.api.node<TElement>(at);

      if (entry) {
        setEntry(entry);
        return;
      }
    }

    const entries = editor.api.blocks({ mode: 'lowest' });
    entries.forEach((entry) => setEntry(entry));
  });
};

export const getBlockType = (block: TElement) => {
  if (block[KEYS.listType]) {
    if (block[KEYS.listType] === KEYS.ol) {
      return KEYS.ol;
    } else if (block[KEYS.listType] === KEYS.listTodo) {
      return KEYS.listTodo;
    } else {
      return KEYS.ul;
    }
  }

  return block.type;
};
