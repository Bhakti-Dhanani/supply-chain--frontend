import axios from 'axios';

const warehouseApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/warehouses`,
});

export const fetchWarehouses = async () => {
  try {
    const response = await warehouseApi.get('/');
    console.log('Warehouses API response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching warehouses:', error.response || error.message);
    throw new Error(error.response?.data?.message || 'Unable to fetch warehouses.');
  }
};

export const createWarehouse = async (warehouseData: any) => {
  const response = await warehouseApi.post('/', warehouseData);
  return response.data;
};
