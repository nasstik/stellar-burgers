import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

// Получение всех публичных заказов (для страницы /feed)
export const fetchFeeds = createAsyncThunk(
  'feed/fetchFeeds',
  async () => await getFeedsApi()
);

// Получение личных заказов пользователя (для /profile/orders)
export const fetchUserOrders = createAsyncThunk(
  'feed/fetchUserOrders',
  async () => await getOrdersApi()
);

interface TFeedState {
  orders: TOrder[];
  userOrders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
}

const initialState: TFeedState = {
  orders: [],
  userOrders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Публичная лента
      .addCase(fetchFeeds.pending, (state) => { state.loading = true; })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки ленты';
      })
      // Личные заказы
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload; // В API личных заказов обычно приходит просто массив
      });
  }
});

export const getFeedState = (state: { feed: TFeedState }) => state.feed;
export const getOrders = (state: { feed: TFeedState }) => state.feed.orders;
export const getFeedUserOrders = (state: { feed: TFeedState }) => state.feed.userOrders;
export const getFeedLoading = (state: { feed: TFeedState }) => state.feed.loading;
export const getFeedTotal = (state: { feed: TFeedState }) => state.feed.total;
export const getFeedTotalToday = (state: { feed: TFeedState }) => state.feed.totalToday;

export default feedSlice.reducer;
