/// <reference types="node" />

import axios from 'axios';
import { store } from '../redux/store';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
});

// Add a request interceptor to always read token from sessionStorage
axiosInstance.interceptors.request.use(
  (config) => {
    // Get tokens and currentUserId from Redux state (persisted in sessionStorage)
    const state = store.getState();
    const tokens = state.auth?.tokens;
    const currentUserId = state.auth?.currentUserId;
    const token = currentUserId ? tokens[currentUserId] : null;

    if (token && token !== 'null' && token !== 'undefined') {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    } else if (config.headers && config.headers['Authorization']) {
      // Remove Authorization header if no token
      delete config.headers['Authorization'];
    }

    if (!token || token === 'null' || token === 'undefined') {
      console.error('Authentication token is missing or invalid:', token);
      // Optionally, redirect to login page or refresh token logic can be added here.
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
