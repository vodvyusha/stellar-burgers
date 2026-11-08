import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrderByNumberApi } from '@api';
import type { TOrder } from '@utils-types';

type TOrderInfoState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderInfoState = {
  order: null,
  isLoading: false,
  error: null,
};

export const getOrderByNumber = createAsyncThunk<TOrder, number>(
  'orderInfo/getOrderByNumber',
  async (number) => {
    const response = await getOrderByNumberApi(number);

    const order = response.orders[0];

    if (!order) {
      throw new Error('Заказ не найден');
    }

    return order;
  }
);

const orderInfoSlice = createSlice({
  name: 'orderInfo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.order = null;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.order = null;
        state.error = action.error.message ?? 'Не удалось получить заказ';
      });
  },
});

export default orderInfoSlice.reducer;
