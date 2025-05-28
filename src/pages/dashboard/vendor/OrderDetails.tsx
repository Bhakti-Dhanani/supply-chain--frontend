import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOrderById } from '../../../apis/orders';
import { FiMapPin } from 'react-icons/fi';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.GOOGLE_MAPS_API_KEY || '';

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (!id) return; // Guard clause for undefined id
    const getOrder = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchOrderById(id);
        setOrder(data);
      } catch (err) {
        setError('Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    };
    getOrder();
  }, [id]);

  return (
    <div className="flex flex-col md:flex-row p-6 ml-64 gap-6">
      <div className="flex-1 min-h-[400px]">
        {order?.location && order.location.latitude && order.location.longitude && isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '400px', borderRadius: '12px' }}
            center={{ lat: Number(order.location.latitude), lng: Number(order.location.longitude) }}
            zoom={15}
          >
            <Marker position={{ lat: Number(order.location.latitude), lng: Number(order.location.longitude) }} />
          </GoogleMap>
        ) : (
          <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg text-[#1E3B3B]">
            Location not available
          </div>
        )}
      </div>
      <div className="w-full md:w-96 bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="text-[#1E3B3B]">Loading order details...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : order ? (
          <>
            <h2 className="text-xl font-bold mb-4 text-[#1E3B3B]">Order #{order.id}</h2>
            <div className="mb-2"><span className="font-semibold">Status:</span> {order.status}</div>
            <div className="mb-2"><span className="font-semibold">Amount:</span> {order.total_amount}</div>
            <div className="mb-2"><span className="font-semibold">Date:</span> {order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}</div>
            {order.location && (
              <div className="mb-2 flex items-center">
                <FiMapPin className="mr-2 text-[#1E3B3B]" />
                <span className="font-semibold">Address:</span>&nbsp;{order.location.house}, {order.location.street}, {order.location.city}, {order.location.state}, {order.location.country}
              </div>
            )}
            {/* Add more order details as needed */}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default OrderDetails;
