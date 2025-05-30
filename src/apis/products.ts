import axiosInstance from '../config/axios.config';

const productsApi = axiosInstance;

export const fetchProducts = async () => {
  const response = await productsApi.get('/products'); // Correct endpoint
  return response.data;
};

export const createProduct = async (productData: any) => {
  const response = await productsApi.post('/products', productData);
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

export const getProductById = async (productId: number) => {
  try {
    const response = await productsApi.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};
