import axios from 'axios';

const productsApi = axios.create({
  baseURL: '/api/products',
});

export const fetchProducts = async () => {
  const response = await productsApi.get('/');
  return response.data;
};

export const createProduct = async (productData: any) => {
  const response = await productsApi.post('/', productData);
  return response.data;
};
