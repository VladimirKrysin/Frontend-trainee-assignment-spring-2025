/**
 * @file store.ts
 * @description Конфигурация Redux store с подключением RTK Query API и редьюсеров.
 */

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import issuesReducer from '@/store/issues/issueSlice';
import { taskApi, boardApi, usersApi } from '@/store/index';

/**
 * Основной Redux store приложения.
 * Включает редьюсеры RTK Query API (taskApi, usersApi, boardApi) и редьюсер задач (issuesReducer).
 */
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

// Подключение слушателей для автоматического обновления кеша и рефетчинга данных
setupListeners(store.dispatch);

/**
 * Тип состояния всего Redux store.
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Тип функции dispatch для Redux store.
 */
export type AppDispatch = typeof store.dispatch;
