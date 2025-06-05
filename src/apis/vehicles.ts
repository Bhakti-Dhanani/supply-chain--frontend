import axios from 'axios';

// Added explicit type declaration for `fetchTransporterVehicles`
export const fetchTransporterVehicles = async (userId: number): Promise<{ id: number; name: string; status: string }[]> => {
  const response = await axios.get(`/api/vehicles?transporterId=${userId}`);
  return response.data;
};

// Function to fetch users with the role 'Transporter'
export const fetchTransporters = async (): Promise<{ id: number; name: string }[]> => {
  const response = await axios.get('/api/users?role=Transporter');
  return response.data;
};

// Function to fetch the userId associated with a given transporterId
export const fetchUserIdByTransporterId = async (transporterId: number): Promise<number> => {
  const response = await axios.get(`/api/transporters/${transporterId}/user`);
  return response.data.userId;
};

export const fetchDeliveryRoutes = async () => {
  const response = await axios.get('/vehicles/delivery-routes');
  return response.data;
};
