/**
 * @file Компонент доски задач (Kanban-доска)
 * Отображает задачи в виде колонок по статусам (Backlog, In Progress, Done)
 * Позволяет просматривать и редактировать задачи через модальное окно TaskForm
 *
 * @module pages/Board/Board
 */

import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router';
import { Box, Group, Stack, Paper, Title } from '@mantine/core';
import type { Issue, Statuses } from '@/types';
import { useDisclosure } from '@mantine/hooks';
import { useUpdateTaskMutation } from '@/store/issues/issue';
import { useGetBoardTasksQuery } from '@/store/boards';
import { TaskForm } from '../../ui/TaskForm';

/**
 * Тип, описывающий структуру колонки на доске задач
 * @property {string} id - Уникальный идентификатор колонки
 * @property {string} title - Отображаемое название колонки
 * @property {Issue[]} issues - Массив задач, принадлежащих этой колонке
 */
type Column = {
  id: string;
  title: string;
  issues: Issue[];
};

/**
 * Маппинг статусов задач на читаемые названия
 * @constant {Record<Statuses, string>}
 */
const STATUS_LABELS: Record<Statuses, string> = {
  Backlog: 'Backlog',
  InProgress: 'In Progress',
  Done: 'Done',
};

/**
 * Доступные статусы задач
 * @constant {Statuses[]}
 */
const STATUSES: Statuses[] = ['Backlog', 'InProgress', 'Done'];

/**
 * Основной компонент доски задач
 * @component
 * @returns {React.ReactElement} Компонент доски с колонками задач и модальным окном редактирования
 *
 * @example
 * <Board />
 */
export const Board: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get('taskId');
  const [taskFormOpened, { open: openTaskForm, close: closeTaskForm }] =
    useDisclosure(false);
  const [updateTask] = useUpdateTaskMutation();

  const { id } = useParams<{ id: string }>();
  const [columns, setColumns] = useState<Column[]>([]);
  const [selectedTask, setSelectedTask] = useState<Issue | null>(null);

  const boardName = location.state?.boardName || '';
  const boardId = id ? parseInt(id, 10) : undefined;

  /**
   * Данные задач с сервера и метод для их перезагрузки
   * @type {Object}
   * @property {Object} data - Ответ сервера с задачами
   * @property {Function} refetch - Функция для повторного запроса задач
   */
  const { data: issues, refetch: refetchIssues } = useGetBoardTasksQuery(id ?? '');

  /**
   * Эффект для открытия формы редактирования при наличии taskId в URL
   * @effect
   * @listens taskId, issues
   */
  useEffect(() => {
    if (taskId && issues?.data?.length) {
      const foundTask = issues.data.find((task: Issue) => task.id === Number(taskId));
      if (foundTask) {
        setSelectedTask(foundTask);
        openTaskForm();
      }
    }
  }, [taskId, issues]);

  /**
   * Эффект для формирования колонок задач по статусам
   * @effect
   * @listens issues
   */
  useEffect(() => {
    if (issues) {
      const dynamicColumns = STATUSES.map((status) => ({
        id: status,
        title: status,
        issues: issues.data.filter((issue: Issue) => issue.status === status),
      }));
      setColumns(dynamicColumns);
    }
  }, [issues]);

  /**
   * Обработчик обновления задачи
   * @async
   * @function handleTaskUpdate
   * @param {Issue} updatedTask - Обновленные данные задачи
   */
  async function handleTaskUpdate(updatedTask: Issue) {
    try {
      await updateTask({ body: updatedTask, id: updatedTask.id }).unwrap();
      refetchIssues();
      closeTaskForm();
      setSelectedTask(null);
    } catch (error) {
      console.error('Ошибка при обновлении задачи:', error);
    }
  }

  return (
    <Box p="md">
      <Title order={2} mb="md">
        {boardName}
      </Title>

      <Group align="stretch" grow style={{ gap: '16px', alignItems: 'stretch' }}>
        {columns.map((column) => (
          <Paper
            key={column.id}
            withBorder
            p="md"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100%',
            }}
          >
            <Title order={4} mb="md">
              {STATUS_LABELS[column.title as Statuses] ?? column.title}
            </Title>
            <Stack style={{ flexGrow: 1 }}>
              {column.issues.map((issue) => (
                <Paper
                  key={issue.id}
                  withBorder
                  p="sm"
                  shadow="sm"
                  onClick={() => {
                    setSelectedTask(issue);
                    openTaskForm();
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {issue.title}
                </Paper>
              ))}
            </Stack>
          </Paper>
        ))}
      </Group>

      <TaskForm
        onCreate={() => null}
        opened={taskFormOpened}
        onClose={() => {
          closeTaskForm();
          setSelectedTask(null);
        }}
        onUpdate={handleTaskUpdate}
        initialData={selectedTask || undefined}
        mode={selectedTask ? 'edit' : 'create'}
        currentBoardId={boardId}
        contextPage="board"
      />
    </Box>
  );
};
