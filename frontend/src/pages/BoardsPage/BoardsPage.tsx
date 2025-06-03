/**
 * @file Страница со списком всех проектов
 * Отображает карточки проектов с возможностью перехода к каждому из них
 *
 * @module pages/BoardsPage/BoardsPage
 */

import React from 'react';
import { Box, Stack, Paper, Group } from '@mantine/core';
import { Link } from 'react-router';
import type { Board } from '@/types';
import { useGetAllBoardsQuery } from '@/store/boards';

/**
 * Компонент страницы со списком досок
 * @component
 * @returns {React.ReactElement} Список досок в виде карточек с ссылками для перехода
 *
 * @example
 * <BoardsPage />
 */

export const BoardsPage: React.FC = () => {
  /**
   * Данные о досках, полученные с сервера
   * @type {Object}
   * @property {Board[]|undefined} data - Массив досок
   */

  const { data } = useGetAllBoardsQuery('');

  /**
   * Нормализованный список досок
   * @type {Board[]}
   */
  const boards = data?.data ?? [];

  return (
    <Box p="md">
      <Stack>
        {boards.map((board: Board) => (
          /**
           * Карточка отдельной доски
           * @param {Board} board - Объект доски
           */
          <Paper key={board.id} withBorder p="md">
            <Group justify="space-between">
              <div>{board.name}</div>
              {/**
               * Ссылка для перехода к конкретной доске
               * Передает название доски через state роутера
               */}
              <Link to={`/boards/${board.id}`} state={{ boardName: board.name }}>
                Перейти к доске
              </Link>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};
