import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Issue, FetchBodyWrapper } from '@/types';
import { BASE_URL } from '@/api';

interface TaskQueryArgs {
  body: Issue;
  id: number;
}

export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getAllTasks: builder.query<FetchBodyWrapper<Issue[]>, undefined>({
      query: () => '/tasks',
    }),
    getTask: builder.query<FetchBodyWrapper<Issue>, number>({
      query: (id) => `/tasks/${id}`,
    }),
    createTask: builder.mutation<FetchBodyWrapper<Issue>, Issue>({
      query: (body) => ({
        url: '/tasks/create',
        method: 'POST',
        body,
      }),
    }),
    updateTask: builder.mutation<FetchBodyWrapper<Issue>, TaskQueryArgs>({
      query: ({ body, id }) => ({
        url: `/tasks/update/${id}`,
        method: 'PUT',
        body,
      }),
    }),
    updateTaskStatus: builder.mutation<FetchBodyWrapper<Issue>, TaskQueryArgs>({
      query: ({ body, id }) => ({
        url: `/tasks/updateStatus/${id}`,
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const {
  useGetAllTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
} = taskApi;
