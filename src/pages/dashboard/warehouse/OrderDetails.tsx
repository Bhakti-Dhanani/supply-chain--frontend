import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOrderById } from '../../../apis/orders';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Card, Spin } from 'antd';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const mapRef = useRef<google.maps.Map | null>(null);
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: GOOGLE_MAPS_API_KEY });

  useEffect(() => {
    if (!id) return;
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

  if (loading) return <Spin size="large" />;
  if (error) return <div>{error}</div>;
  if (!order) return <div>No order found.</div>;

  // Defensive checks for map coordinates
  const deliveryLat = order?.location?.latitude || order?.deliveryLat || 0;
  const deliveryLng = order?.location?.longitude || order?.deliveryLng || 0;

  return (
    <div className="order-details">
      <Card title="Order Summary" bordered={false}>
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Total:</strong> ₹{order.total_amount}</p>
        <p><strong>Delivery Address:</strong> {order.location ? `${order.location.house}, ${order.location.street}, ${order.location.city}, ${order.location.state}, ${order.location.country}` : '-'}</p>
        <p><strong>Warehouse:</strong> {order.warehouse?.name || '-'}</p>
      </Card>

      {isLoaded && deliveryLat && deliveryLng && (
        <GoogleMap
          center={{ lat: deliveryLat, lng: deliveryLng }}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '400px' }}
          onLoad={map => { mapRef.current = map; }}
        >
          <Marker position={{ lat: deliveryLat, lng: deliveryLng }} />
        </GoogleMap>
      )}
    </div>
  );
};

export default OrderDetails;