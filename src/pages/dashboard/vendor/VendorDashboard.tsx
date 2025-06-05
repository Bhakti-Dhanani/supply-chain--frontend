import React, { useEffect, useState } from 'react';
import OrdersChart from '../../../components/charts/OrdersChart';
import { Card, Statistic, Table, Tag, Spin, Progress, Divider } from 'antd';
import { 
  FiPackage, 
  FiTruck, 
  FiTrendingUp, 
  FiCheckCircle, 
  FiClock,
  FiDollarSign,
  FiAlertCircle,
  FiStar,
  FiCalendar,
} from 'react-icons/fi';
import { fetchOrders } from '../../../apis/orders';
import { fetchProducts } from '../../../apis/products';
import { fetchShipments } from '../../../apis/shipments';
import { format } from 'date-fns';

const VendorDashboard: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [shipments, setShipments] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If the current path is /dashboard/vendor, redirect to /dashboard/vendor/overview
    if (window.location.pathname === '/dashboard/vendor') {
      window.location.replace('/dashboard/vendor/overview');
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ordersData, shipmentsData, productsData] = await Promise.all([
          fetchOrders(),
          fetchShipments(),
          fetchProducts(),
        ]);
        setOrders(ordersData);
        setShipments(shipmentsData);
        setProducts(productsData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Prepare chart data with real data if available
  const monthlyOrderData = [
    { month: 'Jan', orders: 12 },
    { month: 'Feb', orders: 19 },
    { month: 'Mar', orders: 15 },
    { month: 'Apr', orders: 22 },
    { month: 'May', orders: 17 },
    { month: 'Jun', orders: 25 },
  ];

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const topProducts = [...products].sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 3);
  const recentOrders = orders.slice(0, 5); // Fetch the first 5 orders
  
  // Ensure shipments is always an array before using reduce
  const safeShipments = Array.isArray(shipments) ? shipments : [];
  const shipmentStatusSummary = safeShipments.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {});

  const statusColors: Record<string, string> = {
    'Delivered': 'bg-green-100 text-green-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Shipped': 'bg-blue-100 text-blue-800',
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
      {/* Remove Sidebar Spacer for desktop */}
      {/* <div className="fixed top-0 left-0 z-0 hidden w-64 h-full bg-transparent lg:block" /> */}
      <div className="ml-0">
        {/* Dashboard Header */}
        <div className="flex flex-col items-start justify-between gap-2 mb-6 sm:flex-row sm:items-center sm:gap-0">
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E3B3B]">Vendor Dashboard</h1>
          <div className="text-xs sm:text-sm text-[#6E8F89]">
            {format(new Date(), 'MMMM d, yyyy')}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 mb-6 sm:gap-6 sm:mb-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Card 1 */}
          <Card className="bg-white border-0 shadow-sm rounded-xl">
            <Statistic
              title={<span className="text-[#6E8F89] text-xs sm:text-sm font-medium">Total Orders</span>}
              value={orders.length}
              prefix={<FiTrendingUp className="text-[#6E8F89] mr-2" />}
              valueStyle={{ color: '#1E3B3B', fontSize: '20px', fontWeight: '600' }}
            />
            <div className="mt-2 text-xs text-[#6E8F89]">
              <span className={`${pendingOrders > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                {pendingOrders} pending
              </span>
            </div>
          </Card>
          {/* Card 2 */}
          <Card className="bg-white border-0 shadow-sm rounded-xl">
            <Statistic
              title={<span className="text-[#6E8F89] text-xs sm:text-sm font-medium">Total Revenue</span>}
              value={totalRevenue.toFixed(2)}
              prefix={<FiDollarSign className="text-[#6E8F89] mr-2" />}
              valueStyle={{ color: '#1E3B3B', fontSize: '20px', fontWeight: '600' }}
            />
            <div className="mt-2 text-xs text-[#6E8F89]">
              +12.5% from last month
            </div>
          </Card>
          {/* Card 3 */}
          <Card className="bg-white border-0 shadow-sm rounded-xl">
            <Statistic
              title={<span className="text-[#6E8F89] text-xs sm:text-sm font-medium">Active Shipments</span>}
              value={shipments.length}
              prefix={<FiTruck className="text-[#6E8F89] mr-2" />}
              valueStyle={{ color: '#1E3B3B', fontSize: '20px', fontWeight: '600' }}
            />
            <div className="mt-2 text-xs text-[#6E8F89]">
              {shipmentStatusSummary['Delivered'] || 0} delivered
            </div>
          </Card>
          {/* Card 4 */}
          <Card className="bg-white border-0 shadow-sm rounded-xl">
            <Statistic
              title={<span className="text-[#6E8F89] text-xs sm:text-sm font-medium">Product Catalog</span>}
              value={products.length}
              prefix={<FiPackage className="text-[#6E8F89] mr-2" />}
              valueStyle={{ color: '#1E3B3B', fontSize: '20px', fontWeight: '600' }}
            />
            <div className="mt-2 text-xs text-[#6E8F89]">
              {topProducts.length} top sellers
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-4 mb-6 sm:gap-6 sm:mb-8 lg:grid-cols-3">
          {/* Order Trends Chart */}
          <div className="p-4 bg-white shadow-sm sm:p-6 lg:col-span-2 rounded-xl">
            <div className="flex flex-col items-start justify-between gap-2 mb-4 sm:flex-row sm:items-center sm:mb-6 sm:gap-0">
              <h2 className="text-base sm:text-lg font-semibold text-[#1E3B3B]">Order Trends</h2>
              <div className="flex space-x-2">
                <button className="px-2 sm:px-3 py-1 text-xs bg-[#EADCD6] text-[#1E3B3B] rounded-lg">Monthly</button>
                <button className="px-2 sm:px-3 py-1 text-xs bg-white text-[#6E8F89] rounded-lg">Weekly</button>
                <button className="px-2 sm:px-3 py-1 text-xs bg-white text-[#6E8F89] rounded-lg">Daily</button>
              </div>
            </div>
            <div className="h-64 sm:h-80">
              <OrdersChart data={monthlyOrderData} />
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
                    ) : status === 'Pending' ? (
                      <FiClock className="mr-2 text-yellow-500 sm:mr-3" />
                    ) : (
                      <FiAlertCircle className="mr-2 text-blue-500 sm:mr-3" />
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
                percent={85} 
                strokeColor="#6E8F89" 
                trailColor="#EADCD6" 
                showInfo={false}
              />
              <div className="flex justify-between text-xs text-[#6E8F89] mt-1">
                <span>85% success</span>
                <span>15% delayed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Recent Orders */}
          <div className="p-4 overflow-x-auto bg-white shadow-sm sm:p-6 lg:col-span-2 rounded-xl">
            <div className="flex flex-col items-start justify-between gap-2 mb-4 sm:flex-row sm:items-center sm:mb-6 sm:gap-0">
              <h2 className="text-base sm:text-lg font-semibold text-[#1E3B3B]">Recent Orders</h2>
              <button
                className="text-xs sm:text-sm text-[#6E8F89] hover:text-[#1E3B3B]"
                onClick={() => window.location.href = '/dashboard/vendor/orders'}
              >
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <Table
                dataSource={recentOrders}
                rowKey="id"
                pagination={false}
                className="vendor-orders-table min-w-[600px]"
                columns={[
                  {
                    title: 'Order ID',
                    dataIndex: 'id',
                    key: 'id',
                    render: (id) => <span className="font-medium text-[#1E3B3B]">#{id}</span>,
                  },
                  {
                    title: 'Date',
                    dataIndex: 'created_at',
                    key: 'created_at',
                    render: (created_at) => {
                      if (!created_at) {
                        return (
                          <div className="flex items-center text-[#6E8F89]">
                            <FiCalendar className="mr-2" />
                            N/A
                          </div>
                        );
                      }
                      const parsedDate = new Date(created_at);
                      if (isNaN(parsedDate.getTime())) {
                        return (
                          <div className="flex items-center text-[#6E8F89]">
                            <FiCalendar className="mr-2" />
                            N/A
                          </div>
                        );
                      }
                      return (
                        <div className="flex items-center text-[#6E8F89]">
                          <FiCalendar className="mr-2" />
                          {format(parsedDate, 'MMM d, yyyy')}
                        </div>
                      );
                    },
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
                    ),
                  },
                  {
                    title: 'Total',
                    dataIndex: 'total_amount',
                    key: 'total_amount',
                    align: 'right',
                    render: (total_amount) => {
                      const amount = parseFloat(total_amount);
                      return (
                        <span className="font-medium text-[#1E3B3B]">
                          ${!isNaN(amount) ? amount.toFixed(2) : '0.00'}
                        </span>
                      );
                    },
                  },
                ]}
              />
            </div>
          </div>

          {/* Top Products */}
          <div className="p-4 bg-white shadow-sm sm:p-6 rounded-xl">
            <div className="flex flex-col items-start justify-between gap-2 mb-4 sm:flex-row sm:items-center sm:mb-6 sm:gap-0">
              <h2 className="text-base sm:text-lg font-semibold text-[#1E3B3B]">Top Products</h2>
              <button className="text-xs sm:text-sm text-[#6E8F89] hover:text-[#1E3B3B]">View All</button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {(Array.isArray(topProducts) && topProducts.length > 0) ? topProducts.map((product, idx) => (
                <div key={product.id || product.name || idx} className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#EADCD6] rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                    <FiPackage className="text-[#1E3B3B]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xs sm:text-sm font-medium text-[#1E3B3B]">{product.name}</h3>
                    <p className="text-[10px] sm:text-xs text-[#6E8F89]">
                      {typeof product.category === 'object' && product.category !== null
                        ? product.category.name
                        : typeof product.category === 'string'
                          ? product.category
                          : 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <FiStar className="mr-1 text-yellow-400" />
                    <span className="text-xs sm:text-sm font-medium text-[#1E3B3B]">{product.rating || '4.5'}</span>
                  </div>
                </div>
              )) : (
                <div className="text-[#6E8F89] text-xs">No products found</div>
              )}
            </div>
            <Divider className="my-3 sm:my-4" />
            <div className="mt-3 sm:mt-4">
              <h3 className="text-xs sm:text-sm font-medium text-[#6E8F89] mb-1 sm:mb-2">Inventory Status</h3>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] sm:text-xs text-[#1E3B3B]">In Stock</span>
                <span className="text-[10px] sm:text-xs font-medium text-[#1E3B3B]">78%</span>
              </div>
              <Progress 
                percent={78} 
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

export default VendorDashboard;