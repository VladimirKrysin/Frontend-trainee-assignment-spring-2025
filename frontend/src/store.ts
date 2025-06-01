import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { taskApi, boardApi, usersApi } from '@/services';

export const store = configureStore({
  reducer: {
    [taskApi.reducerPath]: taskApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [boardApi.reducerPath]: boardApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      taskApi.middleware,
      boardApi.middleware,
      usersApi.middleware
    ),
});

setupListeners(store.dispatch);
