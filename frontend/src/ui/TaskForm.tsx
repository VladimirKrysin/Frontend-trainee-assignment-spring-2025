/**
 * @file TaskForm.tsx
 * @description Компонент формы для создания и редактирования задачи.
 *
 * Функциональность:
 * - Поддерживает режимы создания ('create') и редактирования ('edit').
 * - Загружает список проектов (досок) и пользователей (исполнителей) из API.
 * - Управляет локальным состоянием формы: название, описание, проект, приоритет, статус, исполнитель.
 * - В режиме редактирования подгружает данные из переданной задачи.
 * - При отправке формы создает или обновляет задачу через API.
 * - Позволяет навигацию на доску с задачей из режима редактирования.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Modal, TextInput, Select, Textarea, Button, Group, Stack } from '@mantine/core';
import type { Priorities, Statuses, Issue } from '@/types.ts';
import { useGetAllUsersQuery } from '@/store/users';
import { useGetAllBoardsQuery } from '@/store/boards';
import { useCreateTaskMutation, useUpdateTaskMutation } from '@/store/issues/issue';

type TaskFormData = {
  title: string;
  description: string;
  boardId: number;
  priority: Priorities;
  status: Statuses;
  assigneeId: number | null;
};

type TaskFormProps = {
  opened: boolean; // Управление видимостью модального окна
  onUpdate: (updatedTask: Issue) => void; // Колбек после обновления задачи
  onCreate: () => void; // Колбек после создания задачи
  onClose: () => void; // Колбек закрытия формы
  initialData?: Issue; // Исходные данные для редактирования
  mode: 'create' | 'edit'; // Режим работы формы
  currentBoardId?: number; // Идентификатор текущей доски (если открыт из доски)
  contextPage?: 'board' | 'issues'; // Контекст вызова формы для условного рендера
};

export const TaskForm: React.FC<TaskFormProps> = ({
  opened,
  onUpdate,
  onClose,
  onCreate,
  initialData,
  mode,
  currentBoardId,
  contextPage,
}) => {
  const navigate = useNavigate();

  // Мутации для создания и обновления задачи
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  // Локальное состояние формы
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [localBoardId, setLocalBoardId] = useState<number | null>(
    currentBoardId ?? initialData?.boardId ?? null
  );
  const [priority, setPriority] = useState<Priorities>(initialData?.priority || 'Low');
  const [status, setStatus] = useState<Statuses>(initialData?.status || 'Backlog');
  const [assigneeId, setAssigneeId] = useState<number | null>(
    initialData?.assignee.id || null
  );
  const [loading, setLoading] = useState(false);

  // Данные досок и пользователей из API
  const { data: boardsData } = useGetAllBoardsQuery('');
  const boards = boardsData?.data ?? [];

  const { data: assigneesData } = useGetAllUsersQuery(undefined);
  const assignees = assigneesData?.data ?? [];

  /**
   * Обработчик отправки формы
   * В режиме создания вызывает createTask, в режиме редактирования — updateTask.
   * При успешном сохранении вызывает колбеки onCreate или onUpdate.
   */
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const boardId = localBoardId ?? initialData?.boardId;
      if (!boardId) throw new Error('Board ID is required');

      const board = boards.find((b) => b.id === boardId);
      if (!board && !initialData?.boardName) throw new Error('Board not found');

      const formData: TaskFormData = {
        title,
        description,
        status,
        priority,
        boardId,
        assigneeId,
      };

      if (mode === 'create') {
        await createTask(formData).unwrap();
        onClose();
        onCreate();
      } else {
        // Подготовка обновленных данных задачи
        const updateData: Issue = {
          ...initialData!,
          ...formData,
          boardName: board?.name || initialData?.boardName || '',
          assignee: assigneeId
            ? assignees.find((a) => a.id === assigneeId)!
            : initialData!.assignee,
        };

        await updateTask({
          body: updateData,
          id: initialData!.id,
        }).unwrap();

        onUpdate(updateData);
        onClose();
      }
    } catch (err) {
      console.error('Error saving task:', err);
    } finally {
      setLoading(false);
    }
  };

  // Обработчик выбора исполнителя (преобразует строку в число или null)
  const handleAssigneeChange = (value: string | null) => {
    if (!value) {
      setAssigneeId(null);
    } else {
      const selectedId = parseInt(value, 10);
      setAssigneeId(selectedId);
    }
  };

  // При открытии формы подгружает данные initialData или сбрасывает форму для создания
  useEffect(() => {
    if (initialData && opened) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setLocalBoardId(initialData.boardId ?? currentBoardId ?? null);
      setPriority(initialData.priority);
      setStatus(initialData.status);
      setAssigneeId(initialData.assignee.id ?? null);
    } else if (!initialData && opened) {
      setTitle('');
      setDescription('');
      setLocalBoardId(currentBoardId ?? null);
      setPriority('Low');
      setStatus('Backlog');
      setAssigneeId(null);
    }
  }, [initialData, opened, currentBoardId]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={mode === 'create' ? 'Создание задачи' : 'Редактирование задачи'}
      size="lg"
      styles={{ root: { width: '100vw' } }}
    >
      <Stack>
        <TextInput
          label="Название"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          required
        />

        <Textarea
          label="Описание"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          minRows={3}
          required
        />

        {/* Выбор проекта (доски), если не указан текущий контекст доски */}
        {!currentBoardId && (
          <Select
            label="Проект"
            placeholder="Выберите проект"
            data={boards.map((board) => ({
              value: String(board.id),
              label: board.name,
            }))}
            value={localBoardId !== null ? String(localBoardId) : null}
            onChange={(value) => {
              setLocalBoardId(value ? parseInt(value, 10) : null);
            }}
            required
          />
        )}

        {/* Отображение названия проекта, если открыт из контекста доски */}
        {contextPage === 'board' &&
          typeof localBoardId === 'number' &&
          !isNaN(localBoardId) && (
            <TextInput
              label="Проект"
              value={boards.find((b) => b.id === localBoardId)?.name ?? ''}
              disabled
            />
          )}

        <Select
          label="Приоритет"
          value={priority}
          onChange={(priority) => {
            setPriority(priority as Priorities);
          }}
          data={[
            { value: 'Low', label: 'Low' },
            { value: 'Medium', label: 'Medium' },
            { value: 'High', label: 'High' },
          ]}
          required
        />

        <Select
          label="Статус"
          value={status}
          onChange={(value) => {
            setStatus(value as Statuses);
          }}
          data={[
            { value: 'Backlog', label: 'Backlog' },
            { value: 'InProgress', label: 'In Progress' },
            { value: 'Done', label: 'Done' },
          ]}
        />

        <Select
          label="Исполнитель"
          value={assigneeId !== null ? assigneeId.toString() : null}
          onChange={handleAssigneeChange}
          data={assignees.map((assignee) => ({
            value: assignee.id.toString(),
            label: assignee.fullName,
          }))}
          placeholder="Выберите исполнителя"
          clearable
          required
        />

        <Group justify="space-between" mt="md">
          {/* Кнопка перехода на доску с задачей, если мы в контексте issues */}
          {contextPage === 'issues' && initialData?.boardId && (
            <Button
              onClick={() => {
                navigate(`/boards/${initialData.boardId}?taskId=${initialData.id}`);
              }}
            >
              Перейти на доску
            </Button>
          )}
          <Group>
            <Button onClick={onClose} variant="default">
              Отмена
            </Button>
            <Button onClick={handleSubmit} loading={loading}>
              {mode === 'create' ? 'Создать' : 'Обновить'}
            </Button>
          </Group>
        </Group>
      </Stack>
    </Modal>
  );
};
