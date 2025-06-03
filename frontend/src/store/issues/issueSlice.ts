/**
 * @file issuesSlice.ts
 * @description Redux slice для управления локальным состоянием задач (issues).
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Issue } from '@/types';

/**
 * @interface IssuesState
 * @description Состояние задач в Redux store.
 * @property {Issue[]} issues - Список задач.
 * @property {boolean} loading - Флаг загрузки.
 * @property {string | null} error - Сообщение об ошибке (если есть).
 */
interface IssuesState {
  issues: Issue[];
  loading: boolean;
  error: string | null;
}

/**
 * @const initialState
 * @description Начальное состояние задач.
 */
const initialState: IssuesState = {
  issues: [],
  loading: false,
  error: null,
};

/**
 * @const IssuesSlice
 * @description Redux slice для управления задачами.
 * Включает редьюсеры для установки списка задач, добавления новой и обновления существующей.
 */
const IssuesSlice = createSlice({
  name: 'Issues',
  initialState,
  reducers: {
    /**
     * Устанавливает список задач.
     * @param {IssuesState} state - Текущее состояние.
     * @param {PayloadAction<Issue[]>} action - Список задач.
     */
    setIssues: (state, action: PayloadAction<Issue[]>) => {
      state.issues = action.payload;
    },

    /**
     * Добавляет новую задачу в список.
     * @param {IssuesState} state - Текущее состояние.
     * @param {PayloadAction<Issue>} action - Новая задача.
     */
    addIssue: (state, action: PayloadAction<Issue>) => {
      state.issues.push(action.payload);
    },

    /**
     * Обновляет существующую задачу по её ID.
     * @param {IssuesState} state - Текущее состояние.
     * @param {PayloadAction<Issue>} action - Обновлённая задача.
     */
    updateIssue: (state, action: PayloadAction<Issue>) => {
      const index = state.issues.findIndex((issue) => issue.id === action.payload.id);
      if (index !== -1) {
        state.issues[index] = action.payload;
      }
    },
  },
});

/**
 * @exports Редьюсеры для управления задачами.
 */
export const { setIssues, addIssue, updateIssue } = IssuesSlice.actions;

/**
 * @exports Редьюсер задач по умолчанию.
 */
export default IssuesSlice.reducer;
