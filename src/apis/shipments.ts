import axiosInstance from '../config/axios.config';

const shipmentsApi = axiosInstance;

export const trackShipment = async (shipmentId: string) => {
  try {
    const response = await shipmentsApi.get(`/${shipmentId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error tracking shipment:', error.response || error.message);
    throw new Error(error.response?.data?.message || 'Unable to track shipment. Please try again later.');
  }
};

export const fetchShipments = async () => {
  try {
    const response = await shipmentsApi.get('/shipments');
    const data = response.data;
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error('Error fetching shipments:', error.response || error.message);
    throw new Error(error.response?.data?.message || 'Unable to fetch shipments. Please try again later.');
  }
};

export const fetchVehicleRoutes = async () => {
  try {
    const response = await shipmentsApi.get('/shipments/vehicle-routes');
    console.log('Response:', response);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    console.error('Error fetching vehicle routes:', {
      message: error.message,
      response: error.response,
      config: error.config,
    });
    throw new Error(
      error.response?.data?.message || 'Unable to fetch vehicle routes. Please try again later.'
    );
  }
};

export const createShipment = async (data: { orderId: number; userId: number; vehicleId: string }) => {
  console.log('Base URL:', shipmentsApi.defaults.baseURL);
  console.log('Request URL:', `${shipmentsApi.defaults.baseURL}/shipments/create`);
  console.log('Request Data:', data);

  try {
    const response = await shipmentsApi.post('/shipments/create', data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating shipment:', error.response || error.message);
    throw new Error(error.response?.data?.message || 'Unable to create shipment. Please try again later.');
  }
};

export const createShipmentWithVehicleSelection = async (data: { orderId: number; vehicleId: number; userId: number }) => {
  try {
    const response = await shipmentsApi.post('/create', data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating shipment with vehicle selection:', error.response || error.message);
    throw new Error(error.response?.data?.message || 'Unable to create shipment with vehicle selection. Please try again later.');
  }
};
