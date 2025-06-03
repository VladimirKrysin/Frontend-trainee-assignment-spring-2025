/**
 * @file boardApi.ts
 * @description RTK Query API для работы с досками и задачами.
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Issue, FetchBodyWrapper, Board } from '@/types';
import { BASE_URL } from '@/api';

/**
 * @const boardApi
 * @description RTK Query API для получения списка досок и задач, относящихся к конкретной доске.
 */
export const boardApi = createApi({
  reducerPath: 'boardApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    /**
     * Получает все доски.
     * @returns {FetchBodyWrapper<Board[]>} Обёртка с массивом досок.
     */
    getAllBoards: builder.query<FetchBodyWrapper<Board[]>, string>({
      query: () => '/boards',
    }),

    /**
     * Получает задачи, относящиеся к конкретной доске.
     * @param {string} id - Идентификатор доски.
     * @returns {FetchBodyWrapper<Issue[]>} Обёртка с массивом задач.
     */
    getBoardTasks: builder.query<FetchBodyWrapper<Issue[]>, string>({
      query: (id) => `/boards/${id}`,
    }),
  }),
});

/**
 * Хуки для использования API-запросов в компонентах React.
 * @exports useGetAllBoardsQuery - Хук для получения всех досок.
 * @exports useGetBoardTasksQuery - Хук для получения задач по доске.
 */
export const { useGetAllBoardsQuery, useGetBoardTasksQuery } = boardApi;
