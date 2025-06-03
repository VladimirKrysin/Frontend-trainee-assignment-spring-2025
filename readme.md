# Тестовое задание для стажёра Frontend-направления (весенняя волна 2025)
## Инструкция по запуску проекта

## Запуск через Docker

### 1. Сборка Docker-образа
```bash
docker build -t avito-frontend .
```

### 2. Запуск контейнера
```bash
docker run -p 5173:5173 avito-frontend .
```
## Запуск через npm
### 1. Установка зависимостей
```bash
npm i 
```

### 2. Запуск приложения
```bash
npm run dev
```
## Обязательный стек технологий:
    - Node.js v20
    - React v19
    - react-router
  
## Дополнительный стек технологий:
    - Mantine
    - Redux Toolkit
    - RTK Query
    - Typescript
    - ESLint
    - Prettier
    - Vite
    
    Mantine использовался для использования готовых ui-компонентов.
    Redux Toolkit использовался для управление состоянием, избавляя от шаблонного кода Redux.
    RTK Query использовался как встроенный инструмент RTK для работы с API.
    Typescirpt, Eslint, Prettier, Vite являются стандартными технологиями для современного проекта.

















