import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiSearch,
  FiFilter,
  FiPlus,
  FiArrowUp,
  FiArrowDown
} from 'react-icons/fi';
import { message } from 'antd';
import { fetchMyWarehouses } from '../../../apis/warehouse';
import { fetchWarehouseInventory, fetchCategories, fetchStockMovements } from '../../../apis/inventory';
import { updateProductQuantity } from '../../../apis/products';
import { format } from 'date-fns';

interface Product {
  id: number;
  name: string;
  stock: number;
  warehouseName: string;
  categoryName: string;
  subcategoryName: string;
  price: number;
  subcategoryId: string;
}

interface Movement {
  id: number;
  product: { name: string };
  productId: number;
  quantity: number;
  movement_type: 'IN' | 'OUT';
  created_at: string;
}

const WarehouseInventory: React.FC = () => {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [stockMovements, setStockMovements] = useState<Movement[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMovements, setLoadingMovements] = useState(false);
  const [addStockProduct, setAddStockProduct] = useState<Product | null>(null);
  const [addStockModalVisible, setAddStockModalVisible] = useState(false);
  const [addStockQuantity, setAddStockQuantity] = useState<number>(0);
  const movementsContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Auto-scroll for stock movements
  useEffect(() => {
    if (!movementsContainerRef.current || stockMovements.length <= 5) return;

    const container = movementsContainerRef.current;
    const contentHeight = container.scrollHeight;
    const scrollSpeed = 30; // pixels per second
    let scrollPosition = 0;
    let animationFrameId: number;

    const scroll = () => {
      scrollPosition += scrollSpeed / 60; // 60fps
      
      if (scrollPosition >= contentHeight - container.clientHeight) {
        // Reset to top when reaching bottom
        scrollPosition = 0;
        container.scrollTop = 0;
      } else {
        container.scrollTop = scrollPosition;
      }
      
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [stockMovements]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const ws = await fetchMyWarehouses();
      setWarehouses(ws);
      const cats = await fetchCategories();
      setCategories(cats);
      setLoading(false);
    };
    fetchData();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    const filters: any = {};
    if (selectedWarehouse) filters.warehouseId = selectedWarehouse;
    if (selectedCategory) filters.categoryId = selectedCategory;
    if (search) filters.search = search;
    const data = await fetchWarehouseInventory(filters);
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchInventory();
  }, [selectedWarehouse, selectedCategory, search]);

  useEffect(() => {
    const fetchMovements = async () => {
      setLoadingMovements(true);
      const movements = await fetchStockMovements();
      setStockMovements(movements);
      setLoadingMovements(false);
    };
    fetchMovements();
  }, []);

  const handleAddStock = async (productId: number, currentQuantity: number) => {
    const newQuantity = prompt('Enter new stock quantity:', currentQuantity.toString());
    if (!newQuantity || isNaN(Number(newQuantity))) {
      message.error('Invalid quantity entered');
      return;
    }

    try {
      await updateProductQuantity(productId, Number(newQuantity));
      message.success('Stock updated successfully');
      // Refresh inventory data
      const updatedProducts = await fetchWarehouseInventory(selectedWarehouse);
      setProducts(updatedProducts);
    } catch (err) {
      message.error('Failed to update stock');
    }
  };

  const handleAddStockOk = async () => {
    if (!addStockProduct || addStockQuantity <= 0) {
      message.error('Invalid stock quantity');
      return;
    }

    try {
      await updateProductQuantity(addStockProduct.id, addStockQuantity);
      message.success('Stock updated successfully');

      // Refresh inventory data
      const updatedProducts = await fetchWarehouseInventory(selectedWarehouse);
      setProducts(updatedProducts);

      // Close modal
      setAddStockModalVisible(false);
      setAddStockProduct(null);
      setAddStockQuantity(0);
    } catch (err) {
      message.error('Failed to update stock');
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock <= 0) return <span className="bg-[#2A4D4D] text-[#D6ECE6] px-3 py-1 rounded-full text-xs">Out of Stock</span>;
    if (stock < 10) return <span className="bg-[#EADCD6] text-[#1E3B3B] px-3 py-1 rounded-full text-xs">Low Stock</span>;
    return <span className="bg-[#B3D5CF] text-[#1E3B3B] px-3 py-1 rounded-full text-xs">In Stock</span>;
  };

  return (
    <div className="min-h-screen px-2 pt-4 pb-8 transition-all duration-300 bg-gray-50 sm:px-4 md:px-6">
      <div className="ml-0">
        <div className="flex flex-col items-start justify-between gap-4 mb-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#1E3B3B]">Warehouse Inventory</h2>
            <p className="text-sm text-[#6E8F89]">Manage and track your inventory across warehouses</p>
          </div>
          <button
            onClick={() => navigate('/dashboard/warehouse/add-product')}
            className="flex items-center px-4 py-2 bg-[#1E3B3B] text-[#D6ECE6] rounded-lg hover:bg-[#2A4D4D] transition"
          >
            <FiPlus className="mr-2" />
            Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-6 md:flex-row">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-3 text-[#6E8F89]" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-[#B3D5CF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B3D5CF] text-[#1E3B3B] bg-white shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <select
            className="w-full pl-4 pr-10 py-2 border border-[#B3D5CF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B3D5CF] text-[#1E3B3B] bg-white shadow-sm md:w-48"
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
          >
            <option value="">All Warehouses</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>

          <select
            className="w-full pl-4 pr-10 py-2 border border-[#B3D5CF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B3D5CF] text-[#1E3B3B] bg-white shadow-sm md:w-48"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <button className="flex items-center px-4 py-2 border border-[#B3D5CF] rounded-lg bg-white text-[#1E3B3B] hover:bg-[#F5F9F8] w-full md:w-auto justify-center shadow">
            <FiFilter className="mr-2 text-[#6E8F89]" />
            <span>More Filters</span>
          </button>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Products Table */}
          <div className="flex-1 overflow-x-auto bg-white shadow-sm rounded-xl">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E3B3B]"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="p-6 text-center text-[#6E8F89]">
                {search || selectedWarehouse || selectedCategory 
                  ? 'No products match your filters' 
                  : 'No products found'}
              </div>
            ) : (
              <table className="min-w-full divide-y divide-[#6E8F89] text-xs md:text-sm">
                <thead className="bg-[#1E3B3B]">
                  <tr>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">Product</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">Stock</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">Warehouse</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">Category</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#6E8F89]">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-[#F5F9F8]">
                      <td className="px-2 py-4 md:px-6">
                        <div className="font-medium text-[#1E3B3B]">{product.name}</div>
                        <div className="text-xs text-[#6E8F89]">{product.subcategoryName}</div>
                      </td>
                      <td className="px-2 py-4 md:px-6">
                        <div className="flex items-center gap-2">
                          <span className="text-[#1E3B3B]">{product.stock}</span>
                          {getStockStatus(product.stock)}
                        </div>
                      </td>
                      <td className="px-2 py-4 md:px-6">
                        <div className="text-[#1E3B3B]">{product.warehouseName}</div>
                      </td>
                      <td className="px-2 py-4 md:px-6">
                        <div className="text-[#6E8F89]">{product.categoryName}</div>
                      </td>
                      <td className="px-2 py-4 md:px-6">
                        <button
                          onClick={() => handleAddStock(product.id, product.stock)}
                          className="px-3 py-1 text-xs text-white transition bg-[#1E3B3B] rounded hover:bg-[#2A4D4D] md:text-sm"
                        >
                          Add Stock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Stock Movements */}
          <div className="w-full lg:w-96">
            <div className="overflow-hidden bg-white shadow-sm rounded-xl">
              <div className="p-4 bg-[#1E3B3B]">
                <h3 className="text-lg font-semibold text-[#D6ECE6]">Recent Stock Movements</h3>
              </div>
              {loadingMovements ? (
                <div className="flex items-center justify-center p-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1E3B3B]"></div>
                </div>
              ) : stockMovements.length === 0 ? (
                <div className="p-6 text-center text-[#6E8F89]">No stock movements found</div>
              ) : (
                <div 
                  ref={movementsContainerRef}
                  className="overflow-y-auto h-96"
                >
                  <div className="divide-y divide-[#EADCD6]">
                    {stockMovements.map((movement) => (
                      <div key={movement.id} className="p-4 hover:bg-[#F5F9F8]">
                        <div className="flex items-start">
                          <div className={`flex items-center justify-center w-6 h-6 rounded-full mr-3 mt-1 ${
                            movement.movement_type === 'IN' ? 'bg-[#B3D5CF] text-[#1E3B3B]' : 'bg-[#EADCD6] text-[#1E3B3B]'
                          }`}>
                            {movement.movement_type === 'IN' ? (
                              <FiArrowUp className="text-xs" />
                            ) : (
                              <FiArrowDown className="text-xs" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium text-[#1E3B3B]">
                                {movement.product?.name || `Product #${movement.productId}`}
                              </span>
                              <span className={`font-medium ${
                                movement.movement_type === 'IN' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {movement.movement_type === 'IN' ? '+' : '-'}{movement.quantity}
                              </span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-xs text-[#6E8F89]">
                                {movement.movement_type === 'IN' ? 'Stock In' : 'Stock Out'}
                              </span>
                              <span className="text-xs text-[#6E8F89]">
                                {movement.created_at ? format(new Date(movement.created_at), 'MMM d, h:mm a') : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Stock Modal */}
        {addStockModalVisible && addStockProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-white rounded-xl">
              <h3 className="text-lg font-semibold text-[#1E3B3B] mb-4">
                Add Stock to {addStockProduct.name}
              </h3>
              <div className="mb-4">
                <label className="block text-sm text-[#6E8F89] mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  className="w-full pl-4 pr-4 py-2 border border-[#B3D5CF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B3D5CF] text-[#1E3B3B]"
                  value={addStockQuantity}
                  onChange={(e) => setAddStockQuantity(Number(e.target.value))}
                  placeholder="Enter quantity"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setAddStockModalVisible(false)}
                  className="px-4 py-2 border border-[#B3D5CF] rounded-lg text-[#1E3B3B] hover:bg-[#F5F9F8]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStockOk}
                  className="px-4 py-2 bg-[#1E3B3B] text-[#D6ECE6] rounded-lg hover:bg-[#2A4D4D]"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WarehouseInventory;