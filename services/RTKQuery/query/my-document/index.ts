import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const myDocumentApi = createApi({
  reducerPath: 'myDocumentApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    updateDocument: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/documents/${id}`,
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const { useUpdateDocumentMutation } = myDocumentApi;
