import React, { useEffect, useState, useCallback } from 'react';
import { fetchProducts } from '../../../apis/products';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  FiSearch,
  FiFilter,
  FiEye
} from 'react-icons/fi';
import { format } from 'date-fns';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  created_at?: string;
}

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const getStatusTag = (quantity: number) => {
    if (quantity <= 0) return <span className="bg-[#2A4D4D] text-[#D6ECE6] px-3 py-1 rounded-full text-xs">Out of Stock</span>;
    if (quantity < 10) return <span className="bg-[#EADCD6] text-[#1E3B3B] px-3 py-1 rounded-full text-xs">Low Stock</span>;
    return <span className="bg-[#B3D5CF] text-[#1E3B3B] px-3 py-1 rounded-full text-xs">In Stock</span>;
  };

  const fetchProductsData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      setError('Failed to load products.');
      message.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductsData();
  }, [fetchProductsData]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(Array.isArray(products) ? products : []);
    } else {
      const filtered = Array.isArray(products)
        ? products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.id.toString().includes(searchQuery)
          )
        : [];
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  return (
    <div
      className="min-h-screen px-2 pt-4 pb-8 transition-all duration-300 bg-gray-50 sm:px-4 md:px-6"
      style={{ marginLeft: '0', paddingTop: '64px' }}
    >
      <div className="ml-0">
        <div className="flex flex-col items-start justify-between gap-4 mb-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#1E3B3B]">Product Inventory</h2>
            <p className="text-sm text-[#6E8F89]">Browse and manage your products</p>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="flex flex-col gap-4 mb-6 md:flex-row">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-3 text-[#6E8F89]" />
            <input
              type="text"
              placeholder="Search products by name, description or ID..."
              className="w-full pl-10 pr-4 py-2 border border-[#B3D5CF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B3D5CF] text-[#1E3B3B] bg-white shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-[#B3D5CF] rounded-lg bg-white text-[#1E3B3B] hover:bg-[#F5F9F8] w-full md:w-auto justify-center shadow">
            <FiFilter className="mr-2 text-[#6E8F89]" />
            <span>Filter</span>
          </button>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto bg-white shadow-sm rounded-xl">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E3B3B]"></div>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-[#2A4D4D]">{error}</div>
          ) : (Array.isArray(filteredProducts) ? filteredProducts.length === 0 : true) ? (
            <div className="p-6 text-center text-[#6E8F89]">
              {searchQuery ? 'No products match your search' : 'No products found'}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-[#6E8F89] text-xs md:text-sm">
              <thead className="bg-[#1E3B3B]">
                <tr>
                  <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">ID</th>
                  <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">Product Name</th>
                  <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">Description</th>
                  <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">Price</th>
                  <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">Stock</th>
                  <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">Added On</th>
                  <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#6E8F89]">
                {(Array.isArray(filteredProducts) ? filteredProducts : []).map((product) => (
                  <tr key={product.id} className="hover:bg-[#F5F9F8]">
                    <td className="px-2 py-4 md:px-6 whitespace-nowrap">
                      <span className="font-medium text-[#1E3B3B]">#{product.id.toString().slice(-6)}</span>
                    </td>
                    <td className="px-2 py-4 md:px-6 whitespace-nowrap">
                      <div className="font-medium text-[#1E3B3B]">
                        {product.name}
                      </div>
                    </td>
                    <td className="px-2 py-4 md:px-6">
                      <div className="text-[#6E8F89] line-clamp-2">
                        {product.description || '-'}
                      </div>
                    </td>
                    <td className="px-2 py-4 md:px-6 whitespace-nowrap">
                      <div className="font-medium text-[#1E3B3B]">
                        ₹{typeof product.price === 'number' ? product.price.toFixed(2) : Number(product.price).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-2 py-4 md:px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-[#1E3B3B]">{product.quantity}</span>
                        {getStatusTag(product.quantity)}
                      </div>
                    </td>
                    <td className="px-2 py-4 md:px-6 whitespace-nowrap">
                      <div className="text-[#6E8F89]">
                        {product.created_at ? format(new Date(product.created_at), 'MMM d, yyyy') : '-'}
                      </div>
                    </td>
                    <td className="px-2 py-4 md:px-6 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/dashboard/vendor/products/${product.id}`)}
                        className="flex items-center bg-[#1E3B3B] text-[#D6ECE6] px-3 py-1 rounded hover:bg-[#2A4D4D] transition text-xs md:text-sm"
                      >
                        <FiEye className="mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;