import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  CreateFormPayload,
  FormAnalytics,
  FormSchema,
  FormSummary,
  ResponseRecord,
  AnswerValue,
} from '../../types';

// The backend wraps everything as { success, data } / { success, error }.
// We unwrap `data` on success; fetchBaseQuery surfaces the error body on failure.
type Envelope<T> = { success: true; data: T };

const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Forms', 'Form', 'Responses', 'Analytics'],
  endpoints: (build) => ({
    listForms: build.query<FormSummary[], void>({
      query: () => '/forms',
      transformResponse: (r: Envelope<FormSummary[]>) => r.data,
      providesTags: (result) =>
        result
          ? [...result.map((f) => ({ type: 'Form' as const, id: f.publicId })), { type: 'Forms' as const, id: 'LIST' }]
          : [{ type: 'Forms' as const, id: 'LIST' }],
    }),

    getForm: build.query<FormSchema, string>({
      query: (publicId) => `/forms/${publicId}`,
      transformResponse: (r: Envelope<FormSchema>) => r.data,
      providesTags: (_res, _err, publicId) => [{ type: 'Form', id: publicId }],
    }),

    createForm: build.mutation<FormSchema, CreateFormPayload>({
      query: (body) => ({ url: '/forms', method: 'POST', body }),
      transformResponse: (r: Envelope<FormSchema>) => r.data,
      invalidatesTags: [{ type: 'Forms', id: 'LIST' }],
    }),

    deleteForm: build.mutation<{ publicId: string }, string>({
      query: (publicId) => ({ url: `/forms/${publicId}`, method: 'DELETE' }),
      transformResponse: (r: Envelope<{ publicId: string }>) => r.data,
      invalidatesTags: [{ type: 'Forms', id: 'LIST' }],
    }),

    listResponses: build.query<ResponseRecord[], string>({
      query: (publicId) => `/forms/${publicId}/responses`,
      transformResponse: (r: Envelope<ResponseRecord[]>) => r.data,
      providesTags: (_res, _err, publicId) => [{ type: 'Responses', id: publicId }],
    }),

    submitResponse: build.mutation<
      ResponseRecord,
      { publicId: string; answers: Record<string, AnswerValue> }
    >({
      query: ({ publicId, answers }) => ({
        url: `/forms/${publicId}/responses`,
        method: 'POST',
        body: { answers },
      }),
      transformResponse: (r: Envelope<ResponseRecord>) => r.data,
      invalidatesTags: (_res, _err, { publicId }) => [
        { type: 'Responses', id: publicId },
        { type: 'Analytics', id: publicId },
      ],
    }),

    getAnalytics: build.query<FormAnalytics, string>({
      query: (publicId) => `/forms/${publicId}/analytics`,
      transformResponse: (r: Envelope<FormAnalytics>) => r.data,
      providesTags: (_res, _err, publicId) => [{ type: 'Analytics', id: publicId }],
    }),
  }),
});

export const {
  useListFormsQuery,
  useGetFormQuery,
  useCreateFormMutation,
  useDeleteFormMutation,
  useListResponsesQuery,
  useSubmitResponseMutation,
  useGetAnalyticsQuery,
} = api;
