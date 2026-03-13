'use client';

import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

import { PlateEditor } from '@/components/editor/plate-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import {
  useAddCommentMutation,
  useGetCommentsQuery,
} from '@/services/RTKQuery/query/comments/commentsApi';
import { useGetPreviewQuery } from '@/services/RTKQuery/query/doc-preview/docPreview';

// Import for signature in preview
import {
  SignaturePadProvider,
  SignaturePadToolbarButton,
} from '@/components/editor/plugins/signature-plugin'; // Adjust path as needed
import { ToolbarGroup } from '@/components/plate-ui/toolbar';
import { useUpdateDocumentMutation } from '@/services/RTKQuery/query/my-document';
import toast from 'react-hot-toast';
import { useEditorRef } from 'platejs/react';

export default function PreviewDocumentPage() {
  const { token } = useParams();
  const router = useRouter();
  const [initialEditorContent, setInitialEditorContent] = useState(''); // Initial content only (no updates to avoid loops)
  const [isSaving, setIsSaving] = useState(false);
  const [updateDocument] = useUpdateDocumentMutation();

  // Editor ref to get current content on save
  const editor = useEditorRef('main-editor');

  // Debug: Log token
  console.log('Token:', token);

  // 1) Fetch the document via preview token
  const {
    data: previewData,
    isLoading: previewLoading,
    isError: previewError,
    error: previewErrorObj,
    refetch: refetchPreview, // Destructure refetch for manual refresh after save
  } = useGetPreviewQuery(token, {
    skip: !token,
    refetchOnMountOrArgChange: true, // Always refetch on mount/reload for fresh data
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  // Debug: Log previewData and message
  useEffect(() => {
    console.log('Preview Data:', previewData);
    if (previewData) {
      console.log('Share Message:', previewData.message);
      console.log('Owner Email:', previewData.ownerEmail);
    }
  }, [previewData]);

  // Set initial editor content (only once on load)
  useEffect(() => {
    if (previewData?.document?.content) {
      console.log(
        previewData?.document?.content,
        'previewData?.document?.contentpreviewData?.document?.content',
      );
      setInitialEditorContent(previewData.document.content);
    }
  }, [previewData]);

  // Handle save - pull content from editor ref (includes updates like signature)
  const handleSave = async () => {
    if (!editor) {
      toast.error('Editor not ready. Please try again.');
      return;
    }

    setIsSaving(true);
    try {
      const { id } = previewData.document;
      const currentContent = editor.children; // Updated content from editor
      console.log('Saving current content:', currentContent); // Debug: Check if signature is in here

      await updateDocument({
        id,
        content: currentContent,
      }).unwrap();

      // Refetch preview data to update UI with saved changes
      await refetchPreview();

      toast.success('Document saved successfully');
    } catch (error) {
      console.error('Failed to save document:', error);
      toast.error('Failed to save document. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Back button
  const handleBack = () => {
    router.push('/document/my-document');
  };

  // 2) Comments
  const documentId = previewData?.document?.id || '';

  const {
    data: commentsData,
    isLoading: commentsLoading,
    isError: commentsError,
    error: commentsErrorObj,
  } = useGetCommentsQuery(documentId, {
    skip: !documentId,
  });

  // Mutation to add a comment
  const [addComment, { isLoading: addingComment }] = useAddCommentMutation();
  const [newCommentText, setNewCommentText] = useState('');

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      await addComment({
        documentId,
        content: newCommentText.trim(),
        token,
      }).unwrap();
      setNewCommentText('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  // Early returns
  if (!token) {
    console.log('No token provided');
    return null;
  }

  if (previewLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-lg">Loading preview…</p>
      </div>
    );
  }

  if (previewError) {
    const msg =
      previewErrorObj?.data?.error ||
      'Unable to load preview. Token may be invalid or expired.';
    console.log('Preview Error:', msg, previewErrorObj);
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <p className="text-lg text-red-500">{msg}</p>
        {previewErrorObj?.data?.message && (
          <div className="mt-4 rounded-lg bg-blue-50 p-4 border border-blue-200">
            <p className="font-medium text-blue-900">
              Shared by {previewErrorObj.data.ownerEmail || 'the sharer'}:
            </p>
            <p className="text-blue-800 mt-1">{previewErrorObj.data.message}</p>
          </div>
        )}
      </div>
    );
  }

  if (!previewData || !previewData.document) {
    console.log('No preview data or document found');
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <p className="text-lg">Document not found</p>
      </div>
    );
  }

  const document = previewData.document;
  const shareMessage = previewData.message;
  const ownerEmail = previewData.ownerEmail;

  // Main layout
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left: Document Preview */}
      <div className="flex-1 p-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Button variant="outline" onClick={handleBack} className="mb-2">
              <FiArrowLeft className="mr-2" /> Back to Documents
            </Button>
            <h1 className="text-2xl font-bold">{document.title}</h1>
            <p className="text-sm text-gray-500">
              {document.type || 'Document'} • Last updated:{' '}
              {new Date(document.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FiSave className="mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {/* Share Message Banner */}
        {shareMessage ? (
          <div className="mb-4 rounded-lg bg-blue-50 p-4 border border-blue-200">
            <p className="font-medium text-blue-900">
              Shared by {ownerEmail || 'the sharer'}:
            </p>
            <p className="text-blue-800 mt-1">{shareMessage}</p>
          </div>
        ) : (
          <div className="mb-4 rounded-lg bg-gray-100 p-4 border border-gray-200">
            <p className="text-gray-600">No message provided by the sharer.</p>
          </div>
        )}

        {/* SignaturePadProvider wrapping both toolbar and editor */}
        <SignaturePadProvider>
          {/* Preview Toolbar - Only Signature Button */}
          <div className="mb-4 flex justify-center">
            <ToolbarGroup>
              <SignaturePadToolbarButton label="Signature" />
            </ToolbarGroup>
          </div>

          {/* Editor */}
          <div className="h-[calc(100vh-12rem)] overflow-auto rounded-lg border bg-white p-4 shadow-sm">
            {initialEditorContent ? (
              <PlateEditor
                id="main-editor" // Matches editor ref
                content={initialEditorContent} // Uncontrolled: no loop from updates
                onChange={() => {}} // No-op to satisfy internal Slate onChange requirement (prevents TypeError)
                readOnly={true} // Allows programmatic inserts (signature)
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No content available</p>
              </div>
            )}
          </div>
        </SignaturePadProvider>
      </div>

      {/* Right: Comments Sidebar */}
      <div className="w-1/3 border-l bg-white">
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold">Comments</h2>
            <p className="text-sm text-gray-500">
              Let us know what you think about this preview.
            </p>
          </div>

          {/* Comments List */}
          <ScrollArea className="flex-1 p-4">
            {commentsLoading ? (
              <p className="text-gray-500">Loading comments…</p>
            ) : commentsError ? (
              <p className="text-red-500">
                {commentsErrorObj?.data?.error || 'Failed to load comments.'}
              </p>
            ) : (
              <ul className="space-y-4">
                {commentsData?.comments?.length === 0 ? (
                  <p className="text-gray-500">No comments yet.</p>
                ) : (
                  commentsData.comments.map((c) => (
                    <Card key={c.id} className="w-full">
                      <CardContent className="space-y-1">
                        <p className="text-sm text-gray-700">{c.content}</p>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>{c.authorUser?.name || c.authorEmail}</span>
                          <span>{new Date(c.createdAt).toLocaleString()}</span>
                        </div>
                        {c.replies?.length > 0 && (
                          <ul className="mt-2 space-y-2 pl-4">
                            {c.replies.map((r) => (
                              <li key={r.id}>
                                <Card className="bg-gray-50">
                                  <CardContent className="space-y-1 p-2">
                                    <p className="text-sm text-gray-600">
                                      {r.content}
                                    </p>
                                    <div className="flex justify-between text-xs text-gray-400">
                                      <span>
                                        {r.authorUser?.name || r.authorEmail}
                                      </span>
                                      <span>
                                        {new Date(r.createdAt).toLocaleString()}
                                      </span>
                                    </div>
                                  </CardContent>
                                </Card>
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </ul>
            )}
          </ScrollArea>

          {/* Add New Comment Form */}
          <div className="border-t p-4">
            <form onSubmit={handleAddComment} className="flex flex-col gap-2">
              <Textarea
                placeholder="Type your comment..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                rows={3}
              />
              <Button
                type="submit"
                disabled={addingComment || newCommentText.trim() === ''}
              >
                {addingComment ? 'Submitting…' : 'Submit Comment'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
