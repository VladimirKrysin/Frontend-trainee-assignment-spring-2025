import { createBrowserRouter, RouterProvider } from 'react-router';
import { Root, BoardsPage, Board, IssuesPage } from './pages/index.ts';
import './App.css';

/**
 * Конфигурация маршрутизатора приложения.
 * Использует createBrowserRouter для определения маршрутов.
 *
 * @constant {import('react-router').Router} router - Экземпляр маршрутизатора с определёнными маршрутами.
 *
 * Маршруты:
 * - '/' - корневой путь, рендерит компонент Root и содержит вложенные маршруты:
 *   - '/boards' - страница со списком проектов (BoardsPage)
 *   - '/boards/:id' - страница конкретного проекта (Board)
 *   - '/issues' - страница со списком задач (IssuesPage)
 */
const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      {
        path: 'boards',
        Component: BoardsPage,
      },
      {
        path: 'boards/:id',
        Component: Board,
      },
      {
        path: 'issues',
        Component: IssuesPage,
      },
    ],
  },
]);

/**
 * Главный компонент приложения.
 * Отвечает за подключение маршрутизатора к React-приложению.
 *
 * @returns {JSX.Element} - Элемент RouterProvider с конфигурацией маршрутов.
 */
export function App() {
  return <RouterProvider router={router} />;
}
