import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getFeedsApi } from '@api';
import type { TFeedState } from '@utils-types';

import { createOrder } from './orderSlice';

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
};

export const getFeeds = createAsyncThunk('feed/getFeeds', async () => getFeedsApi());

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось загрузить ленту заказов';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.error = null;
        state.orders.unshift(action.payload);
        state.total += 1;
        state.totalToday += 1;
      });
  },
});

export default feedSlice.reducer;
