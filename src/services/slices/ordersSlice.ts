import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrdersApi } from '@api';
import type { TOrder } from '@utils-types';
import { createOrder } from './orderSlice';

type TOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrdersState = {
  orders: [],
  isLoading: false,
  error: null,
};

export const getOrders = createAsyncThunk('orders/getOrders', async () =>
  getOrdersApi()
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось загрузить историю заказов';
      })

      .addCase(createOrder.fulfilled, (state, action) => {
        state.error = null;
        state.orders.unshift(action.payload);
      });
  },
});

export default ordersSlice.reducer;
