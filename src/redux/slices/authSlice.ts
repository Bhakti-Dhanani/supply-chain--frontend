import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => action.type === 'persist/REHYDRATE',
      (state, action: any) => {
        if (action.payload && action.payload.auth) {
          const { user, token } = action.payload.auth;
          state.user = user;
          state.token = token;
          state.isAuthenticated = Boolean(user && user.id && token);
        }
      }
    );
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;