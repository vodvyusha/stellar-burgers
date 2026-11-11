import ingredientsReducer, { getIngredients } from './ingredientsSlice';

import type { TIngredient } from '@utils-types';

describe('Проверка получения ингредиентов', () => {
  test('Несуществующий экшен с undefined возвращает начальное состояние', () => {
    const result = ingredientsReducer(undefined, {
      type: 'UNKNOWN_ACTION',
    });

    expect(result).toEqual({
      ingredients: [],
      isLoading: false,
      error: null,
    });
  });
  test('Состояние pending устанавливает isLoading в true и очищает error', () => {
    const state = {
      ingredients: [],
      isLoading: false,
      error: null,
    };
    const action = getIngredients.pending('request-1', undefined);
    const result = ingredientsReducer(state, action);
    expect(result.isLoading).toBe(true);
    expect(result.error).toBe(null);
  });
  test('Состояние fulfilled устанавливает isLoading в false и сохраняет массив ингредиентов', () => {
    const state = {
      ingredients: [],
      isLoading: true,
      error: null,
    };

    const mockIngredients: TIngredient[] = [
      {
        _id: 'ingredient-1',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 10,
        fat: 20,
        carbohydrates: 30,
        calories: 250,
        price: 1255,
        image: 'bun.png',
        image_large: 'bun-large.png',
        image_mobile: 'bun-mobile.png',
      },
      {
        _id: 'ingredient-2',
        name: 'Соус Spicy-X',
        type: 'sauce',
        proteins: 2,
        fat: 5,
        carbohydrates: 10,
        calories: 100,
        price: 90,
        image: 'sauce.png',
        image_large: 'sauce-large.png',
        image_mobile: 'sauce-mobile.png',
      },
    ];
    const action = getIngredients.fulfilled(mockIngredients, 'request-1', undefined);
    const result = ingredientsReducer(state, action);
    expect(result.isLoading).toBe(false);
    expect(result.ingredients).toEqual([
      {
        _id: 'ingredient-1',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 10,
        fat: 20,
        carbohydrates: 30,
        calories: 250,
        price: 1255,
        image: 'bun.png',
        image_large: 'bun-large.png',
        image_mobile: 'bun-mobile.png',
      },
      {
        _id: 'ingredient-2',
        name: 'Соус Spicy-X',
        type: 'sauce',
        proteins: 2,
        fat: 5,
        carbohydrates: 10,
        calories: 100,
        price: 90,
        image: 'sauce.png',
        image_large: 'sauce-large.png',
        image_mobile: 'sauce-mobile.png',
      },
    ]);
  });
  test('Состояние rejected устанавливает isLoading в false и сохраняет ошибку', () => {
    const state = {
      ingredients: [],
      isLoading: true,
      error: null,
    };
    const action = getIngredients.rejected(
      new Error('Ошибка загрузки ингредиентов'),
      'request-1',
      undefined
    );
    const result = ingredientsReducer(state, action);
    expect(result.isLoading).toBe(false);
    expect(result.error).toMatchObject({
      message: 'Ошибка загрузки ингредиентов',
    });
  });
});
