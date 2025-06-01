import React, { useEffect, useState } from 'react';
import { Box, Stack, Paper, Group } from '@mantine/core';
import { Link } from 'react-router';
import { api } from '../../api';
import type { Board } from '@/types';

export const BoardsPage: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    api
      .get('/boards')
      .then((res) => {
        setBoards(res.data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <Box p="md">
      <Stack>
        {boards.map((board) => (
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
