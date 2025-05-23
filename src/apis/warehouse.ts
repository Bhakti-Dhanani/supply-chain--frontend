import axios from 'axios';

const warehouseApi = axios.create({
  baseURL: '/api/warehouses',
});

export const fetchWarehouses = async () => {
  const response = await warehouseApi.get('/');
  return response.data;
};

export const createWarehouse = async (warehouseData: any) => {
  const response = await warehouseApi.post('/', warehouseData);
  return response.data;
};
