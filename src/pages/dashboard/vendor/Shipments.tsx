import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { fetchOrders } from '../../../apis/orders';
import type { RootState } from '../../../redux/store';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  FiSearch,
  FiFilter,
  FiEye,
  
} from 'react-icons/fi';
import { format } from 'date-fns';

interface Order {
  id: number;
  status: string;
  total_amount: number;
  created_at: string;
  warehouse?: {
    name: string;
  };
  location?: {
    house: string;
    street: string;
    city: string;
    state: string;
    country: string;
  };
}

const Shipments: React.FC = () => {
  const navigate = useNavigate();
  const { currentUserId } = useSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  const getStatusTag = (status: string) => {
    switch (status.toLowerCase()) {
      case 'shipped':
        return <span className="bg-[#EADCD6] text-[#1E3B3B] px-3 py-1 rounded-full text-xs">Shipped</span>;
      case 'delivered':
        return <span className="bg-[#B3D5CF] text-[#1E3B3B] px-3 py-1 rounded-full text-xs">Delivered</span>;
      case 'pending':
        return <span className="bg-[#F0E5D8] text-[#1E3B3B] px-3 py-1 rounded-full text-xs">Pending</span>;
      default:
        return <span className="bg-gray-200 text-[#1E3B3B] px-3 py-1 rounded-full text-xs">{status}</span>;
    }
  };

  const fetchOrdersData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchOrders();
      const shippedOrders = data.filter((order: Order) => order.status === 'Shipped');
      setOrders(shippedOrders);
      setFilteredOrders(shippedOrders);
    } catch (err) {
      setError('Failed to fetch orders.');
      message.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchOrdersData();
  }, [fetchOrdersData]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredOrders(Array.isArray(orders) ? orders : []);
    } else {
      const filtered = Array.isArray(orders)
        ? orders.filter(order =>
            order.id.toString().includes(searchQuery) ||
            (order.warehouse?.name && order.warehouse.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (order.location?.city && order.location.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
            order.total_amount.toString().includes(searchQuery)
          )
        : [];
      setFilteredOrders(filtered);
    }
  }, [searchQuery, orders]);

  const formatAddress = (location: any) => {
    if (!location) return 'No Delivery Location';
    const { house, street, city, state, country } = location;
    return `${house ? house + ', ' : ''}${street ? street + ', ' : ''}${city ? city + ', ' : ''}${state ? state + ', ' : ''}${country || ''}`;
  };

  return (
    <div
      className="min-h-screen px-2 pt-4 pb-8 transition-all duration-300 bg-gray-50 sm:px-4 md:px-6"
      style={{ marginLeft: '0', paddingTop: '64px' }}
    >
      <div className="ml-0">
        <div className="flex flex-col items-start justify-between gap-4 mb-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#1E3B3B]">Shipment Tracking</h2>
            <p className="text-sm text-[#6E8F89]">Manage and track your shipped orders</p>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="flex flex-col gap-4 mb-6 md:flex-row">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-3 text-[#6E8F89]" />
            <input
              type="text"
              placeholder="Search orders by ID, warehouse, city or amount..."
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

        {/* Orders Table */}
        <div className="overflow-x-auto bg-white shadow-sm rounded-xl">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E3B3B]"></div>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-[#2A4D4D]">{error}</div>
          ) : (Array.isArray(filteredOrders) ? filteredOrders.length === 0 : true) ? (
            <div className="p-6 text-center text-[#6E8F89]">
              {searchQuery ? 'No orders match your search' : 'No shipped orders found'}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-[#6E8F89] text-xs md:text-sm">
              <thead className="bg-[#1E3B3B]">
                <tr>
                  <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">Order ID</th>
                  <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">Status</th>
                  <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">Warehouse</th>
                  <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">Delivery Location</th>
                  <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">Total Amount</th>
                  <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">Shipped Date</th>
                  <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#6E8F89]">
                {(Array.isArray(filteredOrders) ? filteredOrders : []).map((order) => (
                  <tr key={order.id} className="hover:bg-[#F5F9F8]">
                    <td className="px-2 py-4 md:px-6 whitespace-nowrap">
                      <span className="font-medium text-[#1E3B3B]">#{order.id.toString().slice(-6)}</span>
                    </td>
                    <td className="px-2 py-4 md:px-6 whitespace-nowrap">
                      {getStatusTag(order.status)}
                    </td>
                    <td className="px-2 py-4 md:px-6 whitespace-nowrap">
                      <div className="text-[#1E3B3B]">
                        {order.warehouse?.name || 'No Warehouse Info'}
                      </div>
                    </td>
                    <td className="px-2 py-4 md:px-6">
                      <div className="text-[#6E8F89] line-clamp-2">
                        {formatAddress(order.location)}
                      </div>
                    </td>
                    <td className="px-2 py-4 md:px-6 whitespace-nowrap">
                      <div className="font-medium text-[#1E3B3B]">
                        ₹{typeof order.total_amount === 'number' ? order.total_amount.toFixed(2) : Number(order.total_amount).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-2 py-4 md:px-6 whitespace-nowrap">
                      <div className="text-[#6E8F89]">
                        {order.created_at ? format(new Date(order.created_at), 'MMM d, yyyy') : '-'}
                      </div>
                    </td>
                    <td className="px-2 py-4 md:px-6 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/dashboard/vendor/orders/${order.id}`)}
                        className="flex items-center bg-[#1E3B3B] text-[#D6ECE6] px-3 py-1 rounded hover:bg-[#2A4D4D] transition text-xs md:text-sm"
                      >
                        <FiEye className="mr-1" />
                        Track
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

export default Shipments;