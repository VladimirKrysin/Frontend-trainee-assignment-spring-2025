/**
 * @file index.ts
 * @description Точка входа для экспорта основных страниц приложения.
 * Упрощает импорт страниц в других частях проекта.
 */

import { Root } from './Root/Root.tsx';
import { BoardsPage } from './BoardsPage/BoardsPage.tsx';
import { Board } from './Board/Board.tsx';
import { IssuesPage } from './IssuesPage/IssuesPage.tsx';

/**
 * Экспорт основных страниц приложения:
 * - `Root`: корневая обёртка с layout-структурой.
 * - `BoardsPage`: список всех досок.
 * - `Board`: представление одной доски.
 * - `IssuesPage`: страница всех задач.
 */
export { Root, BoardsPage, Board, IssuesPage };
