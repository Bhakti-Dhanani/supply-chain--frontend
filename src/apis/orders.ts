import axios from 'axios';

const ordersApi = axios.create({
  baseURL: '/api/orders',
});

// Fetch orders for a specific vendor
export const fetchOrders = async (vendorId: number) => {
  const response = await ordersApi.get('/', { params: { vendorId } });
  return response.data;
};

export const createOrder = async (orderData: any) => {
  const response = await ordersApi.post('/', orderData);
  return response.data;
};
