import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} from './constructorSlice';

import type { TIngredient, TConstructorState } from '@utils-types';

const createMockIngredient = (overrides: Partial<TIngredient> = {}): TIngredient => ({
  _id: 'ingredient-1',
  name: 'Тестовый ингредиент',
  type: 'main',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 250,
  price: 100,
  image: 'image.png',
  image_large: 'image-large.png',
  image_mobile: 'image-mobile.png',
  ...overrides,
});

const mockBun = createMockIngredient({
  _id: 'ingredient-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
});

const mockAnotherBun = createMockIngredient({
  _id: 'ingredient-3',
  name: 'Флюоресцентная булка R2-D3',
  type: 'bun',
});

const mockSauce = createMockIngredient({
  _id: 'ingredient-2',
  name: 'Соус Spicy-X',
  type: 'sauce',
});

const mockMain = createMockIngredient({
  _id: 'ingredient-4',
  name: 'Биокотлета из марсианского космобелка',
  type: 'main',
});

const mockCheese = createMockIngredient({
  _id: 'ingredient-5',
  name: 'Сыр с астероидной плесенью',
  type: 'main',
});

describe('Проверка работы конструктора', () => {
  test('Неизвестный экшен с undefined возвращает начальное состояние', () => {
    const result = constructorReducer(undefined, {
      type: 'UNKNOWN_ACTION',
    });

    expect(result).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  test('Добавление булочки устанавливает state.bun', () => {
    const state: TConstructorState = {
      bun: null,
      ingredients: [],
    };

    const action = addIngredient(mockBun);
    const result = constructorReducer(state, action);

    expect(result.bun).toEqual({
      ...mockBun,
      id: expect.any(String),
    });

    expect(result.bun?.id?.trim()).not.toBe('');
    expect(result.ingredients).toEqual([]);
  });

  test('Добавление начинки увеличивает массив ingredients', () => {
    const state: TConstructorState = {
      bun: null,
      ingredients: [{ ...mockSauce, id: 'sauce-1' }],
    };

    const action = addIngredient(mockMain);
    const result = constructorReducer(state, action);

    expect(result.ingredients).toHaveLength(state.ingredients.length + 1);

    expect(result.ingredients).toEqual([
      state.ingredients[0],
      {
        ...mockMain,
        id: expect.any(String),
      },
    ]);

    expect(result.ingredients[1].id.trim()).not.toBe('');
    expect(result.bun).toBeNull();
  });

  test('Добавление новой булочки заменяет предыдущую', () => {
    const state: TConstructorState = {
      bun: { ...mockBun, id: 'old-bun-id' },
      ingredients: [],
    };

    const action = addIngredient(mockAnotherBun);
    const result = constructorReducer(state, action);

    expect(result.bun).toEqual({
      ...mockAnotherBun,
      id: expect.any(String),
    });

    expect(result.bun?.id?.trim()).not.toBe('');
    expect(result.bun?.id).not.toBe('old-bun-id');
  });

  test('Удаление начинки по id', () => {
    const state: TConstructorState = {
      bun: null,
      ingredients: [
        { ...mockSauce, id: 'sauce-1' },
        { ...mockMain, id: 'filling-2' },
      ],
    };

    const action = removeIngredient('sauce-1');
    const result = constructorReducer(state, action);

    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0].id).toBe('filling-2');
  });

  test('Перемещение начинки с позиции from на to', () => {
    const state: TConstructorState = {
      bun: null,
      ingredients: [
        { ...mockSauce, id: 'sauce-1' },
        { ...mockMain, id: 'main-1' },
        { ...mockCheese, id: 'cheese-1' },
      ],
    };

    const action = moveIngredient({ from: 0, to: 2 });
    const result = constructorReducer(state, action);

    const newOrderOfIngredients = result.ingredients.map((ingredient) => ingredient.id);

    expect(newOrderOfIngredients).toEqual(['main-1', 'cheese-1', 'sauce-1']);

    expect(state.ingredients.map((ingredient) => ingredient.id)).toEqual([
      'sauce-1',
      'main-1',
      'cheese-1',
    ]);
  });

  test('Перемещение несуществующего ингредиента не меняет состояние', () => {
    const state: TConstructorState = {
      bun: null,
      ingredients: [],
    };

    const action = moveIngredient({ from: 10, to: 0 });
    const result = constructorReducer(state, action);

    expect(result).toEqual(state);
  });

  test('Очистка конструктора сбрасывает bun и ingredients', () => {
    const state: TConstructorState = {
      bun: { ...mockBun, id: 'bun-1' },
      ingredients: [{ ...mockMain, id: 'main-1' }],
    };

    const action = clearConstructor();
    const result = constructorReducer(state, action);

    expect(result.ingredients).toEqual([]);
    expect(result.bun).toBeNull();
  });
  test('Одинаковые начинки получают разные локальные id', () => {
    const state: TConstructorState = {
      bun: null,
      ingredients: [],
    };

    const firstResult = constructorReducer(state, addIngredient(mockMain));

    const secondResult = constructorReducer(firstResult, addIngredient(mockMain));

    expect(secondResult.ingredients).toHaveLength(2);

    expect(secondResult.ingredients).toEqual([
      {
        ...mockMain,
        id: expect.any(String),
      },
      {
        ...mockMain,
        id: expect.any(String),
      },
    ]);

    const firstId = secondResult.ingredients[0].id;
    const secondId = secondResult.ingredients[1].id;

    expect(firstId.trim()).not.toBe('');
    expect(secondId.trim()).not.toBe('');

    expect(firstId).not.toBe(secondId);
  });
});
