import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface OrderState {
  orders: Record<number, any[]>; // Store orders for multiple users
}

const initialState: OrderState = {
  orders: {},
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<{ userId: number; orders: any[] }>) {
      const { userId, orders } = action.payload;
      state.orders[userId] = orders;
    },
  },
});

export const { setOrders } = orderSlice.actions;
export default orderSlice.reducer;
