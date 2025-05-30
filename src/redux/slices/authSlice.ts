import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  users: Record<number, User>; // Store data for multiple users
  tokens: Record<number, string>; // Store tokens for multiple users
  currentUserId: number | null; // Track the currently active user
  isAuthenticated: boolean;
}

const loadStateFromSession = (): AuthState => {
  const users = JSON.parse(sessionStorage.getItem('users') || '{}');
  const tokens = JSON.parse(sessionStorage.getItem('tokens') || '{}');
  const currentUserId = sessionStorage.getItem('currentUserId');
  const isAuthenticated = Object.keys(users).length > 0;

  return {
    users,
    tokens,
    currentUserId: currentUserId ? parseInt(currentUserId, 10) : null,
    isAuthenticated,
  };
};

const initialState: AuthState = loadStateFromSession();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: User; token: string }>) {
      const { user, token } = action.payload;
      if (user && token && user.id !== undefined) {
        if (!state.users) state.users = {};
        if (!state.tokens) state.tokens = {};

        state.users[user.id] = user;
        state.tokens[user.id] = token;
        state.currentUserId = user.id;
        state.isAuthenticated = true;

        // Save to sessionStorage
        sessionStorage.setItem('users', JSON.stringify(state.users));
        sessionStorage.setItem('tokens', JSON.stringify(state.tokens));
        sessionStorage.setItem('currentUserId', user.id.toString());
      } else {
        console.error('Invalid login payload:', action.payload);
      }
    },
    logout(state, action: PayloadAction<number>) {
      const userId = action.payload;
      delete state.users[userId];
      delete state.tokens[userId];
      state.currentUserId = Object.keys(state.users).length > 0 ? parseInt(Object.keys(state.users)[0], 10) : null;
      state.isAuthenticated = Object.keys(state.users).length > 0;

      // Update sessionStorage
      sessionStorage.setItem('users', JSON.stringify(state.users));
      sessionStorage.setItem('tokens', JSON.stringify(state.tokens));
      sessionStorage.setItem('currentUserId', state.currentUserId ? state.currentUserId.toString() : '');
    },
    switchUser(state, action: PayloadAction<number>) {
      state.currentUserId = action.payload;
      sessionStorage.setItem('currentUserId', action.payload.toString());
    },
  },
});

export const { login, logout, switchUser } = authSlice.actions;
export default authSlice.reducer;