import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWarehouses } from '../../../apis/warehouse';
import { createOrder } from '../../../apis/orders';
import { fetchCategories } from '../../../apis/categories';
import { getProductsByWarehouse } from '../../../apis/products';
import { fetchSubcategories } from '../../../apis/subcategories';

const CreateOrder: React.FC = () => {
  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [items, setItems] = useState([{ productId: '', quantity: 1 }]);
  const [address, setAddress] = useState({ house: '', street: '', city: '', state: '', country: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCategories()
      .then((data) => {
        console.log('Fetched Categories:', data);
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        setError(error.message || 'Failed to fetch categories. Please try again.');
      });
  }, []);

  useEffect(() => {
    fetchWarehouses()
      .then((data) => {
        console.log('Fetched Warehouses:', data);
        setWarehouses(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error('Error fetching warehouses:', error);
        setError(error.message || 'Failed to fetch warehouses. Please try again.');
      });
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(Number(selectedCategory))
        .then((data) => {
          console.log('Fetched Subcategories:', data);
          setSubcategories(data);
        })
        .catch((error) => {
          console.error('Error fetching subcategories:', error);
          setError(error.message || 'Failed to fetch subcategories. Please try again.');
        });
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedWarehouse && selectedSubcategory) {
      getProductsByWarehouse(
        Number(selectedWarehouse),
        selectedCategory ? Number(selectedCategory) : undefined,
        Number(selectedSubcategory)
      )
        .then((data) => {
          console.log('Fetched Products:', data);
          setProducts(data);
        })
        .catch((error) => {
          console.error('Error fetching products:', error);
          setError(error.message || 'Failed to fetch products. Please try again.');
        });
    } else {
      setProducts([]);
    }
  }, [selectedWarehouse, selectedCategory, selectedSubcategory]);

  const handleItemChange = (idx: number, field: string, value: any) => {
    setItems(items => items.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const addItem = () => setItems([...items, { productId: '', quantity: 1 }]);
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Backend expects: warehouseId, items [{productId, quantity}], house, street, city, state, country
      await createOrder({
        warehouseId: Number(selectedWarehouse),
        items: items.map(i => ({ productId: Number(i.productId), quantity: Number(i.quantity) })),
        house: address.house,
        street: address.street,
        city: address.city,
        state: address.state,
        country: address.country,
      });
      setSuccess('Order created successfully!');
      alert('Order created successfully!');
      setTimeout(() => navigate('/dashboard/vendor/orders'), 1200);
    } catch (err: any) {
      setError('Failed to create order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen px-2 pt-4 pb-8 transition-all duration-300 bg-gray-50 sm:px-4 md:px-6"
      style={{ marginLeft: '0', paddingTop: '64px' }}
    >
      <div className="ml-0">
        <div className="max-w-2xl p-6 mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-[#1E3B3B]">Create Order</h2>
          {error && <div className="mb-2 text-red-600">{error}</div>}
          {success && <div className="mb-2 text-green-600">{success}</div>}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white rounded-lg shadow">
            <div>
              <label className="block mb-1 font-semibold">Warehouse</label>
              <select className="w-full p-2 border rounded" value={selectedWarehouse} onChange={e => setSelectedWarehouse(e.target.value)} required>
                <option value="">Select warehouse</option>
                {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-semibold">Category</label>
              <select className="w-full p-2 border rounded" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} required>
                <option value="">Select category</option>
                {Array.isArray(categories) && categories.length > 0 ? (
                  categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                ) : (
                  <option value="">No categories available</option>
                )}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-semibold">Subcategory</label>
              <select
                className="w-full p-2 border rounded"
                value={selectedSubcategory}
                onChange={e => setSelectedSubcategory(e.target.value)}
                required
              >
                <option value="">Select subcategory</option>
                {subcategories.map(sc => (
                  <option key={sc.id} value={sc.id}>{sc.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-semibold">Order Items</label>
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <select
                    className="flex-1 p-2 border rounded"
                    value={item.productId}
                    onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                    required
                  >
                    <option value="">Select product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.quantity} available
                      </option>
                    ))}
                  </select>
                  <input type="number" min={1} className="w-24 p-2 border rounded" value={item.quantity} onChange={e => handleItemChange(idx, 'quantity', e.target.value)} required />
                  {items.length > 1 && <button type="button" className="text-red-600" onClick={() => removeItem(idx)}>Remove</button>}
                </div>
              ))}
              <button type="button" className="mt-1 text-blue-600" onClick={addItem}>+ Add Item</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input className="p-2 border rounded" placeholder="House" value={address.house} onChange={e => setAddress({ ...address, house: e.target.value })} required />
              <input className="p-2 border rounded" placeholder="Street" value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} required />
              <input className="p-2 border rounded" placeholder="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} required />
              <input className="p-2 border rounded" placeholder="State" value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} required />
              <input className="col-span-2 p-2 border rounded" placeholder="Country" value={address.country} onChange={e => setAddress({ ...address, country: e.target.value })} required />
            </div>
            <button type="submit" className="bg-[#1E3B3B] text-white px-4 py-2 rounded hover:bg-[#37635a] transition" disabled={loading}>{loading ? 'Creating...' : 'Create Order'}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
