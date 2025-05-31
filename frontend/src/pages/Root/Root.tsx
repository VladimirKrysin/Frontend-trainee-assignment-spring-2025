import React from 'react';
import { Outlet } from 'react-router';
import { AppShell } from '@mantine/core';
import { AppHeader } from '../../ui/Header';

export const Root: React.FC = () => {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <AppHeader />
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};
