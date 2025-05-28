import axios from 'axios';

const subcategoriesApi = axios.create({
  baseURL:`${import.meta.env.VITE_API_BASE_URL}/api/subcategories`,
});

export const fetchSubcategories = async (categoryId: number) => {
  const response = await subcategoriesApi.get(`/category/${categoryId}`);
  return response.data;
};
