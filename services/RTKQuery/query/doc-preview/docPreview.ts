import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const docPreviewApi = createApi({
  reducerPath: 'docPreviewApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getPreview: builder.query({
      query: (token) => `/preview/${token}`,
    }),
  }),
});

export const { useGetPreviewQuery } = docPreviewApi;
