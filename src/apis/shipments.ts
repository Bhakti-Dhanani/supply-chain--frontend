import axios from 'axios';

const shipmentsApi = axios.create({
  baseURL: '/api/shipments',
});

export const trackShipment = async (shipmentId: string) => {
  const response = await shipmentsApi.get(`/${shipmentId}`);
  return response.data;
};

export const fetchShipments = async () => {
  const response = await shipmentsApi.get('/');
  return response.data;
};

export const fetchVehicleRoutes = async () => {
  try {
    const response = await axios.get('/vehicle-routes');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching vehicle routes:', error);
    throw new Error('Unable to fetch vehicle routes.');
  }
};

export const createShipment = async (data: { orderId: number; userId: number; vehicleId: string }) => {
  const response = await axios.post('/shipments/create', data);
  return response.data;
};
