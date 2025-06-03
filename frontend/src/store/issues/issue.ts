/**
 * @file issue.ts
 * @description RTK Query API для работы с задачами (issues).
 * Включает запросы на получение, создание и обновление задач.
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Issue, FetchBodyWrapper, Priorities, Statuses } from '@/types';
import { BASE_URL } from '@/api';

/**
 * @interface TaskQueryArgs
 * @description Аргументы для мутаций обновления задач.
 * @property {Issue} body - Объект задачи.
 * @property {number} id - Идентификатор задачи.
 */
interface TaskQueryArgs {
  body: Issue;
  id: number;
}

/**
 * @interface IssueCreateBody
 * @description Структура тела запроса для создания новой задачи.
 */
interface IssueCreateBody {
  title: string;
  description: string;
  boardId: number;
  priority: Priorities;
  status: Statuses;
  assigneeId: number | null;
}

/**
 * @const taskApi
 * @description RTK Query API-сервис для работы с задачами (issues).
 */
export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    /**
     * Получение всех задач.
     */
    getAllTasks: builder.query<FetchBodyWrapper<Issue[]>, undefined>({
      query: () => '/tasks',
    }),

    /**
     * Получение задачи по ID.
     * @param {number} id - Идентификатор задачи.
     */
    getTask: builder.query<FetchBodyWrapper<Issue>, number>({
      query: (id) => `/tasks/${id}`,
    }),

    /**
     * Создание новой задачи.
     * @param {IssueCreateBody} body - Данные новой задачи.
     */
    createTask: builder.mutation<FetchBodyWrapper<Issue>, IssueCreateBody>({
      query: (body) => ({
        url: '/tasks/create',
        method: 'POST',
        body,
      }),
    }),

    /**
     * Обновление существующей задачи.
     * @param {TaskQueryArgs} - Объект с телом задачи и её ID.
     */
    updateTask: builder.mutation<FetchBodyWrapper<Issue>, TaskQueryArgs>({
      query: ({ body, id }) => ({
        url: `/tasks/update/${id}`,
        method: 'PUT',
        body,
      }),
    }),

    /**
     * Обновление только статуса задачи.
     * @param {TaskQueryArgs} - Объект с телом задачи и её ID.
     */
    updateTaskStatus: builder.mutation<FetchBodyWrapper<Issue>, TaskQueryArgs>({
      query: ({ body, id }) => ({
        url: `/tasks/updateStatus/${id}`,
        method: 'PUT',
        body,
      }),
    }),
  }),
});

/**
 * Хуки для взаимодействия с API задач.
 */
export const {
  useGetAllTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
} = taskApi;
