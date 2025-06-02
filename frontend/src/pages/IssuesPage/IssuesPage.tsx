import React, { useState, useEffect } from 'react';
import { Box, Button, Group, Stack, TextInput, Paper } from '@mantine/core';
import { TaskForm } from '../../ui/TaskForm';
import { useDisclosure } from '@mantine/hooks';
import type { Issue } from '@/types';
import { setIssues, updateIssue } from '@/store/issues/issueSlice';
import { useAppSelector, useAppDispatch } from '@/hooks/hooks';
import { useGetAllTasksQuery, useUpdateTaskMutation } from '@/store/issues/issue';

export const IssuesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [selectedTask, setSelectedTask] = useState<Issue | null>(null);
  const [search, setSearch] = useState('');
  const [taskFormOpened, { open: openTaskForm, close: closeTaskForm }] =
    useDisclosure(false);
  const [updateTask] = useUpdateTaskMutation();

  const { data: apiIssues, refetch: refetchIssues } = useGetAllTasksQuery(undefined);
  const issuesState = useAppSelector((state) => state.issues);

  useEffect(() => {
    if (apiIssues?.data) {
      dispatch(setIssues(apiIssues.data));
    }
  }, [apiIssues, dispatch]);

  const filtered = issuesState.issues?.filter((issue) =>
    issue.title.toLowerCase().includes(search.toLowerCase())
  );

  async function updateIssues() {
    const { data } = await refetchIssues();
    if (data) {
      dispatch(setIssues(data.data));
    }
  }

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
        <Button>Фильтры</Button>
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
