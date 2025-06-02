// src/components/AppHeader.tsx
import React, { useEffect } from 'react';
import { Group, Button, Text, Box } from '@mantine/core';
import { Link, useLocation } from 'react-router';
import { useDisclosure } from '@mantine/hooks';
import { useAppSelector, useAppDispatch } from '@/hooks/hooks';
import { setIssues } from '@/store/issues/issueSlice';
import { TaskForm } from './TaskForm';
import { useGetAllTasksQuery } from '@/store/issues/issue';

export const AppHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [taskFormOpened, { open: openTaskForm, close: closeTaskForm }] =
    useDisclosure(false);

  const { data: apiIssues, refetch: refetchIssues } = useGetAllTasksQuery(undefined);

  useEffect(() => {
    if (apiIssues?.data) {
      dispatch(setIssues(apiIssues.data));
    }
  }, [apiIssues, dispatch]);

  async function updateIssues() {
    const { data } = await refetchIssues();
    if (data) {
      dispatch(setIssues(data.data));
    }
  }

  const isFromBoard = location.pathname.startsWith('/board');
  const isFromIssues = location.pathname === '/issues';

  const boardIdFromPath =
    isFromBoard && location.pathname.split('/')[2]
      ? Number(location.pathname.split('/')[2])
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
        onCreate={() => updateIssues()}
        onClose={() => {
          closeTaskForm();
        }}
        mode={'create'}
        initialData={undefined}
        contextPage="issues"
      />
    </Box>
  );
};
