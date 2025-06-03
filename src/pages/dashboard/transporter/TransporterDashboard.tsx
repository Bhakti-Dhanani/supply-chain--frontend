import React, { useEffect, useState } from 'react';

import { Card, Statistic, Table, Tag, Spin, Progress, Divider } from 'antd';
import { 
  FiTruck, 
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiMap,
  FiPackage
} from 'react-icons/fi';
import { fetchShipments, fetchVehicleRoutes } from '../../../apis/shipments';
import ShipmentsChart from '../../../components/charts/ShipmentsChart';

import { format } from 'date-fns';

const TransporterDashboard: React.FC = () => {
  const [shipments, setShipments] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If the current path is /dashboard/transporter, redirect to /dashboard/transporter/overview
    if (window.location.pathname === '/dashboard/transporter') {
      window.location.replace('/dashboard/transporter/overview');
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const [shipmentsData, routesData] = await Promise.all([
          fetchShipments(),
          fetchVehicleRoutes(),
        ]);
        setShipments(Array.isArray(shipmentsData) ? shipmentsData : []);
        setRoutes(Array.isArray(routesData) ? routesData : []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setShipments([]); // Fallback to empty array
        setRoutes([]); // Fallback to empty array
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Prepare chart data with real data if available
  const weeklyShipmentData = [
    { day: 'Mon', shipments: 8 },
    { day: 'Tue', shipments: 12 },
    { day: 'Wed', shipments: 10 },
    { day: 'Thu', shipments: 15 },
    { day: 'Fri', shipments: 13 },
    { day: 'Sat', shipments: 5 },
  ];

  // Calculate metrics
  const assignedShipments = shipments.filter(s => s.status === 'Assigned').length;
  const inTransitShipments = shipments.filter(s => s.status === 'In Transit').length;
  const completedShipments = shipments.filter(s => s.status === 'Delivered').length;
  const activeRoutes = routes.filter(r => r.status === 'Active').length;
  
  // Ensure shipments is always an array before using reduce
  const safeShipments = Array.isArray(shipments) ? shipments : [];
  const shipmentStatusSummary = safeShipments.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {});

  const statusColors: Record<string, string> = {
    'Delivered': 'bg-green-100 text-green-800',
    'Assigned': 'bg-blue-100 text-blue-800',
    'In Transit': 'bg-purple-100 text-purple-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Cancelled': 'bg-red-100 text-red-800',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-2 pt-4 pb-8 transition-all duration-300 bg-gray-50 sm:px-4 md:px-6"
      style={{ marginLeft: '0', paddingTop: '64px' }}
    >
      <div className="ml-0">
        {/* Dashboard Header */}
        <div className="flex flex-col items-start justify-between gap-2 mb-6 sm:flex-row sm:items-center sm:gap-0">
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E3B3B]">Transporter Dashboard</h1>
          <div className="text-xs sm:text-sm text-[#6E8F89]">
            {format(new Date(), 'MMMM d, yyyy')}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 mb-6 sm:gap-6 sm:mb-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Card 1 */}
          <Card className="bg-white border-0 shadow-sm rounded-xl">
            <Statistic
              title={<span className="text-[#6E8F89] text-xs sm:text-sm font-medium">Total Shipments</span>}
              value={shipments.length}
              prefix={<FiTruck className="text-[#6E8F89] mr-2" />}
              valueStyle={{ color: '#1E3B3B', fontSize: '20px', fontWeight: '600' }}
            />
            <div className="mt-2 text-xs text-[#6E8F89]">
              <span className="text-blue-600">{assignedShipments} assigned</span>
            </div>
          </Card>
          {/* Card 2 */}
          <Card className="bg-white border-0 shadow-sm rounded-xl">
            <Statistic
              title={<span className="text-[#6E8F89] text-xs sm:text-sm font-medium">In Transit</span>}
              value={inTransitShipments}
              prefix={<FiClock className="text-[#6E8F89] mr-2" />}
              valueStyle={{ color: '#1E3B3B', fontSize: '20px', fontWeight: '600' }}
            />
            <div className="mt-2 text-xs text-[#6E8F89]">
              +5 from yesterday
            </div>
          </Card>
          {/* Card 3 */}
          <Card className="bg-white border-0 shadow-sm rounded-xl">
            <Statistic
              title={<span className="text-[#6E8F89] text-xs sm:text-sm font-medium">Completed</span>}
              value={completedShipments}
              prefix={<FiCheckCircle className="text-[#6E8F89] mr-2" />}
              valueStyle={{ color: '#1E3B3B', fontSize: '20px', fontWeight: '600' }}
            />
            <div className="mt-2 text-xs text-[#6E8F89]">
              98% on-time rate
            </div>
          </Card>
          {/* Card 4 */}
          <Card className="bg-white border-0 shadow-sm rounded-xl">
            <Statistic
              title={<span className="text-[#6E8F89] text-xs sm:text-sm font-medium">Active Routes</span>}
              value={activeRoutes}
              prefix={<FiMap className="text-[#6E8F89] mr-2" />}
              valueStyle={{ color: '#1E3B3B', fontSize: '20px', fontWeight: '600' }}
            />
            <div className="mt-2 text-xs text-[#6E8F89]">
              {routes.length} total routes
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-4 mb-6 sm:gap-6 sm:mb-8 lg:grid-cols-3">
          {/* Shipment Trends Chart */}
          <div className="p-4 bg-white shadow-sm sm:p-6 lg:col-span-2 rounded-xl">
            <div className="flex flex-col items-start justify-between gap-2 mb-4 sm:flex-row sm:items-center sm:mb-6 sm:gap-0">
              <h2 className="text-base sm:text-lg font-semibold text-[#1E3B3B]">Shipment Trends</h2>
              <div className="flex space-x-2">
                <button className="px-2 sm:px-3 py-1 text-xs bg-[#EADCD6] text-[#1E3B3B] rounded-lg">Weekly</button>
                <button className="px-2 sm:px-3 py-1 text-xs bg-white text-[#6E8F89] rounded-lg">Monthly</button>
                <button className="px-2 sm:px-3 py-1 text-xs bg-white text-[#6E8F89] rounded-lg">Daily</button>
              </div>
            </div>
            <div className="h-64 sm:h-80">
              <ShipmentsChart data={weeklyShipmentData} />
            </div>
          </div>

          {/* Shipment Status */}
          <div className="p-4 bg-white shadow-sm sm:p-6 rounded-xl">
            <h2 className="text-base sm:text-lg font-semibold text-[#1E3B3B] mb-4 sm:mb-6">Shipment Status</h2>
            <div className="space-y-3 sm:space-y-4">
              {Object.entries(shipmentStatusSummary).map(([status, count], idx) => (
                <div key={status + '-' + idx} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {status === 'Delivered' ? (
                      <FiCheckCircle className="mr-2 text-green-500 sm:mr-3" />
                    ) : status === 'Assigned' ? (
                      <FiPackage className="mr-2 text-blue-500 sm:mr-3" />
                    ) : status === 'In Transit' ? (
                      <FiTruck className="mr-2 text-purple-500 sm:mr-3" />
                    ) : (
                      <FiAlertCircle className="mr-2 text-yellow-500 sm:mr-3" />
                    )}
                    <span className="text-[#1E3B3B] font-medium text-xs sm:text-base">{status}</span>
                  </div>
                  <span className="text-[#6E8F89] font-medium text-xs sm:text-base">{String(count)}</span>
                </div>
              ))}
            </div>
            <Divider className="my-3 sm:my-4" />
            <div className="mt-3 sm:mt-4">
              <h3 className="text-xs sm:text-sm font-medium text-[#6E8F89] mb-1 sm:mb-2">On-time Delivery</h3>
              <Progress 
                percent={98} 
                strokeColor="#6E8F89" 
                trailColor="#EADCD6" 
                showInfo={false}
              />
              <div className="flex justify-between text-xs text-[#6E8F89] mt-1">
                <span>98% success</span>
                <span>2% delayed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Recent Shipments */}
          <div className="p-4 overflow-x-auto bg-white shadow-sm sm:p-6 lg:col-span-2 rounded-xl">
            <div className="flex flex-col items-start justify-between gap-2 mb-4 sm:flex-row sm:items-center sm:mb-6 sm:gap-0">
              <h2 className="text-base sm:text-lg font-semibold text-[#1E3B3B]">Recent Shipments</h2>
              <button className="text-xs sm:text-sm text-[#6E8F89] hover:text-[#1E3B3B]">View All</button>
            </div>
            <div className="overflow-x-auto">
              <Table
                dataSource={shipments.slice(0, 5)}
                rowKey="id"
                pagination={false}
                className="transporter-shipments-table min-w-[600px]"
                columns={[
                  { 
                    title: 'Shipment ID', 
                    dataIndex: 'id', 
                    key: 'id',
                    render: (id) => <span className="font-medium text-[#1E3B3B]">#{id}</span>
                  },
                  { 
                    title: 'Destination', 
                    dataIndex: 'destination', 
                    key: 'destination',
                    render: (destination) => <span className="text-[#6E8F89]">{destination}</span>
                  },
                  { 
                    title: 'Vehicle', 
                    dataIndex: 'vehicle', 
                    key: 'vehicle',
                    render: (vehicle) => <span className="text-[#6E8F89]">{vehicle || 'N/A'}</span>
                  },
                  { 
                    title: 'Status', 
                    dataIndex: 'status', 
                    key: 'status', 
                    render: (status) => (
                      <Tag 
                        className={`px-2 py-1 rounded-full text-xs ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}
                      >
                        {status}
                      </Tag>
                    ) 
                  },
                  { 
                    title: 'ETA', 
                    dataIndex: 'eta', 
                    key: 'eta', 
                    render: (eta) => {
                      if (!eta) return <span className="text-[#6E8F89]">N/A</span>;
                      const parsedDate = new Date(eta);
                      if (isNaN(parsedDate.getTime())) return <span className="text-[#6E8F89]">N/A</span>;
                      return <span className="text-[#6E8F89]">{format(parsedDate, 'MMM d')}</span>;
                    }
                  },
                ]}
              />
            </div>
          </div>

          {/* Active Routes */}
          <div className="p-4 bg-white shadow-sm sm:p-6 rounded-xl">
            <div className="flex flex-col items-start justify-between gap-2 mb-4 sm:flex-row sm:items-center sm:mb-6 sm:gap-0">
              <h2 className="text-base sm:text-lg font-semibold text-[#1E3B3B]">Active Routes</h2>
              <button className="text-xs sm:text-sm text-[#6E8F89] hover:text-[#1E3B3B]">View All</button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {(Array.isArray(routes) && routes.length > 0) ? routes.slice(0, 3).map((route, idx) => (
                <div key={route.id || route.name || idx} className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#EADCD6] rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                    <FiMap className="text-[#1E3B3B]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xs sm:text-sm font-medium text-[#1E3B3B]">{route.name || `Route ${idx + 1}`}</h3>
                    <p className="text-[10px] sm:text-xs text-[#6E8F89]">
                      {route.stops ? `${route.stops.length} stops` : 'No stops'}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <FiTruck className="mr-1 text-[#6E8F89]" />
                    <span className="text-xs sm:text-sm font-medium text-[#1E3B3B]">{route.vehicle || 'N/A'}</span>
                  </div>
                </div>
              )) : (
                <div className="text-[#6E8F89] text-xs">No active routes</div>
              )}
            </div>
            <Divider className="my-3 sm:my-4" />
            <div className="mt-3 sm:mt-4">
              <h3 className="text-xs sm:text-sm font-medium text-[#6E8F89] mb-1 sm:mb-2">Route Efficiency</h3>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] sm:text-xs text-[#1E3B3B]">Optimized</span>
                <span className="text-[10px] sm:text-xs font-medium text-[#1E3B3B]">92%</span>
              </div>
              <Progress 
                percent={92} 
                strokeColor="#6E8F89" 
                trailColor="#EADCD6" 
                showInfo={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransporterDashboard;