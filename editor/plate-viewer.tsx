'use client';

import {
  BlockquotePlugin,
  BoldPlugin,
  CodePlugin,
  HeadingPlugin,
  HighlightPlugin,
  HorizontalRulePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  UnderlinePlugin,
} from '@platejs/basic-nodes/react';
import { LinkPlugin } from '@platejs/link/react';
import { ImagePlugin } from '@platejs/media/react';
import {
  TableCellHeaderPlugin,
  TableCellPlugin,
  TablePlugin,
  TableRowPlugin,
} from '@platejs/table/react';
import { cn, withProps } from '@udecode/cn';
import { KEYS } from 'platejs';
import { ParagraphPlugin, Plate, usePlateEditor } from 'platejs/react';
import React, { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';

import {
  BaseBasicBlocksPlugin,
  BaseBasicMarksPlugin,
} from '@platejs/basic-nodes';
import { BaseListPlugin } from '@platejs/list';
import { BaseTablePlugin } from '@platejs/table';

import { HeadingElement } from '@/components/plate-ui/heading-element';
import { HrElement } from '@/components/plate-ui/hr-element';
import { ImageElement } from '@/components/plate-ui/image-element';
import {
  TableCellElement,
  TableCellHeaderElement,
} from '@/components/plate-ui/table-cell-element';
import { TableElement } from '@/components/plate-ui/table-element';
import { TableRowElement } from '@/components/plate-ui/table-row-element';

// Lightweight inline paragraph - no extra wrappers
const SimpleParagraph = ({ attributes, children, element }: any) => {
  const style: React.CSSProperties = {};
  if (element.backgroundColor) style.backgroundColor = element.backgroundColor;
  if (element.color) style.color = element.color;

  return (
    <p
      {...attributes}
      style={Object.keys(style).length > 0 ? style : undefined}
    >
      {children}
    </p>
  );
};

// Lightweight blockquote
const SimpleBlockquote = ({ attributes, children }: any) => (
  <blockquote
    {...attributes}
    className="border-l-4 border-gray-300 pl-4 italic"
  >
    {children}
  </blockquote>
);

// Lightweight link
const SimpleLink = ({ attributes, children, element }: any) => (
  <a {...attributes} href={element.url} className="text-blue-600 underline">
    {children}
  </a>
);

// Custom leaf that supports inline diff styles (backgroundColor, color, strikethrough)
const DiffAwareLeaf = ({ attributes, children, leaf }: any) => {
  const style: React.CSSProperties = {};

  // Apply diff styles from leaf properties
  if (leaf.backgroundColor) style.backgroundColor = leaf.backgroundColor;
  if (leaf.color) style.color = leaf.color;

  let content = children;

  // Apply text formatting
  if (leaf.bold) content = <strong>{content}</strong>;
  if (leaf.italic) content = <em>{content}</em>;
  if (leaf.underline) content = <u>{content}</u>;
  if (leaf.strikethrough) content = <s>{content}</s>;
  if (leaf.code)
    content = <code className="bg-gray-100 px-1 rounded">{content}</code>;
  if (leaf.subscript) content = <sub>{content}</sub>;
  if (leaf.superscript) content = <sup>{content}</sup>;

  // If we have styles, wrap in span
  if (Object.keys(style).length > 0) {
    return (
      <span {...attributes} style={style}>
        {content}
      </span>
    );
  }

  return <span {...attributes}>{content}</span>;
};

// Minimal plugins - absolute minimum for display
const minimalPlugins = [
  BaseBasicBlocksPlugin,
  BaseBasicMarksPlugin,
  BaseListPlugin,
  BaseTablePlugin,
  HeadingPlugin,
  HorizontalRulePlugin,
  LinkPlugin,
  ImagePlugin,
  TablePlugin,
];

// Minimal components map
const minimalComponents = {
  // Block elements
  [ParagraphPlugin.key]: SimpleParagraph,
  [BlockquotePlugin.key]: SimpleBlockquote,
  [LinkPlugin.key]: SimpleLink,
  [KEYS.h1]: withProps(HeadingElement, { variant: 'h1' }),
  [KEYS.h2]: withProps(HeadingElement, { variant: 'h2' }),
  [KEYS.h3]: withProps(HeadingElement, { variant: 'h3' }),
  [KEYS.h4]: withProps(HeadingElement, { variant: 'h4' }),
  [KEYS.h5]: withProps(HeadingElement, { variant: 'h5' }),
  [KEYS.h6]: withProps(HeadingElement, { variant: 'h6' }),
  [HorizontalRulePlugin.key]: HrElement,
  [ImagePlugin.key]: ImageElement,
  [TableCellHeaderPlugin.key]: TableCellHeaderElement,
  [TableCellPlugin.key]: TableCellElement,
  [TablePlugin.key]: TableElement,
  [TableRowPlugin.key]: TableRowElement,
  // Leaf marks - all use DiffAwareLeaf for styling support
  [BoldPlugin.key]: DiffAwareLeaf,
  [ItalicPlugin.key]: DiffAwareLeaf,
  [UnderlinePlugin.key]: DiffAwareLeaf,
  [StrikethroughPlugin.key]: DiffAwareLeaf,
  [CodePlugin.key]: DiffAwareLeaf,
  [SubscriptPlugin.key]: DiffAwareLeaf,
  [SuperscriptPlugin.key]: DiffAwareLeaf,
  [HighlightPlugin.key]: DiffAwareLeaf,
};

/**
 * Recursively sanitize nodes to ensure valid Slate/Plate structure.
 * Fixes cases where compare/diff logic incorrectly flattens nested structures
 * (e.g. table > tr > td) into flat text leaves.
 */
function sanitizeNodes(nodes: any[]): any[] {
  if (!Array.isArray(nodes)) return [{ type: 'p', children: [{ text: '' }] }];
  return nodes.map((node) => sanitizeNode(node));
}

function sanitizeNode(node: any): any {
  if (!node || typeof node !== 'object')
    return { type: 'p', children: [{ text: '' }] };
  // Text/leaf nodes are valid as-is
  if ('text' in node) return node;

  const type = node.type || 'p';
  const rawChildren = Array.isArray(node.children) ? node.children : [];

  switch (type) {
    case 'table': {
      // Table children MUST be tr nodes
      const rows = rawChildren.map((child: any) => {
        if (!child || typeof child !== 'object') {
          return {
            type: 'tr',
            children: [{ type: 'td', children: [{ text: '' }] }],
          };
        }
        if ('text' in child) {
          // Text leaf incorrectly placed as table child — wrap in tr > td
          return { type: 'tr', children: [{ type: 'td', children: [child] }] };
        }
        if (child.type === 'tr') return sanitizeNode(child);
        // Non-tr element — wrap in tr
        return {
          type: 'tr',
          children: [sanitizeNode({ ...child, type: 'td' })],
        };
      });
      return {
        ...node,
        children:
          rows.length > 0
            ? rows
            : [
                {
                  type: 'tr',
                  children: [{ type: 'td', children: [{ text: '' }] }],
                },
              ],
      };
    }
    case 'tr': {
      // tr children MUST be td or th nodes
      const cells = rawChildren.map((child: any) => {
        if (!child || typeof child !== 'object') {
          return { type: 'td', children: [{ text: '' }] };
        }
        if ('text' in child) {
          // Text leaf incorrectly placed as row child — wrap in td
          return { type: 'td', children: [child] };
        }
        if (child.type === 'td' || child.type === 'th')
          return sanitizeNode(child);
        // Non-td element — wrap as td
        return sanitizeNode({ ...child, type: 'td' });
      });
      return {
        ...node,
        children:
          cells.length > 0 ? cells : [{ type: 'td', children: [{ text: '' }] }],
      };
    }
    case 'td':
    case 'th': {
      // td/th children can be block elements or text; ensure at least one child
      const children =
        rawChildren.length > 0
          ? rawChildren.map((c: any) => ('text' in c ? c : sanitizeNode(c)))
          : [{ text: '' }];
      return { ...node, children };
    }
    case 'ul':
    case 'ol': {
      // List children should be li/lic nodes
      const items = rawChildren.map((child: any) => {
        if (!child || typeof child !== 'object') {
          return { type: 'li', children: [{ text: '' }] };
        }
        if ('text' in child) {
          return { type: 'li', children: [child] };
        }
        return sanitizeNode(child);
      });
      return {
        ...node,
        children:
          items.length > 0 ? items : [{ type: 'li', children: [{ text: '' }] }],
      };
    }
    default: {
      // Standard block (p, h1, blockquote, etc.) — children are text/inline
      const children = rawChildren.length > 0 ? rawChildren : [{ text: '' }];
      return { ...node, children };
    }
  }
}

function PlateViewerInner({
  content,
  editorId = 'viewer',
  className,
}: {
  content?: any;
  editorId?: string;
  className?: string;
}) {
  const fontFamily = useSelector((state: any) => state.editor?.fontFamily);

  // Memoize value to prevent unnecessary re-renders
  const value = useMemo(() => {
    if (Array.isArray(content) && content.length > 0) {
      return sanitizeNodes(content);
    }
    return [{ type: 'p', children: [{ text: '' }] }];
  }, [content]);

  // Create editor with value directly - no lazy loading needed for viewer
  const editor = usePlateEditor({
    id: editorId,
    value,
    plugins: minimalPlugins,
    override: {
      components: minimalComponents,
    },
  });

  return (
    <Plate editor={editor} readOnly>
      <div className={cn('border-2 p-2', className)} style={{ fontFamily }}>
        <div
          className="size-full px-16 pb-8 lg:px-36 outline-none"
          role="textbox"
          aria-readonly="true"
        >
          {editor.children.map((node: any, index: number) => (
            <RenderNode key={node.id || index} node={node} />
          ))}
        </div>
      </div>
    </Plate>
  );
}

// Simple node renderer for maximum performance
const RenderNode = memo(({ node }: { node: any }) => {
  if (!node) return null;

  const type = node.type || 'p';
  const children = node.children || [];

  // Build inline styles for diff highlighting
  const style: React.CSSProperties = {};
  if (node.backgroundColor) style.backgroundColor = node.backgroundColor;
  if (node.color) style.color = node.color;

  // Render children (text nodes with formatting)
  const renderedChildren = children.map((child: any, idx: number) => (
    <RenderLeaf key={idx} leaf={child} />
  ));

  // Render based on type
  switch (type) {
    case 'h1':
      return (
        <h1 style={style} className="text-3xl font-bold mb-4">
          {renderedChildren}
        </h1>
      );
    case 'h2':
      return (
        <h2 style={style} className="text-2xl font-bold mb-3">
          {renderedChildren}
        </h2>
      );
    case 'h3':
      return (
        <h3 style={style} className="text-xl font-bold mb-2">
          {renderedChildren}
        </h3>
      );
    case 'h4':
      return (
        <h4 style={style} className="text-lg font-bold mb-2">
          {renderedChildren}
        </h4>
      );
    case 'h5':
      return (
        <h5 style={style} className="text-base font-bold mb-1">
          {renderedChildren}
        </h5>
      );
    case 'h6':
      return (
        <h6 style={style} className="text-sm font-bold mb-1">
          {renderedChildren}
        </h6>
      );
    case 'blockquote':
      return (
        <blockquote
          style={style}
          className="border-l-4 border-gray-300 pl-4 italic my-2"
        >
          {renderedChildren}
        </blockquote>
      );
    case 'ul':
      return (
        <ul style={style} className="list-disc ml-6 my-2">
          {children.map((li: any, i: number) => (
            <RenderNode key={i} node={li} />
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol style={style} className="list-decimal ml-6 my-2">
          {children.map((li: any, i: number) => (
            <RenderNode key={i} node={li} />
          ))}
        </ol>
      );
    case 'li':
    case 'lic':
      return <li style={style}>{renderedChildren}</li>;
    case 'table':
      return (
        <table
          style={style}
          className="border-collapse border border-gray-300 my-2 w-full"
        >
          {children.map((row: any, i: number) => (
            <RenderNode key={i} node={row} />
          ))}
        </table>
      );
    case 'tr':
      return (
        <tr style={style}>
          {children.map((cell: any, i: number) => (
            <RenderNode key={i} node={cell} />
          ))}
        </tr>
      );
    case 'td':
      return (
        <td style={style} className="border border-gray-300 p-2">
          {renderedChildren}
        </td>
      );
    case 'th':
      return (
        <th
          style={style}
          className="border border-gray-300 p-2 font-bold bg-gray-100"
        >
          {renderedChildren}
        </th>
      );
    case 'hr':
      return <hr className="my-4 border-gray-300" />;
    case 'img':
      return (
        <img
          src={node.url}
          alt={node.alt || ''}
          className="max-w-full h-auto my-2"
        />
      );
    case 'a':
      return (
        <a href={node.url} style={style} className="text-blue-600 underline">
          {renderedChildren}
        </a>
      );
    case 'p':
    default:
      return (
        <p style={style} className="my-1 min-h-[1.5em]">
          {renderedChildren}
        </p>
      );
  }
});

// Simple leaf renderer with diff styling support
const RenderLeaf = memo(({ leaf }: { leaf: any }) => {
  if (!leaf) return null;

  // Handle text node
  if (typeof leaf === 'string') return <>{leaf}</>;
  if (leaf.text !== undefined) {
    let content: React.ReactNode = leaf.text;

    // Apply formatting marks
    if (leaf.bold) content = <strong>{content}</strong>;
    if (leaf.italic) content = <em>{content}</em>;
    if (leaf.underline) content = <u>{content}</u>;
    if (leaf.strikethrough) content = <s>{content}</s>;
    if (leaf.code)
      content = (
        <code className="bg-gray-100 px-1 rounded text-sm">{content}</code>
      );
    if (leaf.subscript) content = <sub>{content}</sub>;
    if (leaf.superscript) content = <sup>{content}</sup>;

    // Apply diff styles (backgroundColor, color)
    const style: React.CSSProperties = {};
    if (leaf.backgroundColor) style.backgroundColor = leaf.backgroundColor;
    if (leaf.color) style.color = leaf.color;

    if (Object.keys(style).length > 0) {
      return <span style={style}>{content}</span>;
    }

    return <>{content}</>;
  }

  // Handle nested element (like link inside paragraph)
  if (leaf.type) {
    return <RenderNode node={leaf} />;
  }

  return null;
});

RenderNode.displayName = 'RenderNode';
RenderLeaf.displayName = 'RenderLeaf';

export const PlateViewer = memo(PlateViewerInner);
