import axios from 'axios';

const categoriesApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/categories`,
});

categoriesApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  console.log('Retrieved auth token:', token);
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      if (isExpired) {
        console.error('Auth token is expired. Redirecting to login page.');
        window.location.href = '/login';
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Invalid auth token format. Redirecting to login page.', error);
      window.location.href = '/login';
    }
  } else {
    console.error('No auth token found in localStorage. Redirecting to login page.');
    window.location.href = '/login';
  }
  return config;
});

export const fetchCategories = async () => {
  try {
    const response = await categoriesApi.get('/');
    console.log('Categories API response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Categories API Error:', error.response || error.message);
    throw new Error(error.response?.data?.message || 'Unable to fetch categories.');
  }
};
