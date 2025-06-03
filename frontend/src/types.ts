/**
 * Обёртка для тела ответа API, содержащая данные типа T.
 * @template T - Тип данных внутри обёртки.
 */
interface FetchBodyWrapper<T> {
  /** Данные ответа */
  data: T;
}

/**
 * Тип данных для исполнителя задачи.
 */
type Assignee = {
  /** URL аватара исполнителя */
  avatarUrl: string;
  /** Электронная почта исполнителя */
  email: string;
  /** Полное имя исполнителя */
  fullName: string;
  /** Уникальный идентификатор исполнителя */
  id: number;
};

/**
 * Тип данных задачи (Issue).
 */
type Issue = {
  /** Уникальный идентификатор задачи */
  id: number;
  /** Заголовок задачи */
  title: string;
  /** Описание задачи */
  description: string;
  /** Статус задачи */
  status: Statuses;
  /** Приоритет задачи */
  priority: Priorities;
  /** Идентификатор доски (проекта), к которой относится задача */
  boardId: number;
  /** Название доски */
  boardName: string;
  /** Исполнитель задачи */
  assignee: Assignee;
};

/**
 * Тип данных доски (проекта).
 */
type Board = {
  /** Уникальный идентификатор доски */
  id: number;
  /** Название доски */
  name: string;
  /** Описание доски */
  description: string;
  /** Количество задач на доске */
  taskCount: number;
};

/**
 * Типы статусов задачи.
 */
type Statuses = 'Backlog' | 'InProgress' | 'Done';

/**
 * Типы приоритетов задачи.
 */
type Priorities = 'Low' | 'Medium' | 'High';

export type { Issue, Assignee, FetchBodyWrapper, Board, Statuses, Priorities };
