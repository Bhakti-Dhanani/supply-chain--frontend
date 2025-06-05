import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, Polyline, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import { Spin } from 'antd';
import { fetchOrders } from '../../../apis/orders';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const VehicleRouting: React.FC = () => {
  const [orderLocations, setOrderLocations] = useState<any[]>([]);
  const [directions, setDirections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const orders = await fetchOrders();
        const locations = orders
          .filter((order: any) => order.status === 'shipped')
          .map((order: any) => ({
            id: order.id,
            warehouse: order.warehouse?.location,
            delivery: order.location,
          }));
        setOrderLocations(locations);

        // Fetch directions for each order
        const directionsService = new window.google.maps.DirectionsService();
        const directionsPromises = locations.map((location: { id: number; warehouse: any; delivery: any }) => {
          if (location.warehouse && location.delivery) {
            return new Promise((resolve, reject) => {
              directionsService.route(
                {
                  origin: {
                    lat: location.warehouse.latitude,
                    lng: location.warehouse.longitude,
                  },
                  destination: {
                    lat: location.delivery.latitude,
                    lng: location.delivery.longitude,
                  },
                  travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                  if (status === window.google.maps.DirectionsStatus.OK) {
                    resolve(result);
                  } else {
                    reject(`Failed to fetch directions for order ${location.id}`);
                  }
                }
              );
            });
          }
          return null;
        });

        const directionsResults = await Promise.all(directionsPromises);
        setDirections(directionsResults.filter(Boolean));
      } catch (err) {
        setError('Failed to fetch order locations or directions.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const defaultCenter = orderLocations.length
    ? { lat: orderLocations[0].warehouse.latitude, lng: orderLocations[0].warehouse.longitude }
    : { lat: 23.0225, lng: 72.5714 }; // Default: Ahmedabad

  return (
    <div className="min-h-screen px-2 sm:px-4 pt-4 pb-8">
      <h1 className="text-2xl font-bold text-[#1E3B3B] mb-6">Vehicle Routing</h1>
      {loading || !isLoaded ? (
        <div className="flex items-center justify-center h-96">
          <Spin size="large" />
        </div>
      ) : error ? (
        <div className="text-red-500 p-6">{error}</div>
      ) : (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '600px', borderRadius: '12px' }}
          center={defaultCenter}
          zoom={8}
        >
          {orderLocations.map((location) => (
            <React.Fragment key={location.id}>
              {location.warehouse && (
                <Marker
                  position={{ lat: location.warehouse.latitude, lng: location.warehouse.longitude }}
                  label={`Warehouse ${location.id}`}
                />
              )}
              {location.delivery && (
                <Marker
                  position={{ lat: location.delivery.latitude, lng: location.delivery.longitude }}
                  label={`Delivery ${location.id}`}
                />
              )}
              {location.warehouse && location.delivery && (
                <Polyline
                  path={[
                    { lat: location.warehouse.latitude, lng: location.warehouse.longitude },
                    { lat: location.delivery.latitude, lng: location.delivery.longitude },
                  ]}
                  options={{ strokeColor: '#0000FF', strokeOpacity: 0.8, strokeWeight: 2 }}
                />
              )}
            </React.Fragment>
          ))}
          {directions.map((direction, index) => (
            <DirectionsRenderer
              key={index}
              directions={direction}
              options={{ polylineOptions: { strokeColor: '#FF0000', strokeWeight: 4 } }}
            />
          ))}
        </GoogleMap>
      )}
    </div>
  );
};

export default VehicleRouting;
