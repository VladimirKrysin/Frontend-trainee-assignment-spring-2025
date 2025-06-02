import React from 'react';
import { Box, Stack, Paper, Group } from '@mantine/core';
import { Link } from 'react-router';
import type { Board } from '@/types';
import { useGetAllBoardsQuery } from '@/store/boards';

export const BoardsPage: React.FC = () => {
  const { data } = useGetAllBoardsQuery('');
  const boards = data?.data ?? [];

  return (
    <Box p="md">
      <Stack>
        {boards.map((board: Board) => (
          <Paper key={board.id} withBorder p="md">
            <Group justify="space-between">
              <div>{board.name}</div>
              <Link to={`/board/${board.id}`} state={{ boardName: board.name }}>
                Перейти к доске
              </Link>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};
