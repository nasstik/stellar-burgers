import { getIngredientsApi } from '../../utils/burger-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '../../utils/types';
import { RootState } from '../store';

export const fetchIngredients = createAsyncThunk(
  'ingredients/getAll',
  async () => await getIngredientsApi()
);

interface TIngredientsState {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null;
}

const initialState: TIngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки';
      });
  }
});

export const getIngredients = (state: RootState) =>
  state.ingredients.ingredients;
export const getIngredientsLoading = (state: RootState) =>
  state.ingredients.loading;
export const getIngredientsError = (state: RootState) =>
  state.ingredients.error;

export default ingredientsSlice.reducer;
