import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router';
import { Box, Group, Stack, Paper, Title } from '@mantine/core';
import type { Issue, Statuses } from '@/types';
import { useDisclosure } from '@mantine/hooks';
import { setIssues, updateIssue } from '@/store/issues/issueSlice';
import { useAppSelector, useAppDispatch } from '@/hooks/hooks';
import { useUpdateTaskMutation } from '@/store/issues/issue';
import { useGetBoardTasksQuery } from '@/store/boards';
import { TaskForm } from '../../ui/TaskForm';

type Column = {
  id: string;
  title: string;
  issues: Issue[];
};

const STATUSES: Statuses[] = ['Backlog', 'InProgress', 'Done'];

export const Board: React.FC = () => {
  const dispatch = useAppDispatch();
  const [taskFormOpened, { open: openTaskForm, close: closeTaskForm }] =
    useDisclosure(false);
  const [updateTask] = useUpdateTaskMutation();

  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [columns, setColumns] = useState<Column[]>([]);
  const [selectedTask, setSelectedTask] = useState<Issue | null>(null);

  const boardName = location.state?.boardName || '';
  const boardId = id ? parseInt(id, 10) : undefined;

  const { data: issues, refetch: refetchIssues } = useGetBoardTasksQuery(id ?? '');
  const issuesState = useAppSelector((state) => state.issues);

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
              {column.title}
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
