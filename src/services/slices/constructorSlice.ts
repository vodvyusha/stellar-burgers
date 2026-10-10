import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

import type {
  TConstructorIngredient,
  TConstructorState,
  TIngredient,
} from '@utils-types';

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      prepare(ingredient: TIngredient) {
        return {
          payload: {
            ...ingredient,
            id: nanoid(),
          },
        };
      },
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
    },

    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },

    moveIngredient(
      state,
      action: PayloadAction<{
        from: number;
        to: number;
      }>
    ) {
      const { from, to } = action.payload;

      const [movedIngredient] = state.ingredients.splice(from, 1);

      if (movedIngredient) {
        state.ingredients.splice(to, 0, movedIngredient);
      }
    },

    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    },
  },
});

export const { addIngredient, removeIngredient, moveIngredient, clearConstructor } =
  constructorSlice.actions;

export default constructorSlice.reducer;
