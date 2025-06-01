// src/components/AppHeader.tsx
import React from 'react';
import { Group, Button, Text, Box } from '@mantine/core';
import { Link, useLocation } from 'react-router';
import { useDisclosure } from '@mantine/hooks';
import { TaskForm } from './TaskForm';

export const AppHeader: React.FC = () => {
  const location = useLocation();
  const [taskFormOpened, { open: openTaskForm, close: closeTaskForm }] =
    useDisclosure(false);

  const isFromBoard = location.pathname.startsWith('/board');
  const isFromIssues = location.pathname === '/issues';

  const boardIdFromPath = isFromBoard
    ? Number(location.pathname.split('/')[2]) // boards/:id
    : undefined;

  return (
    <Box
      px="md"
      py="sm"
      style={{
        borderBottom: '1px solid #ddd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Group gap="xl">
        <Link
          to="/issues"
          style={{
            textDecoration: 'none',
            color: location.pathname === '/issues' ? 'red' : 'black',
            fontWeight: location.pathname === '/issues' ? 700 : 400,
          }}
        >
          Все задачи
        </Link>
        <Link
          to="/boards"
          style={{
            textDecoration: 'none',
            color: location.pathname === '/boards' ? 'red' : 'black',
            fontWeight: location.pathname === '/boards' ? 700 : 400,
          }}
        >
          Проекты
        </Link>
      </Group>
      <Button onClick={openTaskForm}>Создать задачу</Button>
      <TaskForm
        opened={taskFormOpened}
        onClose={closeTaskForm}
        mode="create"
        currentBoardId={boardIdFromPath}
        contextPage={isFromBoard ? 'board' : 'issues'}
      />
    </Box>
  );
};
