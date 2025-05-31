import React, { useEffect, useState } from 'react';
import { Box, Stack, Paper, Group } from '@mantine/core';
import { Link, useNavigate } from 'react-router';
import { api } from '../../api';

type Board = {
  id: number;
  name: string;
  description: string;
  taskCount: number;
};

export const BoardsPage: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('/boards')
      .then((res) => {
        setBoards(res.data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleNavigate = (boardId: number, boardName: string) => {
    navigate(`/board/${boardId}`, { state: { boardName } });
  };

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
