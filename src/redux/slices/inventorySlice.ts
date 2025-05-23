import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface InventoryState {
  inventory: any[];
}

const initialState: InventoryState = {
  inventory: [],
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setInventory(state, action: PayloadAction<any[]>) {
      state.inventory = action.payload;
    },
  },
});

export const { setInventory } = inventorySlice.actions;
export default inventorySlice.reducer;
