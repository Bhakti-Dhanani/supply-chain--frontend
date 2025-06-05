import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import axios from '../../../config/axios.config';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { 
  FiSearch,
  FiFilter,
  FiMapPin
} from 'react-icons/fi';
import { format } from 'date-fns';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

interface Warehouse {
  id: number;
  name: string;
  capacity: number;
  created_at: string;
  location?: {
    latitude: number;
    longitude: number;
    house?: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

const WarehousesPage: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const fetchWarehouses = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('/warehouses');
        setWarehouses(response.data);
      } catch (error) {
        setError('Failed to fetch warehouses.');
        message.error('Failed to fetch warehouses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouses();
  }, []);

  const filteredWarehouses = warehouses.filter(warehouse =>
    searchQuery.trim() === '' ||
    warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    warehouse.id.toString().includes(searchQuery) ||
    warehouse.capacity.toString().includes(searchQuery)
  );

  const defaultCenter = warehouses.length && warehouses[0].location && warehouses[0].location.latitude && warehouses[0].location.longitude
    ? { lat: Number(warehouses[0].location.latitude), lng: Number(warehouses[0].location.longitude) }
    : { lat: 23.0225, lng: 72.5714 }; // Default: Ahmedabad

  const formatAddress = (location: any) => {
    if (!location) return 'N/A';
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
            <h2 className="text-2xl font-bold text-[#1E3B3B]">Warehouse Management</h2>
            <p className="text-sm text-[#6E8F89]">View and manage your warehouse inventory</p>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="flex flex-col gap-4 mb-6 md:flex-row">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-3 text-[#6E8F89]" />
            <input
              type="text"
              placeholder="Search warehouses by name, ID or capacity..."
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

        {/* Map Section */}
        <div className="mb-6 overflow-hidden bg-white shadow-sm rounded-xl">
          <div className="p-4 border-b border-[#EADCD6]">
            <h3 className="text-lg font-semibold text-[#1E3B3B] flex items-center">
              <FiMapPin className="mr-2" />
              Warehouse Locations
            </h3>
          </div>
          {loading || !isLoaded ? (
            <div className="flex items-center justify-center h-64">
              <Spin size="large" />
            </div>
          ) : error ? (
            <div className="p-6 text-center text-[#2A4D4D]">{error}</div>
          ) : (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '400px' }}
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
        </div>

        {/* Warehouses Table */}
        <div className="overflow-x-auto bg-white shadow-sm rounded-xl">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E3B3B]"></div>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-[#2A4D4D]">{error}</div>
          ) : filteredWarehouses.length === 0 ? (
            <div className="p-6 text-center text-[#6E8F89]">
              {searchQuery ? 'No warehouses match your search' : 'No warehouses found'}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-[#6E8F89] text-xs md:text-sm">
              <thead className="bg-[#1E3B3B]">
                <tr>
                  <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">ID</th>
                  <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">Name</th>
                  <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">Capacity</th>
                  <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">Location</th>
                  <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">Created At</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#6E8F89]">
                {filteredWarehouses.map((warehouse) => (
                  <tr key={warehouse.id} className="hover:bg-[#F5F9F8]">
                    <td className="px-2 py-4 md:px-6 whitespace-nowrap">
                      <span className="font-medium text-[#1E3B3B]">#{warehouse.id.toString().slice(-6)}</span>
                    </td>
                    <td className="px-2 py-4 md:px-6 whitespace-nowrap">
                      <div className="font-medium text-[#1E3B3B]">
                        {warehouse.name}
                      </div>
                    </td>
                    <td className="px-2 py-4 md:px-6 whitespace-nowrap">
                      <div className="text-[#1E3B3B]">
                        {warehouse.capacity.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-2 py-4 md:px-6">
                      <div className="text-[#6E8F89] line-clamp-2">
                        {formatAddress(warehouse.location)}
                      </div>
                    </td>
                    <td className="px-2 py-4 md:px-6 whitespace-nowrap">
                      <div className="text-[#6E8F89]">
                        {warehouse.created_at ? format(new Date(warehouse.created_at), 'MMM d, yyyy') : '-'}
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

export default WarehousesPage;