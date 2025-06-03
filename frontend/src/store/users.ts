/**
 * @file users.ts
 * @description RTK Query API для работы с данными пользователей (Assignee).
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Assignee, FetchBodyWrapper } from '@/types';
import { BASE_URL } from '@/api';

/**
 * usersApi — RTK Query API для получения списка пользователей.
 */
export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    /**
     * Запрос для получения всех пользователей.
     * @returns {FetchBodyWrapper<Assignee[]>} Обертка с массивом пользователей.
     */
    getAllUsers: builder.query<FetchBodyWrapper<Assignee[]>, undefined>({
      query: () => '/users',
    }),
  }),
});

export const { useGetAllUsersQuery } = usersApi;
