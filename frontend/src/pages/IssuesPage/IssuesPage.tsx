import React, { useState } from 'react';
import { Box, Button, Group, Stack, TextInput, Paper } from '@mantine/core';
import { TaskForm } from '../../ui/TaskForm';
import { useDisclosure } from '@mantine/hooks';
import { useGetAllTasksQuery } from '@/services/tasks';

export const IssuesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [taskFormOpened, { open: openTaskForm, close: closeTaskForm }] =
    useDisclosure(false);

  const { data: issues } = useGetAllTasksQuery(undefined);

  const filtered = issues?.data.filter((issue) =>
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
        {filtered?.map((issue) => (
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
