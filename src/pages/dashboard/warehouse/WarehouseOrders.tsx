import React, { useEffect, useState } from 'react';
import { message, Select, Modal } from 'antd';
import { fetchMyWarehouses } from '../../../apis/warehouse';
import { fetchOrdersByWarehouseIds, updateOrderStatus } from '../../../apis/orders';
import { fetchTransportersWithVehicles } from '../../../apis/transporters';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiTruck, FiEye } from 'react-icons/fi';
import { format } from 'date-fns';
import { createShipment } from '../../../apis/shipments';

interface Vendor {
  id: number;
  name: string;
}

interface Order {
  id: number;
  status: string;
  vendor?: Vendor;
  total_amount: number | string;
  created_at?: string;
}

interface Vehicle {
  id: number;
  type: string;
  plateNumber: string;
}

interface Transporter {
  id: number;
  userId: number;
  transporterName: string;
  vehicles: Vehicle[];
}

interface Column {
  title: string;
  dataIndex?: string | string[];
  key: string;
  render?: (record: Order) => React.ReactNode;
}

const statusOptions = [
  'Pending',
  'Shipped',
  'Delivered',
  'Cancelled',
];

const WarehouseOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusModal, setStatusModal] = useState<{ open: boolean; order: Order | null }>({ open: false, order: null });
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [transporters, setTransporters] = useState<Transporter[]>([]);
  const [selectedTransporter, setSelectedTransporter] = useState<number | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [assignModal, setAssignModal] = useState<{ open: boolean; orderId: number | null }>({ open: false, orderId: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const userId = 1; // Replace with dynamic userId if available
        const warehouses = await fetchMyWarehouses();
        const warehouseIds = warehouses.map((w: any) => w.id);
        if (warehouseIds.length === 0) {
          setOrders([]);
          message.info('No warehouses connected to your account.');
          setLoading(false);
          return;
        }
        const allOrders = await fetchOrdersByWarehouseIds(warehouseIds, userId);
        setOrders(allOrders);
        setFilteredOrders(allOrders);
      } catch (err) {
        message.error('Failed to fetch orders for warehouses connected to your account. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order =>
        order.id.toString().includes(searchQuery) ||
        (order.vendor?.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        order.status.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  }, [searchQuery, orders]);

  const getStatusTag = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <span className="px-3 py-1 text-xs text-yellow-800 bg-yellow-100 rounded-full">Pending</span>;
      case 'shipped':
        return <span className="px-3 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">Shipped</span>;
      case 'delivered':
        return <span className="px-3 py-1 text-xs text-green-800 bg-green-100 rounded-full">Delivered</span>;
      case 'cancelled':
        return <span className="px-3 py-1 text-xs text-red-800 bg-red-100 rounded-full">Cancelled</span>;
      default:
        return <span className="px-3 py-1 text-xs text-gray-800 bg-gray-200 rounded-full">{status}</span>;
    }
  };

  const handleStatusChange = async () => {
    if (!statusModal.order) return;
    setStatusUpdating(true);
    try {
      await updateOrderStatus(statusModal.order.id, selectedStatus);
      setOrders(prev => prev.map(o => o.id === statusModal.order?.id ? { ...o, status: selectedStatus } : o));
      message.success('Order status updated');
      setStatusModal({ open: false, order: null });
    } catch (err) {
      message.error('Failed to update order status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleAssignShipment = async () => {
    if (!assignModal.orderId || !selectedTransporter || !selectedVehicle) {
      message.error('Please select a transporter and vehicle');
      return;
    }
    console.log('Assigning shipment with:', {
      orderId: assignModal.orderId,
      vehicleId: selectedVehicle,
      userId: selectedTransporter,
    });
    try {
      await createShipment({
        orderId: assignModal.orderId,
        vehicleId: selectedVehicle.toString(),
        userId: transporters.find(t => t.id === selectedTransporter)?.userId || 0,
      });
      message.success('Shipment assigned successfully');
      setAssignModal({ open: false, orderId: null });
      setSelectedTransporter(null);
      setSelectedVehicle(null);
    } catch (error) {
      message.error('Failed to assign shipment');
    }
  };

  const openAssignModal = async (orderId: number) => {
    try {
      setAssignModal({ open: true, orderId });
      const data = await fetchTransportersWithVehicles();
      const transportersWithDetails: Transporter[] = data.map((transporter: any) => ({
        id: transporter.id,
        userId: transporter.userId,
        transporterName: transporter.transporterName,
        vehicles: transporter.vehicles.map((vehicle: any) => ({
          id: vehicle.id,
          type: vehicle.type,
          plateNumber: vehicle.plateNumber,
        })),
      }));
      setTransporters(transportersWithDetails);
    } catch (error) {
      message.error('Failed to fetch transporters and vehicles');
    }
  };

  const columns: Column[] = [
    { 
      title: 'Order ID', 
      dataIndex: 'id', 
      key: 'id', 
      render: (record: Order) => <span className="font-medium text-gray-900">#{record.id}</span> 
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: (record: Order) => getStatusTag(record.status) 
    },
    { 
      title: 'Vendor', 
      dataIndex: ['vendor', 'name'], 
      key: 'vendor', 
      render: (record: Order) => <span className="text-gray-900">{record.vendor?.name || '-'}</span> 
    },
    { 
      title: 'Total Amount', 
      dataIndex: 'total_amount', 
      key: 'total_amount', 
      render: (record: Order) => {
        const amt = record.total_amount;
        const num = typeof amt === 'number' ? amt : Number(amt);
        return <span className="font-medium text-gray-900">{
          isNaN(num) ? '-' : `₹${num.toFixed(2)}`
        }</span>;
      } 
    },
    { 
      title: 'Date', 
      dataIndex: 'created_at', 
      key: 'created_at', 
      render: (record: Order) => <span className="text-gray-500">{
        record.created_at ? format(new Date(record.created_at), 'MMM d, yyyy') : '-'
      }</span> 
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: Order) => (
        <button
          onClick={() => navigate(`/dashboard/warehouse/orders/${record.id}`)}
          className="flex items-center bg-[#1E3B3B] text-[#D6ECE6] px-3 py-1 rounded hover:bg-[#2A4D4D] transition text-xs md:text-sm"
        >
          <FiEye className="mr-1" />
          View
        </button>
      ),
    },
    {
      title: 'Shipment',
      key: 'shipment',
      render: (record: Order) => (
        <div className="flex gap-2">
          {record.status === 'Pending' && (
            <button
              onClick={() => openAssignModal(record.id)}
              className="flex items-center px-3 py-1 text-xs text-white transition bg-blue-500 rounded hover:bg-blue-600 md:text-sm"
            >
              <FiTruck className="mr-1" />
              Assign
            </button>
          )}
          {record.status === 'Shipped' && (
            <button
              className="flex items-center px-3 py-1 text-xs text-white transition bg-green-500 rounded hover:bg-green-600 md:text-sm"
              onClick={() => message.info('This order has been shipped')}
            >
              <FiTruck className="mr-1" />
              Shipped
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen px-2 pt-4 pb-8 transition-all duration-300 bg-gray-50 sm:px-4 md:px-6"
      style={{ marginLeft: '0', paddingTop: '64px' }}>
      <div className="ml-0">
        <div className="flex flex-col items-start justify-between gap-4 mb-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#1E3B3B]">Warehouse Orders</h2>
            <p className="text-sm text-[#6E8F89]">Manage orders for your connected warehouses</p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col gap-4 mb-6 md:flex-row">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-3 text-[#6E8F89]" />
            <input
              type="text"
              placeholder="Search orders by ID, vendor or status..."
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

        {/* Orders Table */}
        <div className="overflow-x-auto bg-white shadow-sm rounded-xl">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E3B3B]"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-6 text-center text-[#6E8F89]">
              {searchQuery ? 'No orders match your search' : 'No orders found'}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-[#6E8F89] text-xs md:text-sm">
              <thead className="bg-[#1E3B3B]">
                <tr>
                  {columns.map(column => (
                    <th 
                      key={column.key} 
                      className="px-2 md:px-6 py-3 text-left font-medium text-[#D6ECE6] uppercase tracking-wider"
                    >
                      {column.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#6E8F89]">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F5F9F8]">
                    {columns.map(column => (
                      <td 
                        key={column.key} 
                        className="px-2 py-4 md:px-6 whitespace-nowrap"
                      >
                        {column.render 
                          ? column.render(order)
                          : column.dataIndex
                            ? (order as any)[column.dataIndex as string]
                            : null}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Status Change Modal */}
        <Modal
          title="Change Order Status"
          open={statusModal.open}
          onOk={handleStatusChange}
          onCancel={() => setStatusModal({ open: false, order: null })}
          confirmLoading={statusUpdating}
          okText="Update"
          okButtonProps={{ className: 'bg-[#1E3B3B] hover:bg-[#2A4D4D]' }}
        >
          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            style={{ width: '100%' }}
            className="my-2"
          >
            {statusOptions.map(status => (
              <Select.Option key={status} value={status}>{status}</Select.Option>
            ))}
          </Select>
        </Modal>

        {/* Assign Shipment Modal */}
        <Modal
          title="Assign Shipment"
          open={assignModal.open}
          onCancel={() => setAssignModal({ open: false, orderId: null })}
          footer={null}
        >
          <Select
            placeholder="Select Transporter"
            className="w-full mb-4"
            onChange={(value: number) => setSelectedTransporter(value)}
          >
            {transporters.map(transporter => (
              <Select.Option key={transporter.id} value={transporter.id}>
                {transporter.transporterName}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="Select Vehicle"
            className="w-full mb-4"
            onChange={(value: number) => setSelectedVehicle(value)}
            disabled={!selectedTransporter}
          >
            {selectedTransporter &&
              transporters
                .find(t => t.id === selectedTransporter)?.vehicles
                .map(vehicle => (
                  <Select.Option key={vehicle.id} value={vehicle.id}>
                    {vehicle.plateNumber} - {vehicle.type}
                  </Select.Option>
                ))}
          </Select>
          <div className="flex justify-end">
            <button
              onClick={handleAssignShipment}
              className="px-4 py-2 text-white bg-[#1E3B3B] rounded hover:bg-[#2A4D4D] transition"
            >
              Assign Shipment
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default WarehouseOrders;