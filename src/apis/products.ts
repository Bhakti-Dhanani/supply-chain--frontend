import axios from 'axios';

const productsApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/products`,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export const fetchProducts = async () => {
  const response = await productsApi.get('/');
  return response.data;
};

export const createProduct = async (productData: any) => {
  const response = await productsApi.post('/', productData);
  return response.data;
};

// Fetch products by warehouse ID
export const getProductsByWarehouse = async (warehouseId: number, categoryId?: number, subcategoryId?: number) => {
  try {
    const params: any = {};
    if (categoryId) params.categoryId = categoryId;
    if (subcategoryId) params.subcategoryId = subcategoryId;

    const response = await productsApi.get(`/warehouse/${warehouseId}`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products by warehouse:', error);
    throw error;
  }
};
