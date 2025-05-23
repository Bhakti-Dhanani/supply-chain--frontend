import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ShipmentState {
  shipments: any[];
}

const initialState: ShipmentState = {
  shipments: [],
};

const shipmentSlice = createSlice({
  name: 'shipments',
  initialState,
  reducers: {
    setShipments(state, action: PayloadAction<any[]>) {
      state.shipments = action.payload;
    },
  },
});

export const { setShipments } = shipmentSlice.actions;
export default shipmentSlice.reducer;
