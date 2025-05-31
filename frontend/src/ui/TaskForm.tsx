import React, { useEffect, useState } from 'react';
import {
  Modal,
  TextInput,
  Select,
  Textarea,
  Button,
  Group,
  Stack,
} from '@mantine/core';
import { api } from '../api.ts';

type Assignee = {
  avatarUrl: string;
  email: string;
  fullName: string;
  id: number;
};

type TaskFormProps = {
  opened: boolean;
  onClose: () => void;
  initialData?: {
    id?: number;
    title: string;
    description: string;
    boardId?: number;
    priority: string;
    status: string;
    assigneeId?: number;
  };
  mode: 'create' | 'edit';
  // Добавляем новый проп для явной передачи ID доски
  currentBoardId?: number;
};

export const TaskForm: React.FC<TaskFormProps> = ({
  opened,
  onClose,
  initialData,
  mode,
  currentBoardId, // Новый проп
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(
    initialData?.description || ''
  );
  const [priority, setPriority] = useState(initialData?.priority || '');
  const [status, setStatus] = useState(initialData?.status || '');
  const [assigneeId, setAssigneeId] = useState<number | null>(
    initialData?.assigneeId || null
  );
  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [loading, setLoading] = useState(false);

  // Определяем boardId для задачи
  const boardId = currentBoardId ?? initialData?.boardId;

  // Загрузка доступных исполнителей
  useEffect(() => {
    api
      .get('/users')
      .then((res) => setAssignees(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const taskData = {
        title,
        description,
        priority,
        status,
        assigneeId,
        boardId: boardId || undefined,
      };

      if (mode === 'create') {
        await api.post('/tasks', taskData);
      } else if (initialData?.id) {
        await api.put(`/tasks/${initialData.id}`, taskData);
      }

      onClose();
      // Можно добавить callback для обновления списка задач
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={mode === 'create' ? 'Создание задачи' : 'Редактирование задачи'}
      size="lg"
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
        />

        {/* Отображаем проект только если он известен */}
        {boardId && (
          <TextInput label="Проект" value={`Доска #${boardId}`} disabled />
        )}

        <Select
          label="Приоритет"
          value={priority}
          onChange={(value) => setPriority(value || '')}
          data={[
            { value: 'low', label: 'Низкий' },
            { value: 'medium', label: 'Средний' },
            { value: 'high', label: 'Высокий' },
          ]}
          required
        />

        <Select
          label="Статус"
          value={status}
          onChange={(value) => setStatus(value || '')}
          data={[
            { value: 'todo', label: 'To Do' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'done', label: 'Done' },
          ]}
          required
        />

        <Select
          label="Исполнитель"
          value={assigneeId?.toString() || ''}
          onChange={(value) => setAssigneeId(value ? parseInt(value) : null)}
          data={assignees.map((assignee) => ({
            value: assignee.id.toString(),
            label: assignee.fullName,
          }))}
          clearable
        />

        {/* Кнопка перехода на доску: показываем только когда: */}
        {/* - Форма открыта не со страницы доски (!currentBoardId) */}
        {/* - Задача уже привязана к доске (initialData?.boardId) */}
        {!currentBoardId && initialData?.boardId && (
          <Button
            variant="outline"
            component="a"
            href={`/boards/${initialData.boardId}`}
          >
            Перейти на доску
          </Button>
        )}

        <Group justify="flex-end" mt="md">
          <Button onClick={onClose} variant="default">
            Отмена
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            {mode === 'create' ? 'Создать' : 'Обновить'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
