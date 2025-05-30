import React, { useEffect, useState } from 'react';
import { fetchMyWarehouses } from '../../../apis/warehouse';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Card, Spin } from 'antd';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const WarehouseLocations: React.FC = () => {
  const [warehouses, setWarehouses] = useState<any[]>([]);
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
        const data = await fetchMyWarehouses();
        setWarehouses(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError('Failed to fetch warehouses.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Center map on first warehouse or default location
  const defaultCenter = warehouses.length && warehouses[0].location && warehouses[0].location.latitude && warehouses[0].location.longitude
    ? { lat: Number(warehouses[0].location.latitude), lng: Number(warehouses[0].location.longitude) }
    : { lat: 23.0225, lng: 72.5714 }; // Default: Ahmedabad

  return (
    <div className="min-h-screen px-2 sm:px-4 pt-4 pb-8">
      <h1 className="text-2xl font-bold text-[#1E3B3B] mb-6">Warehouse Locations</h1>
      <Card className="mb-6 p-0 overflow-hidden border-0 shadow-sm rounded-xl">
        {loading || !isLoaded ? (
          <div className="flex items-center justify-center h-96">
            <Spin size="large" />
          </div>
        ) : error ? (
          <div className="text-red-500 p-6">{error}</div>
        ) : (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '400px', borderRadius: '12px' }}
            center={defaultCenter}
            zoom={8}
          >
            {warehouses.map((wh) =>
              wh.location && wh.location.latitude && wh.location.longitude ? (
                <Marker
                  key={wh.id}
                  position={{ lat: Number(wh.location.latitude), lng: Number(wh.location.longitude) }}
                  label={wh.name}
                />
              ) : null
            )}
          </GoogleMap>
        )}
      </Card>
      <Card className="p-0 overflow-hidden border-0 shadow-sm rounded-xl">
        <h2 className="text-lg font-semibold text-[#1E3B3B] mb-4">Your Warehouses</h2>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Spin size="large" />
          </div>
        ) : error ? (
          <div className="text-red-500 p-6">{error}</div>
        ) : warehouses.length === 0 ? (
          <div className="p-6 text-[#6E8F89]">No warehouses found for your account.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#EADCD6] text-xs md:text-sm">
              <thead className="bg-[#F5F9F8]">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-[#1E3B3B] uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-[#1E3B3B] uppercase tracking-wider">Capacity</th>
                  <th className="px-4 py-3 text-left font-semibold text-[#1E3B3B] uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-left font-semibold text-[#1E3B3B] uppercase tracking-wider">Created At</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#F5F9F8]">
                {warehouses.map((wh) => (
                  <tr key={wh.id}>
                    <td className="px-4 py-3 font-medium text-[#1E3B3B]">{wh.name}</td>
                    <td className="px-4 py-3">{wh.capacity}</td>
                    <td className="px-4 py-3">
                      {wh.location ? `${wh.location.house || ''} ${wh.location.street || ''}, ${wh.location.city || ''}, ${wh.location.state || ''}, ${wh.location.country || ''}` : 'N/A'}
                    </td>
                    <td className="px-4 py-3">{wh.created_at ? new Date(wh.created_at).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default WarehouseLocations;
