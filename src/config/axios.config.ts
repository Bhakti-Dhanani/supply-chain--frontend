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
    // Get token from Redux state (persisted in sessionStorage)
    const state = store.getState();
    const token = state.auth?.token;
    if (token && token !== 'null' && token !== 'undefined') {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    } else if (config.headers && config.headers['Authorization']) {
      // Remove Authorization header if no token
      delete config.headers['Authorization'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
