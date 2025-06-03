import axiosInstance from '../config/axios.config';

const categoriesApi = axiosInstance;

export const fetchCategories = async () => {
  try {
    const response = await categoriesApi.get('/categories');
    const data = response.data;

    if (Array.isArray(data)) {
      return data;
    } else {
      console.warn('Unexpected categories response:', data);
      return [];
    }
  } catch (error: any) {
    console.error('Fetch categories error:', error.response || error.message);
    throw new Error(error.response?.data?.message || 'Unable to fetch categories. Please try again later.');
  }
};
