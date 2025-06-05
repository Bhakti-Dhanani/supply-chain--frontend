import React, { useEffect, useState, useCallback } from 'react';
import {  message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setShipments } from '../../../redux/slices/shipmentSlice';
import { fetchShipments } from '../../../apis/shipments';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { format } from 'date-fns';

interface Shipment {
  id: number;
  order: {
    id: number;
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
  };
  vehicle?: {
    plate_number: string;
    type: string;
  };
  transporter?: {
    user: {
      name: string;
    };
  };
  created_at?: string;
  status?: string;
}

const AssignedShipments: React.FC = () => {
  const dispatch = useDispatch();
  const shipments = useSelector((state: any) => state.shipments.shipments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);

  const getStatusTag = (status?: string) => {
    if (!status) return <span className="px-3 py-1 text-xs text-gray-800 bg-gray-200 rounded-full">Unknown</span>;
    switch (status.toLowerCase()) {
      case 'pending':
        return <span className="px-3 py-1 text-xs text-yellow-800 bg-yellow-100 rounded-full">Pending</span>;
      case 'in_transit':
        return <span className="px-3 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">In Transit</span>;
      case 'delivered':
        return <span className="px-3 py-1 text-xs text-green-800 bg-green-100 rounded-full">Delivered</span>;
      default:
        return <span className="px-3 py-1 text-xs text-gray-800 bg-gray-200 rounded-full">{status}</span>;
    }
  };

  const getShipments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchShipments();
      if (Array.isArray(data)) {
        dispatch(setShipments(data));
        setFilteredShipments(data);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (err) {
      console.error('Error fetching shipments:', err);
      setError('Failed to fetch shipments.');
      setFilteredShipments([]); // Ensure fallback to an empty array
      message.error('Failed to fetch shipments');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    getShipments();
  }, [getShipments]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredShipments(shipments);
    } else {
      const filtered = shipments.filter((shipment: Shipment) => 
        shipment.id.toString().includes(searchQuery) ||
        shipment.order.id.toString().includes(searchQuery) ||
        (shipment.vehicle?.plate_number?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (shipment.transporter?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (shipment.order.warehouse?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredShipments(filtered);
    }
  }, [searchQuery, shipments]);

  const formatAddress = (location: any) => {
    if (!location) return 'No Delivery Location';
    const { house, street, city, state, country } = location;
    return `${house}, ${street}, ${city}, ${state}, ${country}`;
  };

  return (
    <div
      className="min-h-screen px-2 pt-4 pb-8 transition-all duration-300 bg-gray-50 sm:px-4 md:px-6"
      style={{ marginLeft: '0', paddingTop: '64px' }}
    >
      <div className="ml-0">
        <div className="flex flex-col items-start justify-between gap-4 mb-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#1E3B3B]">Assigned Shipments</h2>
            <p className="text-sm text-[#6E8F89]">Manage and track your shipments</p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col gap-4 mb-6 md:flex-row">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-3 text-[#6E8F89]" />
            <input
              type="text"
              placeholder="Search shipments by ID, order ID, vehicle, transporter or warehouse..."
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

        {/* Shipments Table */}
        <div className="overflow-x-auto bg-white shadow-sm rounded-xl">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E3B3B]"></div>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-[#2A4D4D]">{error}</div>
          ) : filteredShipments.length === 0 ? (
            <div className="p-6 text-center text-[#6E8F89]">
              {searchQuery ? 'No shipments match your search' : 'No shipments found'}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-[#6E8F89] text-xs md:text-sm">
              <thead className="bg-[#1E3B3B]">
                <tr>
                  <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">Shipment ID</th>
                  <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">Order ID</th>
                  <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">Vehicle</th>
                  <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">Status</th>
                  <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">Warehouse</th>
                  <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">Delivery Location</th>
                  <th className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#6E8F89]">
                {filteredShipments.map((shipment: Shipment) => (
                  <tr key={shipment.id} className="hover:bg-[#F5F9F8]">
                    <td className="px-2 py-4 md:px-6 whitespace-nowrap">
                      <span className="font-medium text-[#1E3B3B]">#{shipment.id.toString().slice(-6)}</span>
                    </td>
                    <td className="px-2 py-4 md:px-6 whitespace-nowrap">
                      <span className="font-medium text-[#1E3B3B]">#{shipment.order.id.toString().slice(-6)}</span>
                    </td>
                    <td className="px-2 py-4 md:px-6">
                      <div className="text-[#1E3B3B]">
                        {shipment.vehicle?.plate_number ? (
                          <>
                            <div>{shipment.vehicle.plate_number}</div>
                            <div className="text-xs text-[#6E8F89]">{shipment.vehicle.type}</div>
                          </>
                        ) : (
                          'No Vehicle Info'
                        )}
                      </div>
                    </td>
                    
                    <td className="px-2 py-4 md:px-6 whitespace-nowrap">
                      {getStatusTag(shipment.status)}
                    </td>
                    <td className="px-2 py-4 md:px-6">
                      <div className="text-[#1E3B3B]">
                        {shipment.order.warehouse?.name || 'No Warehouse Info'}
                      </div>
                    </td>
                    <td className="px-2 py-4 md:px-6">
                      <div className="text-[#6E8F89] line-clamp-2">
                        {formatAddress(shipment.order.location)}
                      </div>
                    </td>
                    <td className="px-2 py-4 md:px-6 whitespace-nowrap">
                      <div className="text-[#6E8F89]">
                        {shipment.created_at ? format(new Date(shipment.created_at), 'MMM d, yyyy') : '-'}
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

export default AssignedShipments;