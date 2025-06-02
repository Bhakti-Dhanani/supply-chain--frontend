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
    markAsViewed(state, action: PayloadAction<number>) {
      const notificationId = action.payload;
      const notification = state.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.viewed = true;
      }
    },
  },
});

export const { setNotifications, clearNotifications, markAsViewed } = notificationSlice.actions;
export default notificationSlice.reducer;
