# GoLegal Editor

A rich text editor for creating and collaborating on legal documents, built with [Plate.js](https://platejs.org/) (v52) and [Next.js](https://nextjs.org/). It provides AI-powered writing assistance, digital signatures, document preview, and a comprehensive formatting toolkit tailored for legal workflows.

## Architecture Overview

```
editor/                        ← Core editor module
├── plate-editor.tsx           ← Main editable component (edit mode)
├── plate-viewer.tsx           ← Lightweight read-only viewer
├── use-create-editor.js       ← Editor factory hook (plugins + component map)
├── plate-types.ts             ← TypeScript type definitions for all node types
├── transforms.ts              ← Helper functions for inserting/toggling blocks
├── settings.tsx               ← Settings context (AI model & API key management)
├── use-chat.ts                ← AI chat hook with OpenAI streaming
└── plugins/                   ← 28 Plate.js plugins organised by feature
    ├── editor-plugins.tsx     ← Plugin aggregation (viewPlugins + editorPlugins)
    ├── ai-plugins.tsx         ← AI menu, chat, and prompt templates
    ├── signature-plugin.tsx   ← Digital signature capture via canvas
    ├── basic-nodes-plugins.tsx← Headings, blockquotes, code blocks
    ├── media-plugins.tsx      ← Images, video, audio, file uploads
    ├── table-plugin.ts        ← Table editing
    ├── indent-list-plugins.ts ← Ordered/unordered/todo lists
    ├── floating-toolbar-plugin.tsx ← Context-sensitive formatting toolbar
    ├── fixed-toolbar-plugin.tsx    ← Persistent top toolbar
    └── ...                    ← Additional plugins (see Plugin Reference)

components/                    ← Shared UI components
├── DraftsCard.tsx             ← Draft document card
├── DynamicProgressBar.tsx     ← Progress indicator
└── ReadPDF.tsx                ← PDF text extraction

preview-document/[token]/      ← Next.js dynamic route for document preview
├── page.jsx                   ← Public preview page (token-based access)
├── layout.tsx                 ← Layout wrapper
└── SignatureSidebar.tsx       ← Signature collection sidebar
```

## Key Concepts

### PlateEditor (`plate-editor.tsx`)

`PlateEditor` is the primary editing surface. It wraps the Plate.js `<Plate>` component with:

- **Drag-and-drop** — `react-dnd` with the HTML5 backend lets users reorder blocks by dragging.
- **Deferred content loading** — The editor mounts instantly with an empty paragraph, then injects the real document content via `requestAnimationFrame` to keep the first paint fast.
- **Debounced onChange** — Content changes are debounced (300 ms) before propagating to the parent, reducing unnecessary re-renders.
- **Font family** — Read from the Redux store and applied as an inline style on the editor container.

```tsx
<PlateEditor
  content={documentNodes}     // Plate.js node array
  onChange={(value) => save(value)}
  readOnly={false}
  disableAI={false}
  editorId="main-editor"
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `any[]` | — | Plate.js document node array |
| `onChange` | `(value) => void` | — | Called (debounced) when the document changes |
| `readOnly` | `boolean` | `false` | Disables editing; uses a lighter plugin set |
| `disableAI` | `boolean` | `false` | Removes AI plugins for performance |
| `editorId` | `string` | `"main-editor"` | Unique ID when multiple editors coexist |
| `className` | `string` | — | Additional CSS classes |

### PlateViewer (`plate-viewer.tsx`)

`PlateViewer` is a performance-optimised read-only renderer. Instead of loading the full editing plugin stack, it uses:

- A **minimal plugin set** (`BaseBasicBlocksPlugin`, `BaseBasicMarksPlugin`, `BaseListPlugin`, `BaseTablePlugin`, headings, links, images, tables).
- A **custom node sanitiser** (`sanitizeNodes`) that repairs malformed structures (e.g. text leaves incorrectly nested inside table rows) before rendering.
- **Diff-aware leaf rendering** — `RenderLeaf` supports `backgroundColor` and `color` properties, making it suitable for displaying document diffs with highlighted changes.

### useCreateEditor (`use-create-editor.js`)

A hook that constructs the Plate editor instance. It:

1. Selects plugins based on mode — `viewPlugins` for read-only, `editorPlugins` (with optional `copilotPlugins`) for editing.
2. Maps every node type to its React component via `override.components` (headings, tables, media, signatures, etc.).
3. Returns the editor object used by `<Plate editor={editor}>`.

### Plugin System (`plugins/editor-plugins.tsx`)

Plugins are split into two tiers exported from `editor-plugins.tsx`:

| Export | Contents | Used by |
|--------|----------|---------|
| `viewPlugins` | Node rendering, marks, alignment, lists, line height, comments, signatures | Read-only mode + edit mode |
| `editorPlugins` | Everything in `viewPlugins` plus AI, slash commands, autoformat, DnD, emoji, exit-break, cursor overlay, block menus, deserialization (DOCX/Markdown/Juice), toolbars | Edit mode only |

This separation keeps the read-only bundle small while giving the full editor every feature.

## Plugin Reference

| Plugin | File | Description |
|--------|------|-------------|
| **AI Chat & Menu** | `ai-plugins.tsx` | In-editor AI assistant powered by OpenAI. Uses prompt templates that adapt based on whether text is selected, block-selected, or neither. Renders an `<AIMenu>` after the editable area. |
| **Copilot** | `copilot-plugins.tsx` | Predictive text completions via the AI copilot. |
| **Signature** | `signature-plugin.tsx` | Canvas-based signature drawing pad. Captures a signature as a PNG data URL and inserts it as an image node. |
| **Basic Nodes** | `basic-nodes-plugins.tsx` | Headings (h1–h6), blockquotes, code blocks, and text marks (bold, italic, underline, strikethrough, code, highlight, kbd, subscript, superscript). |
| **Tables** | `table-plugin.ts` | Full table editing — insert rows/columns, merge cells, and resize. |
| **Lists** | `indent-list-plugins.ts` | Ordered, unordered, and to-do lists using indent-based list model. |
| **Media** | `media-plugins.tsx` | Image, video, audio, and file upload support with placeholders. |
| **Equations** | `equation-plugins.ts` | Block and inline math equations. |
| **Links** | `link-plugin.tsx` | Hyperlink insertion with a floating link toolbar. |
| **Mentions** | `mention-plugin.ts` | `@mention` support for tagging collaborators. |
| **Comments** | `comments-plugin.tsx` | Inline comment threads for document review. |
| **Autoformat** | `autoformat-plugin.ts` | Markdown-style shortcuts (e.g. `#` → heading, `>` → blockquote). |
| **Drag & Drop** | `dnd-plugins.tsx` | Block-level drag-and-drop reordering. |
| **Block Menu** | `block-menu-plugins.ts` | Right-click or `+` context menu for inserting blocks. |
| **Block Selection** | `block-selection-plugins.ts` | Select entire blocks by clicking the gutter. |
| **Floating Toolbar** | `floating-toolbar-plugin.tsx` | Context-sensitive formatting toolbar that appears on text selection. |
| **Fixed Toolbar** | `fixed-toolbar-plugin.tsx` | Persistent toolbar at the top of the editor. |
| **Cursor Overlay** | `cursor-overlay-plugin.tsx` | Visual cursor indicator for collaborative editing. |
| **Alignment** | `align-plugin.ts` | Text alignment (left, center, right, justify). |
| **Line Height** | `line-height-plugin.ts` | Adjustable line spacing. |
| **Soft Break** | `soft-break-plugin.ts` | `Shift+Enter` creates a line break within a block. |
| **Exit Break** | `exit-break-plugin.ts` | `Enter` exits certain blocks (e.g. code blocks, blockquotes). |
| **Reset Block Type** | `reset-block-type-plugin.ts` | Pressing `Enter` on an empty list item or blockquote resets it to a paragraph. |
| **Delete** | `delete-plugins.ts` | Improved backspace/delete behaviour across block boundaries. |
| **Table of Contents** | `toc-plugin.ts` | Auto-generated TOC from document headings. |
| **Outline List** | `outline-list-plugin.ts` | Outline/nested list support. |
| **HTML Parser** | `html-to-plate-parser.js` | Converts pasted HTML into Plate.js node format. |

## AI Integration

### How It Works

The AI feature is driven by two files:

1. **`use-chat.ts`** — Wraps the Vercel AI SDK `useChat` hook. It sends requests to `/api/ai/command` with the selected OpenAI model and API key. If the API route is unavailable, a mock streaming response is returned for demo purposes.

2. **`ai-plugins.tsx`** — Configures the `AIChatPlugin` with context-aware prompt templates:
   - **No selection** → The AI receives the current block as context and generates inline content.
   - **Text selection** → The AI receives both the block and the selected text, and returns replacement content.
   - **Block selection** → The AI receives entire selected blocks and returns replacement content preserving structure.

### Settings (`settings.tsx`)

A `SettingsProvider` stores the OpenAI API key and model selection in React state (not persisted). The `SettingsDialog` component lets users configure:

- **API Key** — Entered per session; never stored permanently.
- **Model** — Choose from `gpt-4o-mini`, `gpt-4o`, `gpt-4-turbo`, `gpt-4`, `gpt-3.5-turbo`, or `gpt-3.5-turbo-instruct`.

> ⚠️ **Demo only**: API keys are sent client-side. In production, route requests through a server-side API endpoint.

## Transforms (`transforms.ts`)

The `transforms.ts` file provides helper functions for programmatic document manipulation:

| Function | Description |
|----------|-------------|
| `insertBlock(editor, type)` | Inserts a new block of the given type (paragraph, code block, table, image, etc.) after the current block. |
| `insertInlineElement(editor, type)` | Inserts an inline element (date, equation, link) at the cursor. |
| `setBlockType(editor, type)` | Changes the type of the current block(s) — e.g. convert a paragraph to a heading. |
| `getBlockType(block)` | Returns the effective type of a block element, accounting for list styles. |

These transforms power the slash command menu, toolbar buttons, and block menus.

## Type System (`plate-types.ts`)

All document node types are defined as TypeScript interfaces extending Plate.js base types:

- **Text types**: `EmptyText`, `PlainText`, `RichText` (with marks like bold, italic, color, fontSize, etc.)
- **Inline elements**: `MyLinkElement`, `MyMentionElement`, `MyMentionInputElement`
- **Block elements**: `MyParagraphElement`, `MyH1Element`–`MyH3Element`, `MyBlockquoteElement`, `MyCodeBlockElement`, `MyTableElement`, `MyImageElement`, `MyToggleElement`, `MyHrElement`, `MyExcalidrawElement`
- **Composite types**: `MyRootBlock` (union of all top-level blocks), `MyValue` (the full document)

## Document Preview (`preview-document/[token]/`)

A Next.js dynamic route that renders a document in read-only mode for external viewers:

- **Token-based access** — Documents are shared via a URL containing a unique token.
- **Signature collection** — The `SignatureSidebar` component allows viewers to add their signature to the document.
- **Layout** — A minimal layout wrapper provides consistent styling.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router, React 18+) |
| Editor | Plate.js v52 (built on Slate.js) |
| Language | TypeScript / JavaScript |
| State | Redux (font settings), React Context (AI settings) |
| Styling | Tailwind CSS |
| AI | OpenAI API via Vercel AI SDK (`ai/react`) |
| Drag & Drop | `react-dnd` with HTML5 backend |
| Signatures | `react-signature-canvas` |
| Document Parsing | Mammoth (DOCX), `pdf-to-text` (PDF) |
| Icons | `lucide-react`, `react-icons` |
| UI Components | Shadcn/ui-style components (`plate-ui/`) |
