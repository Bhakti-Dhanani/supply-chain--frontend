import axios from 'axios';

const authApi = axios.create({
  baseURL: '/api/auth',
});

export const login = async (credentials: { email: string; password: string }) => {
  const response = await authApi.post('/login', credentials);
  return response.data;
};

export const register = async (userData: any) => {
  const response = await authApi.post('/register', userData);
  return response.data;
};
