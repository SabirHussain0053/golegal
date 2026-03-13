'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  ArrowUpRight,
  MoreHorizontal,
  Loader2,
  FileSignature,
  FilePen,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useGetMyDocumentsQuery,
  type Document,
  type DocumentContentNode,
} from '@/services/RTKQuery/query/my-document';

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

/** Recursively checks whether a content tree contains a signature node. */
function hasSignatureNode(nodes: DocumentContentNode[]): boolean {
  for (const node of nodes) {
    if (node.type === 'signature') return true;
    if (node.children && hasSignatureNode(node.children)) return true;
  }
  return false;
}

/** Returns true if the document is classified as a "signature" document. */
function isSignatureDocument(doc: Document): boolean {
  if (doc.type?.toLowerCase().includes('signature')) return true;
  if (doc.content && hasSignatureNode(doc.content)) return true;
  return false;
}

// ──────────────────────────────────────────────────────────────────────────────
// Document Card
// ──────────────────────────────────────────────────────────────────────────────
function DocumentCard({
  doc,
  variant,
}: {
  doc: Document;
  variant: 'signature' | 'plate-editor';
}) {
  const isSignature = variant === 'signature';
  const previewHref = doc.shareToken
    ? `/preview-document/${doc.shareToken}`
    : '#';

  return (
    <Card className="relative bg-white rounded-lg p-4 space-y-2 hover:shadow-md transition-shadow">
      {/* Badge + open link */}
      <div className="flex items-center justify-between pb-2">
        <Badge
          className={
            isSignature
              ? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
              : 'bg-[#FFF2CF] text-yellow-900 hover:bg-[#FFF2CF]'
          }
        >
          {isSignature ? (
            <FileSignature className="w-3 h-3 mr-1 inline-block" />
          ) : (
            <FilePen className="w-3 h-3 mr-1 inline-block" />
          )}
          {isSignature ? 'Signature' : 'Plate Editor'}
        </Badge>
        <Link href={previewHref} className="cursor-pointer -mt-4 -mr-2">
          <ArrowUpRight className="w-6 h-6 text-gray-500 hover:text-gray-900" />
        </Link>
      </div>

      {/* Name */}
      <div className="space-y-0.5">
        <p className="text-[10px] text-[#444242]">Name</p>
        <h2 className="text-sm font-semibold text-gray-800 truncate">
          {doc.title || 'Untitled Document'}
        </h2>
      </div>

      {/* Type */}
      <div className="space-y-0.5">
        <p className="text-[10px] text-[#444242]">Type</p>
        <h2 className="text-sm font-semibold text-gray-800">{doc.type || '—'}</h2>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-[10px] text-black font-medium">
          {new Date(doc.updatedAt || doc.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </p>
        {doc.status && (
          <Badge
            variant="outline"
            className={
              doc.status === 'completed'
                ? 'text-green-700 border-green-300'
                : doc.status === 'pending'
                  ? 'text-amber-700 border-amber-300'
                  : 'text-gray-600 border-gray-300'
            }
          >
            {doc.status}
          </Badge>
        )}
        <MoreHorizontal className="w-4 h-4 text-gray-400" />
      </div>
    </Card>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Empty state
// ──────────────────────────────────────────────────────────────────────────────
function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
      <FileText className="w-12 h-12 mb-3 opacity-40" />
      <p className="text-sm font-medium">No {label} found</p>
      <p className="text-xs mt-1">Documents you create will appear here.</p>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Main Page
// ──────────────────────────────────────────────────────────────────────────────
export default function MyDocumentsPage() {
  const [search, setSearch] = useState('');

  const {
    data: documentsData,
    isLoading,
    isError,
  } = useGetMyDocumentsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const allDocuments: Document[] = documentsData?.documents ?? [];

  // Pre-compute signature classification once per document list update
  const { signatureDocs, plateEditorDocs } = useMemo(() => {
    const signature: Document[] = [];
    const plateEditor: Document[] = [];
    for (const doc of allDocuments) {
      if (isSignatureDocument(doc)) {
        signature.push(doc);
      } else {
        plateEditor.push(doc);
      }
    }
    return { signatureDocs: signature, plateEditorDocs: plateEditor };
  }, [allDocuments]);

  // Apply search filter
  const filterBySearch = (docs: Document[]) =>
    search.trim()
      ? docs.filter((d) =>
          (d.title ?? '').toLowerCase().includes(search.toLowerCase()),
        )
      : docs;

  const filteredSignatureDocs = filterBySearch(signatureDocs);
  const filteredPlateEditorDocs = filterBySearch(plateEditorDocs);
  const filteredAllDocs = filterBySearch(allDocuments);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
          <p className="text-sm text-gray-500 mt-1">
            View all your signature documents and plate editor documents in one
            place.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search documents…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>
      </div>

      {/* Loading / Error */}
      {isLoading && (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-3 text-gray-500">Loading documents…</p>
        </div>
      )}

      {isError && (
        <div className="flex items-center justify-center py-32">
          <p className="text-red-500">
            Failed to load documents. Please try again.
          </p>
        </div>
      )}

      {/* Tabs */}
      {!isLoading && !isError && (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6 bg-white border">
            <TabsTrigger value="all" className="gap-2">
              <FileText className="h-4 w-4" />
              All Documents
              <Badge variant="secondary" className="ml-1">
                {filteredAllDocs.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="signature" className="gap-2">
              <FileSignature className="h-4 w-4" />
              Signature Documents
              <Badge variant="secondary" className="ml-1">
                {filteredSignatureDocs.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="plate-editor" className="gap-2">
              <FilePen className="h-4 w-4" />
              Plate Editor Documents
              <Badge variant="secondary" className="ml-1">
                {filteredPlateEditorDocs.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* ── All Documents ── */}
          <TabsContent value="all">
            <div className="space-y-8">
              {/* Signature section */}
              {filteredSignatureDocs.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <FileSignature className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-800">
                      Signature Documents
                    </h2>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                      {filteredSignatureDocs.length}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredSignatureDocs.map((doc) => (
                      <DocumentCard key={doc.id} doc={doc} variant="signature" />
                    ))}
                  </div>
                </section>
              )}

              {/* Plate Editor section */}
              {filteredPlateEditorDocs.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <FilePen className="h-5 w-5 text-yellow-600" />
                    <h2 className="text-lg font-semibold text-gray-800">
                      Plate Editor Documents
                    </h2>
                    <Badge className="bg-[#FFF2CF] text-yellow-900 hover:bg-[#FFF2CF]">
                      {filteredPlateEditorDocs.length}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredPlateEditorDocs.map((doc) => (
                      <DocumentCard
                        key={doc.id}
                        doc={doc}
                        variant="plate-editor"
                      />
                    ))}
                  </div>
                </section>
              )}

              {filteredAllDocs.length === 0 && (
                <EmptyState label="documents" />
              )}
            </div>
          </TabsContent>

          {/* ── Signature Documents ── */}
          <TabsContent value="signature">
            {filteredSignatureDocs.length === 0 ? (
              <EmptyState label="signature documents" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredSignatureDocs.map((doc) => (
                  <DocumentCard key={doc.id} doc={doc} variant="signature" />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Plate Editor Documents ── */}
          <TabsContent value="plate-editor">
            {filteredPlateEditorDocs.length === 0 ? (
              <EmptyState label="plate editor documents" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredPlateEditorDocs.map((doc) => (
                  <DocumentCard key={doc.id} doc={doc} variant="plate-editor" />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
