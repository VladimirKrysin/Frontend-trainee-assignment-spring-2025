import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Issue, FetchBodyWrapper, Board } from '@/types';
import { BASE_URL } from '@/api';

export const boardApi = createApi({
  reducerPath: 'boardApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getAllBoards: builder.query<FetchBodyWrapper<Board[]>, string>({
      query: () => '/boards',
    }),
    getBoardTasks: builder.query<FetchBodyWrapper<Issue[]>, string>({
      query: (id) => `/boards/${id}`,
    }),
  }),
});

export const { useGetAllBoardsQuery, useGetBoardTasksQuery } = boardApi;
