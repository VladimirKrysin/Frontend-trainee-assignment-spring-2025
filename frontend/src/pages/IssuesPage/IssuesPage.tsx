import React, { useEffect, useState } from 'react';
import { Box, Button, Group, Stack, TextInput, Paper } from '@mantine/core';
import { TaskForm } from '../../ui/TaskForm';
import { useDisclosure } from '@mantine/hooks';
import { Link } from 'react-router';
import { api } from '../../api';

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

export const IssuesPage: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [search, setSearch] = useState('');
  const [taskFormOpened, { open: openTaskForm, close: closeTaskForm }] =
    useDisclosure(false);

  useEffect(() => {
    api
      .get('/tasks')
      .then((res) => {
        setIssues(res.data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const filtered = issues.filter((issue) =>
    issue.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box p="md">
      <Group align="flex-start" mb="md">
        <TextInput
          placeholder="Поиск"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          style={{ flex: 1 }}
        />
        <Button variant="outline">Фильтры</Button>
      </Group>
      <Stack>
        {filtered.map((issue) => (
          <Paper key={issue.id} withBorder p="md">
            {issue.title}
          </Paper>
        ))}
      </Stack>
      <Box mt="lg" ta="right">
        <Button onClick={openTaskForm}>Создать задачу</Button>
      </Box>
      <TaskForm
        opened={taskFormOpened}
        onClose={closeTaskForm}
        mode="create"
        currentBoardId={undefined}
      />
    </Box>
  );
};
