import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Use localStorage for persistence
import authReducer from './slices/authSlice';
import orderReducer from './slices/orderSlice';
import shipmentReducer from './slices/shipmentSlice';
import inventoryReducer from './slices/inventorySlice';
import productReducer from './slices/productSlice';
import notificationReducer from './slices/notificationSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  orders: orderReducer,
  shipments: shipmentReducer,
  inventory: inventoryReducer,
  products: productReducer,
  notifications: notificationReducer,
});

const persistConfig = {
  key: 'root',
  storage, // Use localStorage
  whitelist: ['auth'], // persist only auth slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for redux-persist
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
