import axios from '../config/axios.config';
import { jwtDecode } from 'jwt-decode';

export const fetchTransportersWithVehicles = async () => {
  try {
    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
    if (!token) {
      console.error('No auth token found in localStorage');
      throw new Error('Authentication token is missing');
    }

    // Decode the token and check expiration
    const decodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp && decodedToken.exp < currentTime) {
      console.error('Auth token is expired');
      throw new Error('Authentication token is expired');
    }

    console.log('Using valid token:', token); // Log the token for debugging
    const response = await axios.get('/transporters/vehicles', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching transporters with vehicles:', error);
    throw error;
  }
};
