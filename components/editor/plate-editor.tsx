'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { cn } from '@udecode/cn';
import { Plate } from 'platejs/react';
import { useSelector } from 'react-redux';

import { useCreateEditor } from '@/components/editor/use-create-editor';
import { Editor, EditorContainer } from '@/components/plate-ui/editor';

function PlateEditorInner({
  content,
  onChange,
  readOnly = false,
  disableAI = false,
  editorId = 'main-editor',
  className,
}: {
  content?: any;
  onChange?: (value: any) => void;
  readOnly?: boolean;
  disableAI?: boolean;
  editorId?: string;
  className?: any;
}) {
  const fontFamily = useSelector((state: any) => state.editor.fontFamily);
  const changeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contentLoadedRef = useRef(false);
  const [loading, setLoading] = useState(true);

  // Create editor with empty content for instant mount
  const editor = useCreateEditor(
    editorId,
    [{ type: 'p', children: [{ text: '' }] }],
    readOnly,
    { disableAI },
  );

  // Load content after mount - single direct assignment
  useEffect(() => {
    if (!editor || contentLoadedRef.current) return;

    if (!Array.isArray(content) || content.length === 0) {
      setLoading(false);
      return;
    }

    contentLoadedRef.current = true;

    // Use requestAnimationFrame to ensure UI is painted first
    requestAnimationFrame(() => {
      (editor as any).children = content;
      (editor as any).onChange?.();
      setLoading(false);
    });
  }, [editor, content]);

  // Handle subsequent content updates
  useEffect(() => {
    if (!editor || loading || !contentLoadedRef.current) return;
    if (!Array.isArray(content) || content.length === 0) return;

    const current = (editor as any).children;
    if (current === content) return;

    (editor as any).children = content;
    (editor as any).onChange?.();
  }, [editor, content, loading]);

  const debouncedOnChange = useCallback(
    (value: any) => {
      if (!onChange) return;
      if (changeTimeoutRef.current) clearTimeout(changeTimeoutRef.current);
      changeTimeoutRef.current = setTimeout(() => onChange(value), 300);
    },
    [onChange],
  );

  useEffect(() => {
    return () => {
      if (changeTimeoutRef.current) clearTimeout(changeTimeoutRef.current);
    };
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate
        editor={editor}
        readOnly={readOnly}
        onChange={(value) => debouncedOnChange(value.value)}
      >
        <EditorContainer
          className={cn('border-2 p-2 relative', className)}
          style={{ fontFamily }}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                <span className="text-sm text-gray-600">Loading...</span>
              </div>
            </div>
          )}
          <Editor variant="none" className="size-full px-16 pb-8 lg:px-36" />
        </EditorContainer>
      </Plate>
    </DndProvider>
  );
}

export const PlateEditor = memo(PlateEditorInner);
