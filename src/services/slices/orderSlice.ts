import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';
import { RootState } from '../store';

export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async (ingredientIds: string[]) => {
    const res = await orderBurgerApi(ingredientIds);
    return res.order;
  }
);

interface TOrderState {
  orderData: Partial<TOrder> | TOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: TOrderState = {
  orderData: null,
  loading: false,
  error: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderData = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Не удалось оформить заказ';
      });
  }
});

export const getOrderData = (state: RootState) => state.order.orderData;
export const getOrderLoading = (state: RootState) => state.order.loading;

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
