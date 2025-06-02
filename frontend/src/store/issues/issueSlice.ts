import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Issue } from '@/types';

interface IssuesState {
  issues: Issue[];
  loading: boolean;
  error: string | null;
}

const initialState: IssuesState = {
  issues: [],
  loading: false,
  error: null,
};

const IssuesSlice = createSlice({
  name: 'Issues',
  initialState,
  reducers: {
    setIssues: (state, action: PayloadAction<Issue[]>) => {
      state.issues = action.payload;
    },
    addIssue: (state, action: PayloadAction<Issue>) => {
      state.issues.push(action.payload);
    },
    updateIssue: (state, action: PayloadAction<Issue>) => {
      const index = state.issues.findIndex((issue) => issue.id === action.payload.id);
      if (index !== -1) {
        state.issues[index] = action.payload;
      }
    },
  },
});

export const { setIssues, addIssue, updateIssue } = IssuesSlice.actions;
export default IssuesSlice.reducer;
