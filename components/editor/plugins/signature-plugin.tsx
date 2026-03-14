'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@udecode/cn';
import { useEditorRef, createPlatePlugin } from 'platejs/react';
import { ImagePlugin } from '@platejs/media/react';
import { ElementApi } from 'platejs';
import { Editor, Transforms, Path } from 'slate';
import SignatureCanvas from 'react-signature-canvas';

// Context for signature pad modal
const SignaturePadContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

export const SignaturePadProvider = ({
  children,
}: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const canvasRef = React.useRef<SignatureCanvas | null>(null);
  const editor = useEditorRef('main-editor');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const onClear = () => canvasRef.current?.clear();
  const onClose = () => setOpen(false);
  const onSave = async () => {
    const dataUrl =
      canvasRef.current?.getTrimmedCanvas().toDataURL('image/png') ?? '';
    if (!dataUrl) return;
    insertSignatureWithImageAtEnd(editor, dataUrl, 'signature');
    onClose();
  };

  const modalContent = open ? (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[9998] bg-black/50" onClick={onClose} />
      {/* Dialog */}
      <div
        className="fixed left-1/2 top-1/2 z-[9999] flex w-full max-w-sm -translate-x-1/2 -translate-y-1/2 flex-col bg-background p-4 shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-3 text-base font-semibold">Draw your signature</div>
        <div className="mb-4 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/10 p-3 flex items-center justify-center">
          <SignatureCanvas
            ref={canvasRef as any}
            penColor="#111827"
            clearOnResize={false}
            canvasProps={{ className: 'w-full h-48' }}
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
            onClick={onClear}
          >
            Clear
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="rounded-md border bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              onClick={onSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  ) : null;

  return (
    <SignaturePadContext.Provider value={{ open, setOpen }}>
      {children}
      {mounted &&
        typeof window !== 'undefined' &&
        createPortal(modalContent, document.body)}
    </SignaturePadContext.Provider>
  );
};

export const useSignaturePad = () => React.useContext(SignaturePadContext);

export const SIGNATURE_KEY = 'signature';

export type SignatureElementType = {
  type: typeof SIGNATURE_KEY;
  signerName?: string;
  signedAt?: string; // ISO date string
  note?: string; // optional note under the line
  imageSrc?: string; // optional uploaded/drawn signature image
  imageAlt?: string;
  children: [{ text: '' }];
};

// Note: We rely on component mapping to render this element type.
// In v52, we create plugins with createPlatePlugin and node configs
export const SignaturePlugin = createPlatePlugin({
  key: SIGNATURE_KEY,
  node: {
    isElement: true,
    isVoid: false,
  },
  options: {},
  plugins: [],
  handlers: {},
  // Deserialization config for HTML
  parsers: {
    html: {
      deserializer: {
        rules: [
          {
            validClassName: 'plate-signature',
          },
          {
            validNodeName: 'FIGURE',
          },
        ],
        query: (el: any) => {
          return el?.classList?.contains('plate-signature') ?? false;
        },
        parse: () => ({ type: SIGNATURE_KEY }),
      },
    },
  },
});

export function insertSignature(
  editor: ReturnType<typeof useEditorRef>,
  opts?: { signerName?: string; signedAt?: string; note?: string },
) {
  const now = new Date();
  const iso = now.toISOString();
  const node: SignatureElementType = {
    type: SIGNATURE_KEY,
    signerName: opts?.signerName ?? '',
    signedAt: opts?.signedAt ?? iso,
    note: opts?.note ?? '',
    imageSrc: '',
    imageAlt: 'signature',
    children: [{ text: '' }],
  };

  (editor as any).tf.insertNodes(node);
}

export function insertSignatureAtEnd(
  editor: ReturnType<typeof useEditorRef>,
  opts?: { signerName?: string; signedAt?: string; note?: string },
) {
  const now = new Date();
  const iso = now.toISOString();
  const node: SignatureElementType = {
    type: SIGNATURE_KEY,
    signerName: opts?.signerName ?? '',
    signedAt: opts?.signedAt ?? iso,
    note: opts?.note ?? '',
    imageSrc: '',
    imageAlt: 'signature',
    children: [{ text: '' }],
  };

  try {
    // Move selection to end of document and insert
    const endPoint = Editor.end(editor as any, []);
    Transforms.select(editor as any, endPoint);
  } catch {}

  (editor as any).tf.insertNodes(node);
}

export function insertSignatureAtEndAndReturnPath(
  editor: ReturnType<typeof useEditorRef>,
  opts?: { signerName?: string; signedAt?: string; note?: string },
): Path | null {
  const now = new Date();
  const iso = now.toISOString();
  const node: SignatureElementType = {
    type: SIGNATURE_KEY,
    signerName: opts?.signerName ?? '',
    signedAt: opts?.signedAt ?? iso,
    note: opts?.note ?? '',
    imageSrc: '',
    imageAlt: 'signature',
    children: [{ text: '' }],
  };

  const index = (editor as any).children?.length ?? 0;
  const path: Path = [index];
  try {
    Transforms.insertNodes(editor as any, node, { at: path });
    return path;
  } catch {
    try {
      const endPoint = Editor.end(editor as any, []);
      Transforms.select(editor as any, endPoint);
      (editor as any).tf.insertNodes(node);
      // Attempt to find last signature node path
      return [((editor as any).children?.length ?? 1) - 1];
    } catch {
      return null;
    }
  }
}

export function insertSignatureWithImageAtEnd(
  editor: ReturnType<typeof useEditorRef>,
  imageSrc: string,
  imageAlt = 'signature',
  opts?: { signerName?: string; signedAt?: string; note?: string },
): Path | null {
  // Use built-in Image element to avoid normalization issues
  const node: any = {
    type: ImagePlugin.key,
    url: imageSrc,
    alt: imageAlt,
    width: 20,
    align: 'left',
    children: [{ text: '' }],
  };

  const index = (editor as any).children?.length ?? 0;
  const path: Path = [index];
  try {
    Transforms.insertNodes(editor as any, node, { at: path });
    return path;
  } catch {
    try {
      const endPoint = Editor.end(editor as any, []);
      Transforms.select(editor as any, endPoint);
      (editor as any).tf.insertNodes(node);
      return [((editor as any).children?.length ?? 1) - 1];
    } catch {
      return null;
    }
  }
}

export function updateSignature(
  editor: ReturnType<typeof useEditorRef>,
  data: Partial<Pick<SignatureElementType, 'signerName' | 'signedAt' | 'note'>>,
) {
  const entry = (editor as any).api.block({
    match: (n: any) =>
      ElementApi.isElement(n) && n.type === SIGNATURE_KEY,
  });
  if (!entry) return;
  (editor as any).tf.setNodes(data, { at: entry[1] });
}

export async function setSignatureImage(
  editor: ReturnType<typeof useEditorRef>,
  imageSrc: string,
  imageAlt = 'signature',
) {
  const entry = (editor as any).api.block({
    match: (n: any) =>
      ElementApi.isElement(n) && n.type === SIGNATURE_KEY,
  });
  if (!entry) return;
  (editor as any).tf.setNodes({ imageSrc, imageAlt }, { at: entry[1] });
}

export async function setSignatureImageAtPath(
  editor: ReturnType<typeof useEditorRef>,
  at: Path,
  imageSrc: string,
  imageAlt = 'signature',
) {
  (editor as any).tf.setNodes({ imageSrc, imageAlt }, { at });
}

export const SignatureElement = ({
  attributes,
  children,
  element,
  className,
}: {
  attributes: any;
  children: any;
  element: SignatureElementType;
  className?: string;
}) => {
  const editor = useEditorRef();
  const signerName = element.signerName ?? '';
  const date = element.signedAt
    ? new Date(element.signedAt).toLocaleDateString()
    : '';
  const note = element.note ?? '';
  const imageSrc = element.imageSrc ?? '';
  const canvasRef = React.useRef<SignatureCanvas | null>(null);
  const [isDrawing, setIsDrawing] = React.useState(!imageSrc);

  const onClear = () => canvasRef.current?.clear();
  const onSave = async () => {
    const dataUrl = canvasRef.current?.toDataURL('image/png') ?? '';
    if (dataUrl) {
      insertSignatureWithImageAtEnd(editor, dataUrl, 'signature');
      setIsDrawing(false);
    }
  };
  const onStartDrawing = () => setIsDrawing(true);

  return (
    <figure
      {...attributes}
      contentEditable={false}
      className={cn(
        'plate-signature relative my-5 rounded-lg border border-dashed border-foreground/30 bg-background/60 px-5 py-4 shadow-sm backdrop-blur-sm',
        'ring-1 ring-inset ring-foreground/5',
        className,
      )}
      data-type={SIGNATURE_KEY}
      aria-label="Signature block"
    >
      {/* Label chip */}
      <div className="pointer-events-none absolute -top-3 left-4 select-none rounded-full border border-foreground/20 bg-muted px-2 py-0.5 text-xs font-medium text-foreground/80 shadow-sm">
        <span className="mr-1 inline-block align-middle">✍️</span>
        Signature
      </div>

      <div className="flex flex-col gap-3">
        {/* Visual area */}
        {imageSrc && !isDrawing ? (
          <div className="relative flex min-h-20 items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={element.imageAlt || 'signature'}
              className="max-h-24 w-auto select-none"
            />
            {/* E-signed seal */}
            <div className="pointer-events-none absolute -right-2 -top-2 rotate-6 select-none rounded-full border border-foreground/20 bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 shadow-sm">
              E-SIGNED
            </div>
          </div>
        ) : (
          <div className="relative flex flex-col gap-2">
            <div className="rounded border">
              <SignatureCanvas
                ref={canvasRef as any}
                penColor="#111827"
                clearOnResize={false}
                canvasProps={{ className: 'h-40 w-full' }}
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              {imageSrc ? (
                <button
                  type="button"
                  className="rounded border px-2 py-1 text-sm hover:bg-accent"
                  onClick={() => setIsDrawing(false)}
                >
                  Cancel
                </button>
              ) : null}
              <button
                type="button"
                className="rounded border px-2 py-1 text-sm hover:bg-accent"
                onClick={onClear}
              >
                Clear
              </button>
              <button
                type="button"
                className="rounded border bg-primary px-2 py-1 text-sm text-primary-foreground hover:opacity-90"
                onClick={onSave}
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Metadata row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            {note ? (
              <span className="rounded bg-muted/60 px-1.5 py-0.5 text-xs">
                {note}
              </span>
            ) : imageSrc && !isDrawing ? (
              <button
                type="button"
                className="rounded border px-1.5 py-0.5 text-xs hover:bg-accent"
                onClick={onStartDrawing}
              >
                Re-sign
              </button>
            ) : (
              <span className="opacity-60">—</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span
              className={cn(
                'min-w-24 truncate',
                signerName
                  ? 'font-serif italic text-base tracking-wide text-foreground'
                  : 'opacity-60',
              )}
            >
              {signerName || 'Name'}
            </span>
            <span className="opacity-70">{date || 'Date'}</span>
          </div>
        </div>
      </div>

      {/* Keep children to satisfy Slate structure */}
      <div contentEditable style={{ display: 'none' }}>
        {children}
      </div>
    </figure>
  );
};

export const SignatureToolbarButton = ({
  label = 'Signature',
  onInsert,
}: {
  label?: string;
  onInsert?: (editor: ReturnType<typeof useEditorRef>) => void;
}) => {
  const editor = useEditorRef();
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-accent',
      )}
      onClick={() => (onInsert ? onInsert(editor) : insertSignature(editor))}
    >
      {label}
    </button>
  );
};

export const SignatureUploadButton = ({
  label = 'Upload Signature',
}: {
  label?: string;
}) => {
  const editor = useEditorRef();

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const src = typeof reader.result === 'string' ? reader.result : '';
      if (src) await setSignatureImage(editor, src);
    };
    reader.readAsDataURL(file);
    // reset input so same file can be selected again if needed
    e.currentTarget.value = '';
  };

  return (
    <label
      className={cn(
        'inline-flex cursor-pointer items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-accent',
      )}
    >
      {label}
      <input
        type="file"
        accept="image/*"
        onChange={onPick}
        className="sr-only"
      />
    </label>
  );
};

