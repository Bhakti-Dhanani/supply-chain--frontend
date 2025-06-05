import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { message } from 'antd';
import { fetchMyWarehouses } from '../../../apis/warehouse';
import { fetchCategories, fetchSubcategories } from '../../../apis/inventory';
import { createProduct } from '../../../apis/products';

const AddProduct: React.FC = () => {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    warehouseId: '',
    categoryId: '',
    subcategoryId: '',
    price: 0,
    quantity: 0,
    description: '',
    sku: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const ws = await fetchMyWarehouses();
        setWarehouses(ws);
        const cats = await fetchCategories();
        setCategories(cats);
      } catch (err) {
        message.error('Failed to load form data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Ensure subcategories are fetched dynamically based on the selected category
  const handleCategoryChange = async (categoryId: string) => {
    setFormValues({ ...formValues, categoryId, subcategoryId: '' });
    try {
      const subs = await fetchSubcategories(categoryId);
      setSubcategories(subs);
    } catch (err) {
      message.error('Failed to load subcategories');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues({...formValues, [name]: value});
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormValues({...formValues, [name]: value});
  };

  const onFinish = async () => {
    setLoading(true);
    try {
      await createProduct(formValues);
      message.success('Product added successfully');
      navigate('/dashboard/warehouse/inventory');
    } catch (err) {
      message.error('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-2 pt-4 pb-8 transition-all duration-300 bg-gray-50 sm:px-4 md:px-6">
      <div className="ml-0">
        <div className="flex flex-col items-start justify-between gap-4 mb-6 md:flex-row md:items-center">
          <div>
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center mb-2 text-[#1E3B3B] hover:text-[#2A4D4D] transition"
            >
              <FiArrowLeft className="mr-1" />
              Back
            </button>
            <h2 className="text-2xl font-bold text-[#1E3B3B]">Add New Product</h2>
            <p className="text-sm text-[#6E8F89]">Fill in the details to add a new product to your inventory</p>
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto">
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <form onSubmit={(e) => { e.preventDefault(); onFinish(); }}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Product Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#1E3B3B] mb-1">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#B3D5CF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B3D5CF] text-[#1E3B3B]"
                    required
                  />
                </div>

                {/* Warehouse */}
                <div>
                  <label className="block text-sm font-medium text-[#1E3B3B] mb-1">Warehouse</label>
                  <select
                    name="warehouseId"
                    value={formValues.warehouseId}
                    onChange={(e) => handleSelectChange('warehouseId', e.target.value)}
                    className="w-full px-4 py-2 border border-[#B3D5CF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B3D5CF] text-[#1E3B3B]"
                    required
                  >
                    <option value="">Select Warehouse</option>
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-[#1E3B3B] mb-1">Category</label>
                  <select
                    name="categoryId"
                    value={formValues.categoryId}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-4 py-2 border border-[#B3D5CF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B3D5CF] text-[#1E3B3B]"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Subcategory */}
                <div>
                  <label className="block text-sm font-medium text-[#1E3B3B] mb-1">Subcategory</label>
                  <select
                    name="subcategoryId"
                    value={formValues.subcategoryId}
                    onChange={(e) => handleSelectChange('subcategoryId', e.target.value)}
                    className="w-full px-4 py-2 border border-[#B3D5CF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B3D5CF] text-[#1E3B3B]"
                    required
                    disabled={!formValues.categoryId}
                  >
                    <option value="">Select Subcategory</option>
                    {subcategories.map((sc) => (
                      <option key={sc.id} value={sc.id}>{sc.name}</option>
                    ))}
                  </select>
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-sm font-medium text-[#1E3B3B] mb-1">SKU</label>
                  <input
                    type="text"
                    name="sku"
                    value={formValues.sku}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#B3D5CF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B3D5CF] text-[#1E3B3B]"
                    required
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-[#1E3B3B] mb-1">Price</label>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    value={formValues.price}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#B3D5CF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B3D5CF] text-[#1E3B3B]"
                    required
                  />
                </div>

                {/* Initial Stock */}
                <div>
                  <label className="block text-sm font-medium text-[#1E3B3B] mb-1">Initial Stock</label>
                  <input
                    type="number"
                    name="quantity"
                    min="0"
                    value={formValues.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#B3D5CF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B3D5CF] text-[#1E3B3B]"
                    required
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#1E3B3B] mb-1">Description</label>
                  <textarea
                    name="description"
                    rows={4}
                    value={formValues.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#B3D5CF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B3D5CF] text-[#1E3B3B]"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 border border-[#B3D5CF] rounded-lg text-[#1E3B3B] hover:bg-[#F5F9F8] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#1E3B3B] text-[#D6ECE6] rounded-lg hover:bg-[#2A4D4D] transition disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;