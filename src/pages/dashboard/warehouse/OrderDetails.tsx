import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOrderById } from '../../../apis/orders';
import { FiMapPin, FiPackage, FiTruck, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import { Card, Spin, Tag } from 'antd';
import { format } from 'date-fns';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

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

  useEffect(() => {
    if (
      order?.location &&
      order.warehouse &&
      isLoaded &&
      window.google &&
      window.google.maps &&
      typeof window.google.maps.DirectionsService === 'function'
    ) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: { lat: Number(order.warehouse.latitude), lng: Number(order.warehouse.longitude) },
          destination: { lat: Number(order.location.latitude), lng: Number(order.location.longitude) },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`error fetching directions`, result);
          }
        }
      );
    }
  }, [order, isLoaded]);

  useEffect(() => {
    if (mapRef.current && order?.location && order.warehouse) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend({ lat: Number(order.location.latitude), lng: Number(order.location.longitude) });
      if (order.warehouse.latitude && order.warehouse.longitude) {
        bounds.extend({ lat: Number(order.warehouse.latitude), lng: Number(order.warehouse.longitude) });
      }
      mapRef.current.fitBounds(bounds);
    }
  }, [order]);

  if (loading) return <Spin size="large" />;
  if (error) return <div>{error}</div>;

  return (
    <div className="order-details">
      <Card title="Order Summary" bordered={false}>
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Total:</strong> ${order.total}</p>
        <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
        <p><strong>Warehouse:</strong> {order.warehouse.name}</p>
      </Card>

      {isLoaded && (
        <GoogleMap
          center={{ lat: order.deliveryLat, lng: order.deliveryLng }}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '400px' }}
          onLoad={(map) => { mapRef.current = map; }}
        >
          <Marker position={{ lat: order.deliveryLat, lng: order.deliveryLng }} />
        </GoogleMap>
      )}
    </div>
  );
};

export default OrderDetails;