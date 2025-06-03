/**
 * @file IssuesPage.tsx
 * Страница задач  — отображает список задач, позволяет искать, фильтровать,
 * создавать и редактировать задачи.
 *
 * @module pages/IssuesPage/IssuesPage
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Group,
  Stack,
  TextInput,
  Paper,
  Select,
  Popover,
} from '@mantine/core';
import { TaskForm } from '../../ui/TaskForm';
import { useDisclosure } from '@mantine/hooks';
import { useLocation } from 'react-router';
import type { Issue, Statuses } from '@/types';
import { setIssues, updateIssue } from '@/store/issues/issueSlice';
import { useAppSelector, useAppDispatch } from '@/hooks/hooks';
import { useGetAllTasksQuery, useUpdateTaskMutation } from '@/store/issues/issue';
import { useGetAllBoardsQuery } from '@/store/boards';

/**
 * Сопоставление статусов задач с их текстовыми метками.
 */

const STATUS_LABELS: Record<Statuses, string> = {
  Backlog: 'Backlog',
  InProgress: 'In Progress',
  Done: 'Done',
};

/**
 * Список доступных статусов для фильтрации.
 */

const STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));

/**
 * Компонент страницы задач.
 *
 * Позволяет пользователю:
 * - просматривать список задач;
 * - выполнять поиск по названию задачи или исполнителю;
 * - фильтровать задачи по статусу и проекту;
 * - создавать новые задачи и редактировать существующие.
 */

export const IssuesPage: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  /** Состояние отображения фильтров */
  const [filtersOpened, setFiltersOpened] = useState(false);

  /** Текущая выбранная задача (для редактирования) */
  const [selectedTask, setSelectedTask] = useState<Issue | null>(null);

  /** Строка поиска */
  const [search, setSearch] = useState('');

  /** Фильтр по статусу задачи */
  const [statusFilter, setStatusFilter] = useState<Statuses | null>(null);

  /** Фильтр по проекту (доске) */
  const [boardFilter, setBoardFilter] = useState<string | null>(null);

  /** Управление открытием/закрытием формы задачи */
  const [taskFormOpened, { open: openTaskForm, close: closeTaskForm }] =
    useDisclosure(false);

  /** Мутация для обновления задачи */
  const [updateTask] = useUpdateTaskMutation();

  /** Получение всех задач с API */
  const { data: apiIssues, refetch: refetchIssues } = useGetAllTasksQuery(undefined);

  /** Получение всех досок */
  const { data: boardsData } = useGetAllBoardsQuery('');

  /** Состояние задач из Redux */
  const issuesState = useAppSelector((state) => state.issues);

  /**
   * Обновляет список задач при изменении пути (URL).
   */
  useEffect(() => {
    refetchIssues();
  }, [location.pathname]);

  /**
   * Обновляет состояние задач в Redux после получения данных с API.
   */
  useEffect(() => {
    if (apiIssues?.data) {
      dispatch(setIssues(apiIssues.data));
    }
  }, [apiIssues, dispatch]);

  /**
   * Фильтрация задач по статусу, проекту и строке поиска.
   */
  const filtered = issuesState.issues?.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(search.toLowerCase()) ||
      issue.assignee?.fullName?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || issue.status === statusFilter;
    const matchesBoard = !boardFilter || String(issue.boardId) === boardFilter;
    return matchesSearch && matchesStatus && matchesBoard;
  });

  /**
   * Обновляет список задач из API и сохраняет в Redux.
   */
  async function updateIssues() {
    const { data } = await refetchIssues();
    if (data) {
      dispatch(setIssues(data.data));
    }
  }

  /**
   * Обрабатывает обновление задачи после редактирования.
   *
   * @param updatedTask Обновлённая задача
   */
  const handleTaskUpdate = async (updatedTask: Issue) => {
    try {
      await updateTask({ body: updatedTask, id: updatedTask.id }).unwrap();
      dispatch(updateIssue(updatedTask));
      closeTaskForm();
      setSelectedTask(null);
    } catch (error) {
      console.error('Ошибка при обновлении задачи:', error);
    }
  };

  return (
    <Box p="md">
      <Group align="flex-start" mb="md">
        <TextInput
          placeholder="Поиск"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          style={{ flex: 1 }}
        />

        <Popover
          opened={filtersOpened}
          onChange={setFiltersOpened}
          position="bottom-start"
          withArrow
          shadow="md"
        >
          <Popover.Target>
            <Button onClick={() => setFiltersOpened((o) => !o)}>Фильтры</Button>
          </Popover.Target>

          <Popover.Dropdown>
            <Stack>
              <Select
                placeholder="Статус"
                data={STATUS_OPTIONS}
                value={statusFilter}
                onChange={(value) => setStatusFilter(value as Statuses | null)}
                clearable
              />
              <Select
                placeholder="Проект"
                data={
                  boardsData?.data?.map((board) => ({
                    value: String(board.id),
                    label: board.name,
                  })) ?? []
                }
                value={boardFilter}
                onChange={setBoardFilter}
                clearable
              />
              <Button onClick={() => setFiltersOpened(false)}>Применить</Button>
            </Stack>
          </Popover.Dropdown>
        </Popover>
      </Group>

      <Stack>
        {filtered?.map((issue) => (
          <Paper
            key={issue.id}
            withBorder
            p="md"
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

      <Box mt="lg" ta="right">
        <Button onClick={openTaskForm}>Создать задачу</Button>
      </Box>

      <TaskForm
        opened={taskFormOpened}
        onCreate={() => updateIssues()}
        onUpdate={handleTaskUpdate}
        onClose={() => {
          closeTaskForm();
          setSelectedTask(null);
        }}
        mode={selectedTask ? 'edit' : 'create'}
        initialData={selectedTask || undefined}
        contextPage="issues"
      />
    </Box>
  );
};
