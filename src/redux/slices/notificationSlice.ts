import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
  notifications: any[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<any[]>) {
      state.notifications = action.payload;
    },
    clearNotifications(state) {
      state.notifications = [];
    },
  },
});

export const { setNotifications, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
