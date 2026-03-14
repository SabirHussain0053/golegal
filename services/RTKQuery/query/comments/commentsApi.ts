import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const commentsApi = createApi({
  reducerPath: 'commentsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getComments: builder.query({
      query: (documentId) => `/comments/${documentId}`,
    }),
    addComment: builder.mutation({
      query: (body) => ({
        url: '/comments',
        method: 'POST',
        body,
      }),
    }),
    resolveComment: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/comments/${id}/resolve`,
        method: 'PATCH',
        body,
      }),
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useAddCommentMutation,
  useResolveCommentMutation,
} = commentsApi;
