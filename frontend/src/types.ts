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
  status: string;
  priority: string;
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

export type { Issue, Assignee, FetchBodyWrapper, Board };
