import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../../redux/store';
import { setOrders } from '../../../redux/slices/orderSlice';
import { fetchOrders } from '../../../apis/orders';

const Orders: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const ordersRaw = useSelector((state: RootState) => state.orders.orders);
  const orders = Array.isArray(ordersRaw) ? ordersRaw : [];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const getOrders = async () => {
      setLoading(true);
      setError('');
      try {        // Fetch only this vendor's orders from backend
        const data = await fetchOrders();
        dispatch(setOrders(data));
      } catch (err: any) {
        setError('Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };
    if (typeof user?.id === 'number') getOrders();
  }, [user, dispatch]);

  return (
    <div className="p-6 ml-64">
      <h2 className="text-2xl font-bold mb-4 text-[#1E3B3B]">My Orders</h2>
      {loading && <div className="text-[#1E3B3B]">Loading orders...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && orders.length === 0 && (
        <div className="text-[#1E3B3B]">No orders found for your account.</div>
      )}
      {!loading && !error && orders.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-[#6E8F89] text-[#1E3B3B]">
                <th className="py-2 px-4 text-left">Order ID</th>
                <th className="py-2 px-4 text-left">Amount</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <tr key={order.id} className="border-b hover:bg-[#D6ECE6]">
                  <td className="py-2 px-4">{order.id}</td>
                  <td className="py-2 px-4">{order.total_amount ?? '-'}</td>
                  <td className="py-2 px-4">{order.status}</td>
                  <td className="py-2 px-4">{order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}</td>
                  <td className="py-2 px-4">
                    <button
                      className="bg-[#1E3B3B] text-white px-3 py-1 rounded hover:bg-[#37635a] transition"
                      onClick={() => navigate(`/dashboard/vendor/orders/${order.id}`)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
