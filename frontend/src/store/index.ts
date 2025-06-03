/**
 * @file index.ts
 * @description Центральный экспорт всех RTK Query API для работы с задачами, пользователями и досками.
 */

import { taskApi } from './issues/issue';
import { usersApi } from './users';
import { boardApi } from './boards';

/**
 * @exports taskApi - API для работы с задачами (issues).
 * @exports usersApi - API для работы с пользователями.
 * @exports boardApi - API для работы с досками.
 */
export { taskApi, usersApi, boardApi };
