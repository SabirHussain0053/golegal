'use client';

import dynamic from 'next/dynamic';

const PlateEditor = dynamic(
  () =>
    import('@/components/editor/plate-editor').then((mod) => ({
      default: mod.PlateEditor,
    })),
  { ssr: false, loading: () => <EditorSkeleton /> }
);

function EditorSkeleton() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-muted-foreground">Loading editor…</div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="mx-auto h-screen max-w-[900px]">
      <PlateEditor />
    </main>
  );
}
