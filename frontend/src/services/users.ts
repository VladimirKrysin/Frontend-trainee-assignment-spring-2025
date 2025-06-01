import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Assignee, FetchBodyWrapper } from '@/types';
import { BASE_URL } from '@/api';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getAllUsers: builder.query<FetchBodyWrapper<Assignee[]>, undefined>({
      query: () => '/users',
    }),
  }),
});

export const { useGetAllUsersQuery } = usersApi;
