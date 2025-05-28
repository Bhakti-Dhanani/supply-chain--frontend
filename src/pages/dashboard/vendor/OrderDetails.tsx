import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOrderById } from '../../../apis/orders';
import { FiMapPin } from 'react-icons/fi';
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.GOOGLE_MAPS_API_KEY || '';

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

  useEffect(() => {
    if (order?.location && order.warehouse) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: { lat: Number(order.warehouse.latitude), lng: Number(order.warehouse.longitude) },
          destination: { lat: Number(order.location.latitude), lng: Number(order.location.longitude) },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  }, [order]);

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

  return (
    <div className="flex flex-col md:flex-row p-6 ml-64 gap-6">
      <div className="flex-1 min-h-[400px]">
        {order?.location && order.location.latitude && order.location.longitude && isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '400px', borderRadius: '12px' }}
            onLoad={(map) => {
              mapRef.current = map;
            }}
          >
            <Marker
              position={{ lat: Number(order.location.latitude), lng: Number(order.location.longitude) }}
              label={{ text: "Order Location", color: "blue" }}
            />
            {order.warehouse?.latitude && order.warehouse?.longitude && (
              <Marker
                position={{ lat: Number(order.warehouse.latitude), lng: Number(order.warehouse.longitude) }}
                label={{ text: "Warehouse Location", color: "green" }}
              />
            )}
            {directions && <DirectionsRenderer directions={directions} />}
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
            {/* Warehouse Details */}
            {order.warehouse && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2 text-[#1E3B3B]">Warehouse Details</h3>
                <div className="mb-1"><span className="font-semibold">Name:</span> {order.warehouse.name}</div>
                <div className="mb-1"><span className="font-semibold">Address:</span> {order.warehouse.address}</div>
                {order.warehouse.manager && (
                  <div className="mb-1"><span className="font-semibold">Manager:</span> {order.warehouse.manager.name}</div>
                )}
                {/* Add more warehouse fields as needed */}
              </div>
            )}
            {/* Order Items */}
            {order.items && Array.isArray(order.items) && order.items.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2 text-[#1E3B3B]">Order Items</h3>
                <table className="min-w-full bg-gray-50 rounded">
                  <thead>
                    <tr className="text-[#1E3B3B]">
                      <th className="py-1 px-2 text-left">Product</th>
                      <th className="py-1 px-2 text-left">Quantity</th>
                      <th className="py-1 px-2 text-left">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item: any, idx: number) => (
                      <tr key={idx} className="border-b">
                        <td className="py-1 px-2">{item.product?.name || '-'}</td>
                        <td className="py-1 px-2">{item.quantity}</td>
                        <td className="py-1 px-2">{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
