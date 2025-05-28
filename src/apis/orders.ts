import axios from 'axios';

const ordersApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/orders`,
});

// Fetch orders for the authenticated vendor
export const fetchOrders = async () => {
  const token = localStorage.getItem('token'); // or get from Redux if that's where you store it
  const response = await ordersApi.get('/my', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createOrder = async (orderData: any) => {
  const token = localStorage.getItem('token');
  const response = await ordersApi.post('/', orderData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchOrderById = async (id: string | number) => {
  const token = localStorage.getItem('token');
  const response = await ordersApi.get(`/${id}?include=warehouse,items`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
