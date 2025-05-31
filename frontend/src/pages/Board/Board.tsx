import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router';
import { Box, Button, Group, Stack, Paper, Title } from '@mantine/core';
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

type Column = {
  id: string;
  title: string;
  issues: Issue[];
};

export const Board: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [columns, setColumns] = useState<Column[]>([]);

  const boardName = location.state?.boardName || '';

  useEffect(() => {
    const loadData = async () => {
      try {
        const boardResponse = await api.get(`/boards/${id}`);

        const issues = boardResponse.data.data;
        const uniqueStatuses = Array.from(
          new Set<string>(issues.map((issue: Issue) => issue.status))
        );

        const dynamicColumns = uniqueStatuses.map((status) => ({
          id: status,
          title: formatStatusName(status),
          issues: issues.filter((issue: Issue) => issue.status === status),
        }));
        setColumns(dynamicColumns);
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, [id]);

  const formatStatusName = (status: string) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleissueUpdate = (updatedissue: Issue) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        issues: column.issues.filter((issue) => issue.id !== updatedissue.id),
      }))
    );

    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === updatedissue.status
          ? { ...column, issues: [...column.issues, updatedissue] }
          : column
      )
    );
  };

  return (
    <Box p="md">
      <Title order={2} mb="md">
        {boardName}
      </Title>
      <Group align="flex-start" grow style={{ gap: '16px' }}>
        {columns.map((column) => (
          <Paper key={column.id} withBorder p="md" style={{ flex: 1 }}>
            <Title order={4} mb="md">
              {column.title}
            </Title>
            <Stack>
              {column.issues.map((issue) => (
                <Paper
                  key={issue.id}
                  withBorder
                  p="sm"
                  shadow="sm"
                  component="a"
                  href={`/issues/${issue.id}/edit`}
                >
                  {issue.title}
                </Paper>
              ))}
            </Stack>
          </Paper>
        ))}
      </Group>
    </Box>
  );
};
