import axios from 'axios';

const authApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/auth`,
});

export const login = async (credentials: { email: string; password: string }) => {
  try {
    const response = await authApi.post('/login', credentials);
    const token = response.data.access_token; // Updated to match the response key
    if (token) {
      localStorage.setItem('authToken', token);
      console.log('Auth token stored in localStorage:', token);
    } else {
      console.error('No token received from login response');
    }
    return response.data;
  } catch (error: any) {
    console.error('Login API Error:', error.response || error.message);
    throw new Error(error.response?.data?.message || 'Unable to login. Please try again later.');
  }
};

export const register = async (userData: { name: string; email: string; password: string; role: string }) => {
  const response = await authApi.post('/register', userData);
  return response.data;
};