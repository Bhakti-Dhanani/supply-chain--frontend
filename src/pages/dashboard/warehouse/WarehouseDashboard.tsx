import React, { useEffect, useState } from 'react';
import InventoryChart from '../../../components/charts/InventoryChart';
import { Card, Statistic, Table, Tag, Spin, Progress, Divider } from 'antd';
import { 
  FiTruck, 
  FiClipboard,
  FiAlertCircle,
  FiMapPin,
  FiBox,
  FiDatabase
} from 'react-icons/fi';
import { fetchInventory, getInventoryForUserWarehouses } from '../../../apis/inventory';
import { fetchOrders, fetchOrdersByWarehouseIds } from '../../../apis/orders';
import { fetchShipments } from '../../../apis/shipments';
import { format } from 'date-fns';

const WarehouseDashboard: React.FC = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalStock, setTotalStock] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);

  useEffect(() => {
    // If the current path is /dashboard/warehouse, redirect to /dashboard/warehouse/overview
    if (window.location.pathname === '/dashboard/warehouse') {
      window.location.replace('/dashboard/warehouse/overview');
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const [inventoryData, ordersData, shipmentsData] = await Promise.all([
          fetchInventory(),
          fetchOrders(),
          fetchShipments(),
        ]);
        setInventory(Array.isArray(inventoryData) ? inventoryData : []);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setShipments(Array.isArray(shipmentsData) ? shipmentsData : []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchTotalStock = async () => {
      try {
        const inventoryData = await getInventoryForUserWarehouses({ userId: 1 }); // Replace with dynamic userId if available
        const totalStock = inventoryData.reduce((sum, item) => sum + (item.stock || 0), 0); // Use `stock` field
        setInventory(inventoryData);
        setTotalStock(totalStock);
      } catch (error) {
        console.error('Failed to fetch total stock:', error);
      }
    };

    fetchTotalStock();
  }, []);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const userId = 1; // Replace with dynamic userId if available
        const { totalPendingOrders } = await fetchOrdersByWarehouseIds([1], userId); // Pass userId explicitly
        setPendingOrders(totalPendingOrders);
      } catch (err) {
        console.error('Failed to fetch pending orders:', err);
      }
    };

    fetchPendingOrders();
  }, []);

  // Prepare chart data with real data if available
  const inventoryLevelData = [
    { category: 'Electronics', count: 1200, lowStock: 200 },
    { category: 'Clothing', count: 850, lowStock: 150 },
    { category: 'Furniture', count: 320, lowStock: 50 },
    { category: 'Food', count: 1500, lowStock: 300 },
    { category: 'Tools', count: 670, lowStock: 120 },
  ];

  // Calculate metrics
  const lowStockItems = inventory.filter(item => item.quantity < item.reorderLevel).length;
  const incomingShipments = shipments.filter(shipment => shipment.status === 'In Transit').length;
  
  // Get top 5 low stock items
  const lowStockAlerts = [...inventory]
    .filter(item => item.quantity < item.reorderLevel)
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 5);

  const statusColors: Record<string, string> = {
    'Processing': 'bg-blue-100 text-blue-800',
    'Shipped': 'bg-purple-100 text-purple-800',
    'Delivered': 'bg-green-100 text-green-800',
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
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E3B3B]">Warehouse Dashboard</h1>
          <div className="text-xs sm:text-sm text-[#6E8F89]">
            {format(new Date(), 'MMMM d, yyyy')}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 mb-6 sm:gap-6 sm:mb-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Card 1 */}
          <Card className="bg-white border-0 shadow-sm rounded-xl">
            <Statistic
              title={<span className="text-[#6E8F89] text-xs sm:text-sm font-medium">Total Inventory</span>}
              value={totalStock}
              prefix={<FiDatabase className="text-[#6E8F89] mr-2" />}
              valueStyle={{ color: '#1E3B3B', fontSize: '20px', fontWeight: '600' }}
            />
            <div className="mt-2 text-xs text-[#6E8F89]">
              <span className={`${lowStockItems > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                {lowStockItems} low stock
              </span>
            </div>
          </Card>
          {/* Card 2 */}
          <Card className="bg-white border-0 shadow-sm rounded-xl">
            <Statistic
              title={<span className="text-[#6E8F89] text-xs sm:text-sm font-medium">Pending Orders</span>}
              value={pendingOrders}
              prefix={<FiClipboard className="text-[#6E8F89] mr-2" />}
              valueStyle={{ color: '#1E3B3B', fontSize: '20px', fontWeight: '600' }}
            />
            <div className="mt-2 text-xs text-[#6E8F89]">
              {orders.length} total orders
            </div>
          </Card>
          {/* Card 3 */}
          <Card className="bg-white border-0 shadow-sm rounded-xl">
            <Statistic
              title={<span className="text-[#6E8F89] text-xs sm:text-sm font-medium">Incoming Shipments</span>}
              value={incomingShipments}
              prefix={<FiTruck className="text-[#6E8F89] mr-2" />}
              valueStyle={{ color: '#1E3B3B', fontSize: '20px', fontWeight: '600' }}
            />
            <div className="mt-2 text-xs text-[#6E8F89]">
              {shipments.length} total shipments
            </div>
          </Card>
          {/* Card 4 */}
          <Card className="bg-white border-0 shadow-sm rounded-xl">
            <Statistic
              title={<span className="text-[#6E8F89] text-xs sm:text-sm font-medium">Storage Capacity</span>}
              value="78%"
              prefix={<FiBox className="text-[#6E8F89] mr-2" />}
              valueStyle={{ color: '#1E3B3B', fontSize: '20px', fontWeight: '600' }}
            />
            <div className="mt-2 text-xs text-[#6E8F89]">
              22% available space
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-4 mb-6 sm:gap-6 sm:mb-8 lg:grid-cols-3">
          {/* Inventory Levels Chart */}
          <div className="p-4 bg-white shadow-sm sm:p-6 lg:col-span-2 rounded-xl">
            <div className="flex flex-col items-start justify-between gap-2 mb-4 sm:flex-row sm:items-center sm:mb-6 sm:gap-0">
              <h2 className="text-base sm:text-lg font-semibold text-[#1E3B3B]">Inventory Levels</h2>
              <div className="flex space-x-2">
                <button className="px-2 sm:px-3 py-1 text-xs bg-[#EADCD6] text-[#1E3B3B] rounded-lg">By Category</button>
                <button className="px-2 sm:px-3 py-1 text-xs bg-white text-[#6E8F89] rounded-lg">By Location</button>
                <button className="px-2 sm:px-3 py-1 text-xs bg-white text-[#6E8F89] rounded-lg">By Supplier</button>
              </div>
            </div>
            <div className="h-64 sm:h-80">
              <InventoryChart data={inventoryLevelData} />
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="p-4 bg-white shadow-sm sm:p-6 rounded-xl">
            <h2 className="text-base sm:text-lg font-semibold text-[#1E3B3B] mb-4 sm:mb-6">Low Stock Alerts</h2>
            <div className="space-y-3 sm:space-y-4">
              {lowStockAlerts.length > 0 ? lowStockAlerts.map((item, idx) => (
                <div key={item.id || item.name || idx} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiAlertCircle className="mr-2 text-yellow-500 sm:mr-3" />
                    <span className="text-[#1E3B3B] font-medium text-xs sm:text-sm">{item.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 text-xs font-medium text-red-500 sm:text-sm">{item.quantity}</span>
                    <span className="text-[#6E8F89] text-xs">of {item.reorderLevel}</span>
                  </div>
                </div>
              )) : (
                <div className="text-xs text-green-500 sm:text-sm">No low stock items</div>
              )}
            </div>
            <Divider className="my-3 sm:my-4" />
            <div className="mt-3 sm:mt-4">
              <h3 className="text-xs sm:text-sm font-medium text-[#6E8F89] mb-1 sm:mb-2">Inventory Health</h3>
              <Progress 
                percent={85} 
                strokeColor="#6E8F89" 
                trailColor="#EADCD6" 
                showInfo={false}
              />
              <div className="flex justify-between text-xs text-[#6E8F89] mt-1">
                <span>85% optimal</span>
                <span>15% needs attention</span>
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
              <button className="text-xs sm:text-sm text-[#6E8F89] hover:text-[#1E3B3B]">View All</button>
            </div>
            <div className="overflow-x-auto">
              <Table
                dataSource={orders.slice(0, 5)}
                rowKey="id"
                pagination={false}
                className="warehouse-orders-table min-w-[600px]"
                columns={[
                  { 
                    title: 'Order ID', 
                    dataIndex: 'id', 
                    key: 'id',
                    render: (id) => <span className="font-medium text-[#1E3B3B]">#{id}</span>
                  },
                  { 
                    title: 'Customer', 
                    dataIndex: 'customerName', 
                    key: 'customerName',
                    render: (name) => <span className="text-[#6E8F89]">{name || 'N/A'}</span>
                  },
                  { 
                    title: 'Items', 
                    dataIndex: 'items', 
                    key: 'items',
                    render: (items) => <span className="text-[#6E8F89]">{items?.length || 0}</span>
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
                    title: 'Date', 
                    dataIndex: 'date', 
                    key: 'date',
                    render: (date) => {
                      if (!date) return <span className="text-[#6E8F89]">N/A</span>;
                      const parsedDate = new Date(date);
                      if (isNaN(parsedDate.getTime())) return <span className="text-[#6E8F89]">N/A</span>;
                      return <span className="text-[#6E8F89]">{format(parsedDate, 'MMM d')}</span>;
                    }
                  },
                ]}
              />
            </div>
          </div>

          {/* Warehouse Locations */}
          <div className="p-4 bg-white shadow-sm sm:p-6 rounded-xl">
            <div className="flex flex-col items-start justify-between gap-2 mb-4 sm:flex-row sm:items-center sm:mb-6 sm:gap-0">
              <h2 className="text-base sm:text-lg font-semibold text-[#1E3B3B]">Warehouse Locations</h2>
              <button className="text-xs sm:text-sm text-[#6E8F89] hover:text-[#1E3B3B]">View All</button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#EADCD6] rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                  <FiMapPin className="text-[#1E3B3B]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs sm:text-sm font-medium text-[#1E3B3B]">Main Storage</h3>
                  <p className="text-[10px] sm:text-xs text-[#6E8F89]">
                    1240 items / 1600 capacity
                  </p>
                </div>
                <div className="text-xs sm:text-sm font-medium text-[#1E3B3B]">
                  78% full
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#EADCD6] rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                  <FiMapPin className="text-[#1E3B3B]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs sm:text-sm font-medium text-[#1E3B3B]">Cold Storage</h3>
                  <p className="text-[10px] sm:text-xs text-[#6E8F89]">
                    320 items / 500 capacity
                  </p>
                </div>
                <div className="text-xs sm:text-sm font-medium text-[#1E3B3B]">
                  65% full
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#EADCD6] rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                  <FiMapPin className="text-[#1E3B3B]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs sm:text-sm font-medium text-[#1E3B3B]">Hazardous Materials</h3>
                  <p className="text-[10px] sm:text-xs text-[#6E8F89]">
                    85 items / 200 capacity
                  </p>
                </div>
                <div className="text-xs sm:text-sm font-medium text-[#1E3B3B]">
                  42% full
                </div>
              </div>
            </div>
            <Divider className="my-3 sm:my-4" />
            <div className="mt-3 sm:mt-4">
              <h3 className="text-xs sm:text-sm font-medium text-[#6E8F89] mb-1 sm:mb-2">Space Utilization</h3>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] sm:text-xs text-[#1E3B3B]">Used</span>
                <span className="text-[10px] sm:text-xs font-medium text-[#1E3B3B]">72%</span>
              </div>
              <div style={{ width: '100%', backgroundColor: '#e0e0e0', height: '10px', borderRadius: '5px' }}>
                <div style={{ width: '72%', backgroundColor: '#4caf50', height: '100%', borderRadius: '5px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseDashboard;