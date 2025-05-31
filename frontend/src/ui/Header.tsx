// src/components/AppHeader.tsx
import React from 'react';
import { Group, Button, Text, Box } from '@mantine/core';
import { Link, useLocation } from 'react-router';

export const AppHeader: React.FC = () => {
  const location = useLocation();

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

      <Button component={Link} to="/create">
        Создать задачу
      </Button>
    </Box>
  );
};
