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
    if (warehouseId) params.warehouseId = warehouseId;
    if (categoryId) params.categoryId = categoryId;
    if (subcategoryId) params.subcategoryId = subcategoryId;

    const response = await productsApi.get('/products', { params });
    if (!response.data || response.data.length === 0) {
      throw new Error('No products found for the selected warehouse, category, or subcategory.');
    }
    return response.data;
  } catch (error: any) {
    console.error('Error fetching products by warehouse:', error);

    if (error.response && error.response.status === 404) {
      throw new Error('Products not found for the selected warehouse.');
    }

    throw new Error(error.message || 'Unable to fetch products. Please try again later.');
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

export const updateProductQuantity = async (productId: number, quantity: number) => {
  const response = await productsApi.put(`/products/${productId}/quantity`, { quantity });
  return response.data;
};
