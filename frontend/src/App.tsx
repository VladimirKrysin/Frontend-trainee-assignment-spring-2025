import { createBrowserRouter, RouterProvider } from 'react-router';
import { Root, BoardsPage, Board, IssuesPage } from './pages/index.ts';
import './App.css';

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
        path: 'board/:id',
        // loader: async ({ params }) => {
        //   return { name: team.name };
        // },
        Component: Board,
      },
      {
        path: 'issues',
        Component: IssuesPage,
      },
    ],
  },
]);
export function App() {
  return <RouterProvider router={router} />;
}
