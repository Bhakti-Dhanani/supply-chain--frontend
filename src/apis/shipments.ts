import axios from 'axios';

const shipmentsApi = axios.create({
  baseURL: '/api/shipments',
});

export const trackShipment = async (shipmentId: string) => {
  const response = await shipmentsApi.get(`/${shipmentId}`);
  return response.data;
};
