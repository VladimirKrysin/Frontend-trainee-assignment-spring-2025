import React, { useEffect, useState } from 'react';
import { Modal, TextInput, Select, Textarea, Button, Group, Stack } from '@mantine/core';
import { api } from '@/api.ts';
import type { Assignee } from '@/types.ts';

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
  currentBoardId?: number;
  contextPage?: 'board' | 'issues';
};

export const TaskForm: React.FC<TaskFormProps> = ({
  opened,
  onClose,
  initialData,
  mode,
  currentBoardId,
  contextPage,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [priority, setPriority] = useState(initialData?.priority || '');
  const [status, setStatus] = useState(initialData?.status || '');
  const [assigneeId, setAssigneeId] = useState<number | null>(
    initialData?.assigneeId || null
  );
  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [loading, setLoading] = useState(false);

  const boardId = currentBoardId ?? initialData?.boardId;

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
        />

        {contextPage === 'board' && boardId && (
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

        {contextPage === 'issues' && initialData?.boardId && (
          <Button variant="outline" component="a" href={`/boards/${initialData.boardId}`}>
            Перейти на доску
          </Button>
        )}

        <Group justify="flex-end" mt="md">
          <Button onClick={onClose} variant="default">
            Отмена
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            {mode === 'create' ? 'Создать' : 'Редактировать'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
