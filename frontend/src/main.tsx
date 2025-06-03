import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import './index.css';
import '@mantine/core/styles.css';
import { App } from './App.tsx';

/**
 * Точка входа в React-приложение.
 * Создаёт корневой элемент React и рендерит основное приложение.
 *
 * Обёртки вокруг приложения:
 * - StrictMode для выявления потенциальных проблем в React-компонентах.
 * - Provider для интеграции Redux store.
 * - MantineProvider для подключения UI-библиотеки Mantine.
 *
 * @returns {void}
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <MantineProvider>
        <App />
      </MantineProvider>
    </Provider>
  </StrictMode>
);
