'use client';

import type React from 'react';

import type { TElement, TText } from 'platejs';
import type { ParagraphPlugin } from 'platejs/react';
import type { BlockquotePlugin } from '@platejs/basic-nodes/react';
import type {
  CodeBlockPlugin,
  CodeLinePlugin,
} from '@platejs/code-block/react';
import type { ExcalidrawPlugin } from '@platejs/excalidraw/react';
import type { HorizontalRulePlugin } from '@platejs/basic-nodes/react';
import type { LinkPlugin } from '@platejs/link/react';
import type { ImagePlugin, MediaEmbedPlugin } from '@platejs/media/react';
import type { MentionInputPlugin, MentionPlugin } from '@platejs/mention/react';
import type {
  TableCellPlugin,
  TablePlugin,
  TableRowPlugin,
} from '@platejs/table/react';
import type { TogglePlugin } from '@platejs/toggle/react';

// Local type aliases for types that moved or were removed across platejs versions.
type TCommentText = TText & Record<string, unknown>;
type TLinkElement = TElement & { url?: string; children: any[] };
type TImageElement = TElement & { url?: string };
type TMediaEmbedElement = TElement & { url?: string };
type TMentionElement = TElement & { value?: string };
type TMentionInputElement = TElement & { trigger?: string };
type TExcalidrawElement = TElement & { data?: unknown };
type TToggleElement = TElement;
type TTableElement = TElement;

const HEADING_KEYS = { h1: 'h1', h2: 'h2', h3: 'h3' } as const;

/** Text */

export type EmptyText = {
  text: '';
};

export type PlainText = {
  text: string;
};

export interface RichText extends TText, TCommentText {
  backgroundColor?: React.CSSProperties['backgroundColor'];
  bold?: boolean;
  code?: boolean;
  color?: React.CSSProperties['color'];
  fontFamily?: React.CSSProperties['fontFamily'];
  fontSize?: React.CSSProperties['fontSize'];
  fontWeight?: React.CSSProperties['fontWeight'];
  italic?: boolean;
  kbd?: boolean;
  strikethrough?: boolean;
  subscript?: boolean;
  underline?: boolean;
}

/** Inline Elements */

export interface MyLinkElement extends TLinkElement {
  children: RichText[];
  type: typeof LinkPlugin.key;
}

export interface MyMentionInputElement extends TMentionInputElement {
  children: [PlainText];
  type: typeof MentionInputPlugin.key;
}

export interface MyMentionElement extends TMentionElement {
  children: [EmptyText];
  type: typeof MentionPlugin.key;
}

export type MyInlineElement =
  | MyLinkElement
  | MyMentionElement
  | MyMentionInputElement;

export type MyInlineDescendant = MyInlineElement | RichText;

export type MyInlineChildren = MyInlineDescendant[];

/** Block props */

export interface MyIndentProps {
  indent?: number;
}

export interface MyIndentListProps extends MyIndentProps {
  listRestart?: number;
  listStart?: number;
  listStyleType?: string;
}

export interface MyLineHeightProps {
  lineHeight?: React.CSSProperties['lineHeight'];
}

export interface MyAlignProps {
  align?: React.CSSProperties['textAlign'];
}

export interface MyBlockElement
  extends TElement,
    MyIndentListProps,
    MyLineHeightProps {
  id?: string;
}

/** Blocks */

export interface MyParagraphElement extends MyBlockElement {
  children: MyInlineChildren;
  type: typeof ParagraphPlugin.key;
}

export interface MyH1Element extends MyBlockElement {
  children: MyInlineChildren;
  type: typeof HEADING_KEYS.h1;
}

export interface MyH2Element extends MyBlockElement {
  children: MyInlineChildren;
  type: typeof HEADING_KEYS.h2;
}

export interface MyH3Element extends MyBlockElement {
  children: MyInlineChildren;
  type: typeof HEADING_KEYS.h3;
}

export interface MyBlockquoteElement extends MyBlockElement {
  children: MyInlineChildren;
  type: typeof BlockquotePlugin.key;
}

export interface MyCodeBlockElement extends MyBlockElement {
  children: MyCodeLineElement[];
  type: typeof CodeBlockPlugin.key;
}

export interface MyCodeLineElement extends TElement {
  children: PlainText[];
  type: typeof CodeLinePlugin.key;
}

export interface MyTableElement extends TTableElement, MyBlockElement {
  children: MyTableRowElement[];
  type: typeof TablePlugin.key;
}

export interface MyTableRowElement extends TElement {
  children: MyTableCellElement[];
  type: typeof TableRowPlugin.key;
}

export interface MyTableCellElement extends TElement {
  children: MyNestableBlock[];
  type: typeof TableCellPlugin.key;
}

export interface MyToggleElement extends TToggleElement, MyBlockElement {
  children: MyInlineChildren;
  type: typeof TogglePlugin.key;
}

export interface MyImageElement extends TImageElement, MyBlockElement {
  children: [EmptyText];
  type: typeof ImagePlugin.key;
}

export interface MyMediaEmbedElement
  extends TMediaEmbedElement,
    MyBlockElement {
  children: [EmptyText];
  type: typeof MediaEmbedPlugin.key;
}

export interface MyHrElement extends MyBlockElement {
  children: [EmptyText];
  type: typeof HorizontalRulePlugin.key;
}

export interface MyExcalidrawElement
  extends TExcalidrawElement,
    MyBlockElement {
  children: [EmptyText];
  type: typeof ExcalidrawPlugin.key;
}

export type MyNestableBlock = MyParagraphElement;

export type MyRootBlock =
  | MyBlockquoteElement
  | MyCodeBlockElement
  | MyExcalidrawElement
  | MyH1Element
  | MyH2Element
  | MyH3Element
  | MyHrElement
  | MyImageElement
  | MyMediaEmbedElement
  | MyParagraphElement
  | MyTableElement
  | MyToggleElement;

export type MyValue = MyRootBlock[];

// export type MyElement = ElementOf<MyEditor>;

// export type MyBlock = Exclude<MyElement, MyInlineElement>;

// export type MyEditor = ReturnType<typeof useCreateEditor>;

// export const useEditor = () => useEditorRef<MyEditor>();
