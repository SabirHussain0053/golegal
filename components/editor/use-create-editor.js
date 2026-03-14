// ──────────────────────────────────────────────────────────────
//  editor-config.ts  –  Plate v52
// ──────────────────────────────────────────────────────────────
import { withProps } from '@udecode/cn';
import { AIPlugin } from '@platejs/ai/react';
import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  UnderlinePlugin,
  BlockquotePlugin,
  HighlightPlugin,
  KbdPlugin,
} from '@platejs/basic-nodes/react';
import {
  CodeBlockPlugin,
  CodeLinePlugin,
  CodeSyntaxPlugin,
} from '@platejs/code-block/react';
import { CommentPlugin } from '@platejs/comment/react';
import { DatePlugin } from '@platejs/date/react';
import { EmojiInputPlugin } from '@platejs/emoji/react';
import { ExcalidrawPlugin } from '@platejs/excalidraw/react';
import { KEYS } from 'platejs';
import { HeadingPlugin } from '@platejs/basic-nodes/react';
import { TocPlugin } from '@platejs/toc/react';
import { HorizontalRulePlugin } from '@platejs/basic-nodes/react';
import { ColumnItemPlugin, ColumnPlugin } from '@platejs/layout/react';
import { LinkPlugin } from '@platejs/link/react';
import { EquationPlugin, InlineEquationPlugin } from '@platejs/math/react';
import {
  AudioPlugin,
  FilePlugin,
  ImagePlugin,
  MediaEmbedPlugin,
  PlaceholderPlugin,
  VideoPlugin,
} from '@platejs/media/react';
import { MentionInputPlugin, MentionPlugin } from '@platejs/mention/react';
import { SlashInputPlugin } from '@platejs/slash-command/react';
import {
  TableCellHeaderPlugin,
  TableCellPlugin,
  TablePlugin,
  TableRowPlugin,
} from '@platejs/table/react';
import { TogglePlugin } from '@platejs/toggle/react';
import { ParagraphPlugin, PlateLeaf, usePlateEditor } from 'platejs/react';

import { copilotPlugins } from '@/components/editor/plugins/copilot-plugins';
import { editorPlugins } from '@/components/editor/plugins/editor-plugins';
import { FixedToolbarPlugin } from '@/components/editor/plugins/fixed-toolbar-plugin';
import { FloatingToolbarPlugin } from '@/components/editor/plugins/floating-toolbar-plugin';
import { AILeaf } from '@/components/plate-ui/ai-leaf';
import { BlockquoteElement } from '@/components/plate-ui/blockquote-element';
import { CodeBlockElement } from '@/components/plate-ui/code-block-element';
import { CodeLeaf } from '@/components/plate-ui/code-leaf';
import { CodeLineElement } from '@/components/plate-ui/code-line-element';
import { CodeSyntaxLeaf } from '@/components/plate-ui/code-syntax-leaf';
import { ColumnElement } from '@/components/plate-ui/column-element';
import { ColumnGroupElement } from '@/components/plate-ui/column-group-element';
import { CommentLeaf } from '@/components/plate-ui/comment-leaf';
import { DateElement } from '@/components/plate-ui/date-element';
import { EmojiInputElement } from '@/components/plate-ui/emoji-input-element';
import { EquationElement } from '@/components/plate-ui/equation-element';
import { ExcalidrawElement } from '@/components/plate-ui/excalidraw-element';
import { HeadingElement } from '@/components/plate-ui/heading-element';
import { HighlightLeaf } from '@/components/plate-ui/highlight-leaf';
import { HrElement } from '@/components/plate-ui/hr-element';
import { ImageElement } from '@/components/plate-ui/image-element';
import { InlineEquationElement } from '@/components/plate-ui/inline-equation-element';
import { KbdLeaf } from '@/components/plate-ui/kbd-leaf';
import { LinkElement } from '@/components/plate-ui/link-element';
import { MediaAudioElement } from '@/components/plate-ui/media-audio-element';
import { MediaEmbedElement } from '@/components/plate-ui/media-embed-element';
import { MediaFileElement } from '@/components/plate-ui/media-file-element';
import { MediaPlaceholderElement } from '@/components/plate-ui/media-placeholder-element';
import { MediaVideoElement } from '@/components/plate-ui/media-video-element';
import { MentionElement } from '@/components/plate-ui/mention-element';
import { MentionInputElement } from '@/components/plate-ui/mention-input-element';
import { ParagraphElement } from '@/components/plate-ui/paragraph-element';
import { withPlaceholders } from '@/components/plate-ui/placeholder';
import { SlashInputElement } from '@/components/plate-ui/slash-input-element';
import {
  TableCellElement,
  TableCellHeaderElement,
} from '@/components/plate-ui/table-cell-element';
import { TableElement } from '@/components/plate-ui/table-element';
import { TableRowElement } from '@/components/plate-ui/table-row-element';
import { TocElement } from '@/components/plate-ui/toc-element';
import { ToggleElement } from '@/components/plate-ui/toggle-element';
import {
  SignatureElement,
  SIGNATURE_KEY,
} from '@/components/editor/plugins/signature-plugin';

