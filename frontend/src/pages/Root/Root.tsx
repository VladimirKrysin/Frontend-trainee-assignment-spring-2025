/**
 * @file Root.tsx
 * Основной корневой компонент приложения. Оборачивает содержимое приложения в макет AppShell с заголовком.
 */

import React from 'react';
import { Outlet } from 'react-router';
import { AppShell } from '@mantine/core';
import { AppHeader } from '../../ui/Header';

/**
 * @component Root
 * @description
 * Корневой компонент, используемый как обёртка для всех страниц приложения.
 * Включает в себя общий макет (`AppShell`) с заголовком (`AppHeader`) и областью отображения контента (`Outlet`).
 *
 * `Outlet` отображает дочерние маршруты, определённые в React Router.
 */
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
