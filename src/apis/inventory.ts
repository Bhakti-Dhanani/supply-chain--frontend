import axiosInstance from '../config/axios.config';

export const fetchWarehouseInventory = async (filters: any) => {
  const response = await axiosInstance.get('/inventory/warehouse', { params: filters });
  return Array.isArray(response.data) ? response.data : (response.data.products || []);
};

export const fetchCategories = async () => {
  const response = await axiosInstance.get('/categories');
  return Array.isArray(response.data) ? response.data : (response.data.categories || []);
};

export const fetchSubcategories = async (categoryId: string) => {
  const response = await axiosInstance.get(`/subcategories`, { params: { categoryId } });
  return Array.isArray(response.data) ? response.data : (response.data.subcategories || []);
};

export const fetchStockMovements = async (filters: any) => {
  const response = await axiosInstance.get('/stock-movements', { params: filters });
  return Array.isArray(response.data) ? response.data : (response.data.movements || []);
};
