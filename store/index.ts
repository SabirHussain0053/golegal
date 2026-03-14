import { configureStore } from '@reduxjs/toolkit';
import { commentsApi } from '@/services/RTKQuery/query/comments/commentsApi';
import { docPreviewApi } from '@/services/RTKQuery/query/doc-preview/docPreview';
import { myDocumentApi } from '@/services/RTKQuery/query/my-document';

export const store = configureStore({
  reducer: {
    [commentsApi.reducerPath]: commentsApi.reducer,
    [docPreviewApi.reducerPath]: docPreviewApi.reducer,
    [myDocumentApi.reducerPath]: myDocumentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      commentsApi.middleware,
      docPreviewApi.middleware,
      myDocumentApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
