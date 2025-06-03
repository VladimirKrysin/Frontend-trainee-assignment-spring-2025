/**
 * @file AppHeader.tsx
 * @description Компонент верхнего хедера приложения, содержит навигационные ссылки и кнопку создания задачи.
 * При загрузке и обновлении данных задач синхронизирует состояние Redux с API.
 */

import React, { useEffect } from 'react';
import { Group, Button, Box } from '@mantine/core';
import { Link, useLocation } from 'react-router';
import { useDisclosure } from '@mantine/hooks';
import { useAppDispatch } from '@/hooks/hooks';
import { setIssues } from '@/store/issues/issueSlice';
import { TaskForm } from './TaskForm';
import { useGetAllTasksQuery } from '@/store/issues/issue';

/**
 * AppHeader — компонент верхней панели с навигацией и кнопкой создания задачи.
 *
 * Особенности:
 * - Отображает ссылки на страницы «Все задачи» и «Проекты».
 * - Подсвечивает активную ссылку красным цветом.
 * - Кнопка «Создать задачу» открывает модальное окно с формой создания задачи.
 * - После загрузки или обновления данных задач, обновляет состояние в Redux.
 */
export const AppHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [taskFormOpened, { open: openTaskForm, close: closeTaskForm }] =
    useDisclosure(false);

  // Запрос всех задач из API
  const { data: apiIssues, refetch: refetchIssues } = useGetAllTasksQuery(undefined);

  // При изменении данных из API синхронизируем состояние Redux
  useEffect(() => {
    if (apiIssues?.data) {
      dispatch(setIssues(apiIssues.data));
    }
  }, [apiIssues, dispatch]);

  // Функция для принудительного обновления задач и синхронизации Redux
  async function updateIssues() {
    const { data } = await refetchIssues();
    if (data) {
      dispatch(setIssues(data.data));
    }
  }

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
            color: location.pathname.startsWith('/boards') ? 'red' : 'black',
            fontWeight: location.pathname.startsWith('/boards') ? 700 : 400,
          }}
        >
          Проекты
        </Link>
      </Group>
      <Button onClick={openTaskForm}>Создать задачу</Button>
      <TaskForm
        onUpdate={() => null}
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
