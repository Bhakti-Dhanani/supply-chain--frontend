import axiosInstance from '../config/axios.config';

const ordersApi = axiosInstance;

// Fetch orders for the authenticated vendor
export const fetchOrders = async () => {
  const response = await ordersApi.get('/orders/my');
  // Ensure always returns an array for frontend
  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray(response.data.orders)) return response.data.orders;
  return [];
};

export const createOrder = async (orderData: any) => {
  const response = await ordersApi.post('/orders', orderData);
  return response.data;
};

export const fetchOrderById = async (id: string | number) => {
  const response = await ordersApi.get(`/orders/${id}`);
  return response.data;
};

// Fetch orders for a list of warehouse IDs (for managers)
export const fetchOrdersByWarehouseIds = async (warehouseIds: number[]) => {
  const response = await ordersApi.get('/orders', { params: { warehouseIds: warehouseIds.join(',') } });
  return Array.isArray(response.data) ? response.data : (response.data.orders || []);
};

// Update order status
export const updateOrderStatus = async (orderId: number, status: string) => {
  const response = await ordersApi.patch(`/orders/${orderId}/status`, { status });
  return response.data;
};
