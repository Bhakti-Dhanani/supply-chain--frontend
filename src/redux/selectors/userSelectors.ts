import type { RootState } from '../store';

export const selectCurrentUser = (state: RootState) => {
  const { users, currentUserId } = state.auth;
  return currentUserId ? users[currentUserId] : null;
};

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
