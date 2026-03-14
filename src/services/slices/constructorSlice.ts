import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '../../utils/types';
import { RootState } from '../store';
import { placeOrder } from './orderSlice';

interface TConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },

      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },

    moveIngredient: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;
      const movedItem = state.ingredients[from];
      state.ingredients.splice(from, 1);
      state.ingredients.splice(to, 0, movedItem);
    },

    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(placeOrder.fulfilled, (state) => {
      state.bun = null;
      state.ingredients = [];
    });
  }
});

export const getConstructorState = (state: RootState) =>
  state.burgerConstructor;
export const getConstructorItems = (state: RootState) =>
  state.burgerConstructor.ingredients;
export const getConstructorBun = (state: RootState) =>
  state.burgerConstructor.bun;

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;
export default constructorSlice.reducer;
