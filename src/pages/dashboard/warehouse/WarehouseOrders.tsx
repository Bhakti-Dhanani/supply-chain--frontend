import React, { useEffect, useState } from 'react';
import { Table, Tag, Modal, Select, message, Spin } from 'antd';
import { fetchMyWarehouses } from '../../../apis/warehouse';
import { fetchOrdersByWarehouseIds, updateOrderStatus } from '../../../apis/orders';
import { useNavigate } from 'react-router-dom';

const statusOptions = [
  'Pending',
  'Shipped',
  'Delivered',
  'Cancelled',
];

const WarehouseOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusModal, setStatusModal] = useState<{ open: boolean; order: any | null }>({ open: false, order: null });
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const warehouses = await fetchMyWarehouses();
        const warehouseIds = warehouses.map((w: any) => w.id);
        if (warehouseIds.length === 0) {
          setOrders([]);
          setLoading(false);
          return;
        }
        const allOrders = await fetchOrdersByWarehouseIds(warehouseIds);
        setOrders(allOrders);
      } catch (err) {
        message.error('Failed to fetch orders for your warehouses');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async () => {
    if (!statusModal.order) return;
    setStatusUpdating(true);
    try {
      await updateOrderStatus(statusModal.order.id, selectedStatus);
      setOrders((prev) => prev.map((o) => o.id === statusModal.order.id ? { ...o, status: selectedStatus } : o));
      message.success('Order status updated');
      setStatusModal({ open: false, order: null });
    } catch (err) {
      message.error('Failed to update order status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const columns = [
    { title: 'Order ID', dataIndex: 'id', key: 'id', render: (id: any) => <span>#{id}</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => <Tag>{status}</Tag> },
    { title: 'Vendor', dataIndex: ['vendor', 'name'], key: 'vendor', render: (_: any, order: any) => order.vendor?.name || '-' },
    { title: 'Total Amount', dataIndex: 'total_amount', key: 'total_amount', render: (amt: any) => {
      const num = typeof amt === 'number' ? amt : Number(amt);
      return isNaN(num) ? '-' : `₹${num.toFixed(2)}`;
    } },
    { title: 'Date', dataIndex: 'created_at', key: 'created_at', render: (date: string) => date ? new Date(date).toLocaleDateString() : '-' },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, order: any) => (
        <>
          <button
            onClick={() => navigate(`/dashboard/warehouse/orders/${order.id}`)}
            className="bg-[#1E3B3B] text-[#D6ECE6] px-3 py-1 rounded hover:bg-[#2A4D4D] transition text-xs md:text-sm w-full md:w-auto shadow"
          >
            View Details
          </button>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen px-2 pt-4 pb-8 sm:px-4">
      <h1 className="text-2xl font-bold text-[#1E3B3B] mb-6">Orders for Your Warehouses</h1>
      <div className="p-4 bg-white shadow-sm rounded-xl">
        {loading ? <Spin size="large" /> : (
          <Table
            dataSource={orders}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        )}
      </div>
      <Modal
        title="Change Order Status"
        open={statusModal.open}
        onOk={handleStatusChange}
        onCancel={() => setStatusModal({ open: false, order: null })}
        confirmLoading={statusUpdating}
        okText="Update"
      >
        <Select
          value={selectedStatus}
          onChange={setSelectedStatus}
          style={{ width: '100%' }}
        >
          {statusOptions.map((status) => (
            <Select.Option key={status} value={status}>{status}</Select.Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default WarehouseOrders;
