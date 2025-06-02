import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../../redux/store';
import { setOrders } from '../../../redux/slices/orderSlice';
import { fetchOrders } from '../../../apis/orders';
import { 
  FiPlus, 
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiAlertCircle,
  FiSearch,
  FiFilter,
  FiCalendar
} from 'react-icons/fi';
import { format } from 'date-fns';
import { Spin } from 'antd';

const Orders: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUserId } = useSelector((state: RootState) => state.auth);
  const ordersRaw = useSelector((state: RootState) => {
    if (currentUserId) {
      return state.orders.orders[currentUserId];
    }
    return [];
  });
  const orders = Array.isArray(ordersRaw) ? ordersRaw : [];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getOrders = async () => {
      if (currentUserId) {
        setLoading(true);
        setError('');
        try {
          const data = await fetchOrders();
          dispatch(setOrders({ userId: currentUserId, orders: data }));
        } catch (err: any) {
          setError('Failed to fetch orders.');
        } finally {
          setLoading(false);
        }
      }
    };
    getOrders();
  }, [currentUserId, dispatch]);

  const filteredOrders = orders.filter(order => 
    order.id.toString().includes(searchQuery) ||
    order.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <FiClock className="mr-2 text-[#EADCD6]" />;
      case 'completed':
      case 'delivered':
        return <FiCheckCircle className="mr-2 text-[#B3D5CF]" />;
      case 'shipped':
        return <FiTruck className="mr-2 text-[#6E8F89]" />;
      default:
        return <FiAlertCircle className="mr-2 text-[#2A4D4D]" />;
    }
  };

  const statusTagColors: Record<string, string> = {
    'pending': 'bg-[#EADCD6] text-[#1E3B3B]',
    'completed': 'bg-[#B3D5CF] text-[#1E3B3B]',
    'delivered': 'bg-[#B3D5CF] text-[#1E3B3B]',
    'shipped': 'bg-[#6E8F89] text-[#D6ECE6]',
    'cancelled': 'bg-[#2A4D4D] text-[#D6ECE6]'
  };

  return (
    <div
      className="min-h-screen px-2 pt-4 pb-8 transition-all duration-300 bg-gray-50 sm:px-4 md:px-6"
      style={{ marginLeft: '0', paddingTop: '64px' }}
    >
      <div className="ml-0">
        <div className="flex flex-col items-start justify-between gap-4 mb-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#1E3B3B]">My Orders</h2>
            <p className="text-sm text-[#6E8F89]">Manage and track your orders</p>
          </div>
          <button
            className="flex items-center bg-[#1E3B3B] text-[#D6ECE6] px-4 py-2 rounded-lg hover:bg-[#2A4D4D] transition-colors mt-2 md:mt-0 w-full md:w-auto justify-center shadow"
            onClick={() => navigate('/dashboard/vendor/orders/create')}
          >
            <FiPlus className="mr-2" />
            Create Order
          </button>
        </div>

        {/* Enhanced Search Bar */}
        <div className="flex flex-col gap-4 mb-6 md:flex-row">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-3 text-[#6E8F89]" />
            <input
              type="text"
              placeholder="Search orders by ID or status..."
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

        {/* Orders Table - Enhanced UI */}
        <div className="overflow-x-auto rounded-xl bg-white shadow border border-[#B3D5CF]">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Spin size="large" />
            </div>
          ) : error ? (
            <div className="p-6 text-center text-[#2A4D4D]">{error}</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-6 text-center text-[#6E8F89]">
              {searchQuery ? 'No orders match your search' : 'No orders found for your account'}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-[#EADCD6] text-xs md:text-sm">
              <thead className="bg-[#F5F9F8]">
                <tr>
                  <th className="px-2 md:px-6 py-3 text-left font-semibold text-[#1E3B3B] uppercase tracking-wider">Order ID</th>
                  <th className="px-2 md:px-6 py-3 text-left font-semibold text-[#1E3B3B] uppercase tracking-wider">Amount</th>
                  <th className="px-2 md:px-6 py-3 text-left font-semibold text-[#1E3B3B] uppercase tracking-wider">Status</th>
                  <th className="px-2 md:px-6 py-3 text-left font-semibold text-[#1E3B3B] uppercase tracking-wider">Date</th>
                  <th className="px-2 md:px-6 py-3 text-left font-semibold text-[#1E3B3B] uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#F5F9F8]">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F5F9F8] transition">
                    <td className="px-2 py-4 md:px-6 whitespace-nowrap">
                      <span className="font-medium text-[#1E3B3B]">#{order.id.toString().slice(-6)}</span>
                    </td>
                    <td className="px-2 py-4 md:px-6 whitespace-nowrap">
                      <div className="font-medium text-[#1E3B3B]">
                        {typeof order.total_amount === 'number' ? `$${order.total_amount.toFixed(2)}` : `$${Number(order.total_amount || 0).toFixed(2)}`}
                      </div>
                    </td>
                    <td className="px-2 py-4 md:px-6 whitespace-nowrap">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusTagColors[order.status.toLowerCase()] || 'bg-[#EADCD6] text-[#1E3B3B]'}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                    </td>
                    <td className="px-2 py-4 md:px-6 whitespace-nowrap">
                      <div className="flex items-center text-[#6E8F89]">
                        <FiCalendar className="mr-2" />
                        {order.created_at ? format(new Date(order.created_at), 'MMM d, yyyy') : '-'}
                      </div>
                    </td>
                    <td className="px-2 py-4 md:px-6 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/dashboard/vendor/orders/${order.id}`)}
                          className="bg-[#1E3B3B] text-[#D6ECE6] px-3 py-1 rounded hover:bg-[#2A4D4D] transition text-xs md:text-sm w-full md:w-auto shadow"
                        >
                          View Details
                        </button>
                      </div>
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

export default Orders;