export const SignatureDrawButton = ({
  label = 'Draw Signature',
}: {
  label?: string;
}) => {
  const editor = useEditorRef();
  const [open, setOpen] = React.useState(false);
  const canvasRef = React.useRef<SignatureCanvas | null>(null);

  const onSave = async () => {
    const dataUrl = canvasRef.current?.toDataURL('image/png') ?? '';
    if (dataUrl) await setSignatureImage(editor, dataUrl, 'signature');
    setOpen(false);
  };

  const onClear = () => canvasRef.current?.clear();

  return (
    <div className={cn('relative inline-block')}>
      <button
        type="button"
        className={cn(
          'inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-accent',
        )}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
      </button>

      {open ? (
        <div
          className={cn(
            'absolute z-50 mt-2 w-[340px] rounded-md border bg-background p-3 shadow-md',
          )}
        >
          <div className="mb-2 text-xs text-muted-foreground">
            Draw your signature
          </div>
          <div className="rounded border">
            <SignatureCanvas
              ref={canvasRef as any}
              penColor="#111827"
              clearOnResize={false}
              canvasProps={{ className: 'h-40 w-[320px]' }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between gap-2">
            <button
              type="button"
              className="rounded border px-2 py-1 text-sm hover:bg-accent"
              onClick={onClear}
            >
              Clear
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded border px-2 py-1 text-sm hover:bg-accent"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded border bg-primary px-2 py-1 text-sm text-primary-foreground hover:opacity-90"
                onClick={onSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export const SignaturePadToolbarButton = ({
  label = 'Signature',
}: {
  label?: string;
}) => {
  const { setOpen } = useSignaturePad();

  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-accent',
      )}
      onClick={() => setOpen(true)}
    >
      {label}
    </button>
  );
};
