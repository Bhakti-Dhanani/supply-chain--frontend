import axios from 'axios';

const ordersApi = axios.create({
  baseURL: '/api/orders',
});

export const fetchOrders = async () => {
  const response = await ordersApi.get('/');
  return response.data;
};

export const createOrder = async (orderData: any) => {
  const response = await ordersApi.post('/', orderData);
  return response.data;
};
