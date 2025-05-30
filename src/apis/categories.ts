import axiosInstance from '../config/axios.config';

const categoriesApi = axiosInstance;

export const fetchCategories = async () => {
  try {
    const response = await categoriesApi.get('/');
    return response.data;
  } catch (error: any) {
    console.error('Fetch categories error:', error.response || error.message);
    throw new Error(error.response?.data?.message || 'Unable to fetch categories. Please try again later.');
  }
};
