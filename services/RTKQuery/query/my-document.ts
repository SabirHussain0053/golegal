import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────
export interface DocumentContentNode {
  type?: string;
  children?: DocumentContentNode[];
  text?: string;
  url?: string;
  [key: string]: unknown;
}

export interface Document {
  id: string;
  title: string;
  type: string;
  status?: string;
  shareToken?: string;
  content?: DocumentContentNode[];
  createdAt: string;
  updatedAt: string;
}

interface GetMyDocumentsResponse {
  documents: Document[];
}

interface UpdateDocumentRequest {
  id: string;
  content: DocumentContentNode[];
}

// ──────────────────────────────────────────────────────────────────────────────
// API slice
// ──────────────────────────────────────────────────────────────────────────────
export const myDocumentApi = createApi({
  reducerPath: 'myDocumentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? '/api',
    prepareHeaders: (headers) => {
      if (typeof window !== 'undefined') {
        const token =
          localStorage.getItem('token') ??
          document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1];
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: ['Document'],
  endpoints: (builder) => ({
    // Fetch all documents for the authenticated user
    getMyDocuments: builder.query<GetMyDocumentsResponse, void>({
      query: () => '/documents/my-documents',
      providesTags: ['Document'],
    }),

    // Update a document's content
    updateDocument: builder.mutation<Document, UpdateDocumentRequest>({
      query: ({ id, content }) => ({
        url: `/documents/${id}`,
        method: 'PUT',
        body: { content },
      }),
      invalidatesTags: ['Document'],
    }),
  }),
});

export const { useGetMyDocumentsQuery, useUpdateDocumentMutation } =
  myDocumentApi;
