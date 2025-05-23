import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import orderReducer from './slices/orderSlice';
import shipmentReducer from './slices/shipmentSlice';
import inventoryReducer from './slices/inventorySlice';
import productReducer from './slices/productSlice';
import notificationReducer from './slices/notificationSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: orderReducer,
    shipments: shipmentReducer,
    inventory: inventoryReducer,
    products: productReducer,
    notifications: notificationReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
