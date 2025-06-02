interface FetchBodyWrapper<T> {
  data: T;
}

type Assignee = {
  avatarUrl: string;
  email: string;
  fullName: string;
  id: number;
};

type Issue = {
  id: number;
  title: string;
  description: string;
  status: Statuses;
  priority: Priorities;
  boardId: number;
  boardName: string;
  assignee: Assignee;
};

type Board = {
  id: number;
  name: string;
  description: string;
  taskCount: number;
};

type Statuses = 'Backlog' | 'InProgress' | 'Done';
type Priorities = 'Low' | 'Medium' | 'High';

export type { Issue, Assignee, FetchBodyWrapper, Board, Statuses, Priorities };
