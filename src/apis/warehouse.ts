import axiosInstance from '../config/axios.config';

const warehouseApi = axiosInstance;

export const fetchWarehouses = async () => {
  try {
    const response = await warehouseApi.get('/warehouses');
    console.log('Warehouses API response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching warehouses:', error.response || error.message);
    throw new Error(error.response?.data?.message || 'Unable to fetch warehouses.');
  }
};

export const createWarehouse = async (warehouseData: any) => {
  const response = await warehouseApi.post('/warehouses', warehouseData);
  return response.data;
};

export const fetchMyWarehouses = async () => {
  try {
    // Use full path to avoid double prefixing
    const response = await warehouseApi.get('/warehouses/my');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user warehouses:', error.response || error.message);
    throw new Error(error.response?.data?.message || 'Unable to fetch user warehouses.');
  }
};

export const fetchWarehouseLocations = async () => {
  const response = await axiosInstance.get('/warehouses/locations');
  return response.data;
};
