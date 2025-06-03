import axios from 'axios';

const subcategoriesApi = axios.create({
   baseURL: import.meta.env.VITE_API_BASE_URL + '/subcategories',
});

export const fetchSubcategories = async (categoryId: number) => {
  try {
    const response = await subcategoriesApi.get(`/category/${categoryId}`);
    const data = response.data;

    if (Array.isArray(data)) {
      return data;
    } else {
      console.warn('Unexpected subcategories response:', data);
      return [];
    }
  } catch (error: any) {
    console.error('Fetch subcategories error:', error.response || error.message);
    throw new Error(error.response?.data?.message || 'Unable to fetch subcategories. Please try again later.');
  }
};