// ──────────────────────────────────────────────────────────────
//  Editor creation hook
// ──────────────────────────────────────────────────────────────

// Minimal plugins for read-only mode (fast load)
import { viewPlugins } from '@/components/editor/plugins/editor-plugins';

export const useCreateEditor = (
  editorId = 'main-editor',
  initialValue = [],
  readOnly = false,
  options = {},
) => {
  const { disableAI = false } = options;
  const value =
    Array.isArray(initialValue) && initialValue.length > 0
      ? initialValue
      : [{ type: 'p', children: [{ text: '' }] }];

  // For read-only: use minimal viewPlugins only (no AI, no editing features)
  // For edit mode: use full plugin stack
  const plugins = readOnly
    ? [...viewPlugins]
    : [
        // Optionally drop AI plugins for perf testing
        ...(!disableAI ? copilotPlugins : []),
        ...editorPlugins,
      ];

  return usePlateEditor({
    id: editorId,
    value,
    override: {
      components: withPlaceholders({
        [AIPlugin.key]: AILeaf,
        [AudioPlugin.key]: MediaAudioElement,
        [BlockquotePlugin.key]: BlockquoteElement,
        [BoldPlugin.key]: withProps(PlateLeaf, { as: 'strong' }),
        [CodeBlockPlugin.key]: CodeBlockElement,
        [CodeLinePlugin.key]: CodeLineElement,
        [CodePlugin.key]: CodeLeaf,
        [CodeSyntaxPlugin.key]: CodeSyntaxLeaf,
        [ColumnItemPlugin.key]: ColumnElement,
        [ColumnPlugin.key]: ColumnGroupElement,
        [CommentPlugin.key]: CommentLeaf,
        [DatePlugin.key]: DateElement,
        [EmojiInputPlugin.key]: EmojiInputElement,
        [EquationPlugin.key]: EquationElement,
        [ExcalidrawPlugin.key]: ExcalidrawElement,
        [FilePlugin.key]: MediaFileElement,
        [KEYS.h1]: withProps(HeadingElement, { variant: 'h1' }),
        [KEYS.h2]: withProps(HeadingElement, { variant: 'h2' }),
        [KEYS.h3]: withProps(HeadingElement, { variant: 'h3' }),
        [KEYS.h4]: withProps(HeadingElement, { variant: 'h4' }),
        [KEYS.h5]: withProps(HeadingElement, { variant: 'h5' }),
        [KEYS.h6]: withProps(HeadingElement, { variant: 'h6' }),
        [HighlightPlugin.key]: HighlightLeaf,
        [HorizontalRulePlugin.key]: HrElement,
        [ImagePlugin.key]: ImageElement,
        [InlineEquationPlugin.key]: InlineEquationElement,
        [ItalicPlugin.key]: withProps(PlateLeaf, { as: 'em' }),
        [KbdPlugin.key]: KbdLeaf,
        [LinkPlugin.key]: LinkElement,
        [MediaEmbedPlugin.key]: MediaEmbedElement,
        [MentionInputPlugin.key]: MentionInputElement,
        [MentionPlugin.key]: MentionElement,
        [ParagraphPlugin.key]: ParagraphElement,
        [PlaceholderPlugin.key]: MediaPlaceholderElement,
        [SlashInputPlugin.key]: SlashInputElement,
        [StrikethroughPlugin.key]: withProps(PlateLeaf, { as: 's' }),
        [SubscriptPlugin.key]: withProps(PlateLeaf, { as: 'sub' }),
        [SuperscriptPlugin.key]: withProps(PlateLeaf, { as: 'sup' }),
        [TableCellHeaderPlugin.key]: TableCellHeaderElement,
        [TableCellPlugin.key]: TableCellElement,
        [TablePlugin.key]: TableElement,
        [TableRowPlugin.key]: TableRowElement,
        [TocPlugin.key]: TocElement,
        [TogglePlugin.key]: ToggleElement,
        [SIGNATURE_KEY]: SignatureElement,
        [UnderlinePlugin.key]: withProps(PlateLeaf, { as: 'u' }),
        [VideoPlugin.key]: MediaVideoElement,
      }),
    },
    plugins,
  });
};
