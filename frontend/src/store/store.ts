import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import issuesReducer from '@/store/issues/issueSlice';
import { taskApi, boardApi, usersApi } from '@/store/index';

export const store = configureStore({
  reducer: {
    [taskApi.reducerPath]: taskApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [boardApi.reducerPath]: boardApi.reducer,
    issues: issuesReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      taskApi.middleware,
      boardApi.middleware,
      usersApi.middleware
    ),
});

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
