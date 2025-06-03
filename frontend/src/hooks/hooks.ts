/**
 * @file Кастомные хуки для типизированного использования Redux в приложении.
 * Предоставляет типизированные версии стандартных хуков `useDispatch` и `useSelector`.
 *
 * @module hooks/hooks.ts
 */

import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';

/**
 * Типизированная версия хука `useDispatch` для приложения.
 *
 * @returns {AppDispatch} Типизированный dispatch-метод хранилища Redux.
 *
 * @example
 * const dispatch = useAppDispatch();
 * dispatch(someAction());
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Типизированная версия хука `useSelector` для приложения.
 * Автоматически подставляет тип состояния RootState.
 *
 * @type {TypedUseSelectorHook<RootState>}
 *
 * @example
 * const count = useAppSelector(state => state.counter.value);
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
