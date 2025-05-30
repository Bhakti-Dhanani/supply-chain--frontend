import React, { useEffect, useState } from 'react';
import { Table, Select, Input, Spin, Card, Tag, Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { fetchMyWarehouses } from '../../../apis/warehouse';
import { fetchWarehouseInventory, fetchCategories, fetchSubcategories, fetchStockMovements } from '../../../apis/inventory';

const WarehouseInventory: React.FC = () => {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [stockMovements, setStockMovements] = useState<any[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMovements, setLoadingMovements] = useState(false);
  // Handler for showing subcategories as a popover list
  const [categoryPopoverVisible, setCategoryPopoverVisible] = useState<string | null>(null);
  const [addStockProduct, setAddStockProduct] = useState<any>(null);
  const [addStockModalVisible, setAddStockModalVisible] = useState(false);
  const [addStockQuantity, setAddStockQuantity] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const ws = await fetchMyWarehouses();
      setWarehouses(ws);
      const cats = await fetchCategories();
      setCategories(cats);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchSubs = async () => {
      if (selectedCategory) {
        const subs = await fetchSubcategories(selectedCategory);
        setSubcategories(subs);
      } else {
        setSubcategories([]);
      }
    };
    fetchSubs();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      const data = await fetchWarehouseInventory({
        warehouseId: selectedWarehouse,
        categoryId: selectedCategory,
        subcategoryId: selectedSubcategory,
        search,
      });
      setProducts(data);
      setLoading(false);
    };
    fetchInventory();
  }, [selectedWarehouse, selectedCategory, selectedSubcategory, search]);

  useEffect(() => {
    const fetchMovements = async () => {
      setLoadingMovements(true);
      const movements = await fetchStockMovements({
        warehouseId: selectedWarehouse,
        categoryId: selectedCategory,
        subcategoryId: selectedSubcategory,
      });
      setStockMovements(movements);
      setLoadingMovements(false);
    };
    fetchMovements();
  }, [selectedWarehouse, selectedCategory, selectedSubcategory]);

  const handleAddStock = (product: any) => {
    setAddStockProduct(product);
    setAddStockQuantity(0);
    setAddStockModalVisible(true);
  };

  const handleAddStockOk = () => {
    // TODO: Implement API call to add stock
    message.success('Stock added (stub)!');
    setAddStockModalVisible(false);
  };

  const handleAddStockCancel = () => {
    setAddStockModalVisible(false);
  };

  const columns = [
    { title: 'Product Name', dataIndex: 'name', key: 'name' },
    { title: 'Stock', dataIndex: 'stock', key: 'stock', render: (stock: number) => <Tag color={stock > 0 ? 'green' : 'red'}>{stock}</Tag> },
    { title: 'Warehouse', dataIndex: 'warehouseName', key: 'warehouseName' },
    { title: 'Category', dataIndex: 'categoryName', key: 'categoryName' },
    { title: 'Subcategory', dataIndex: 'subcategoryName', key: 'subcategoryName' },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Button size="small" onClick={() => handleAddStock(record)}>
          Add Stock
        </Button>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen gap-6 px-2 pt-4 pb-8 sm:px-4">
      <div className="flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <Input.Search
              placeholder="Search product..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: 200 }}
            />
            <Select
              placeholder="Warehouse"
              value={selectedWarehouse || undefined}
              onChange={setSelectedWarehouse}
              allowClear
              style={{ width: 160 }}
            >
              {warehouses.map((w: any) => (
                <Select.Option key={w.id} value={w.id}>{w.name}</Select.Option>
              ))}
            </Select>
            {/* Category Dropdown with Subcategory as Nested Menu */}
            <Select
              placeholder="Category"
              value={selectedCategory || undefined}
              onDropdownVisibleChange={async (visible) => {
                setCategoryPopoverVisible(visible ? 'category' : null);
                if (!visible) return;
                // Preload subcategories for the selected category if any
                if (selectedCategory) {
                  const subs = await fetchSubcategories(selectedCategory);
                  setSubcategories(subs);
                }
              }}
              onChange={async (value) => {
                setSelectedCategory(value);
                setSelectedSubcategory('');
                const subs = await fetchSubcategories(value);
                setSubcategories(subs);
                // If no subcategories, close dropdown
                if (!subs || subs.length === 0) {
                  setTimeout(() => setCategoryPopoverVisible(null), 100);
                }
              }}
              allowClear
              style={{ width: 220 }}
              dropdownRender={() => (
                <div>
                  {categories.map((cat: any) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <div key={cat.id} style={{ position: 'relative' }}>
                        <div
                          style={{
                            padding: '8px 16px',
                            cursor: 'pointer',
                            background: isSelected ? '#f0f0f0' : undefined,
                            fontWeight: isSelected ? 600 : 400,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                          onClick={async (e) => {
                            e.stopPropagation();
                            setSelectedCategory(cat.id);
                            setSelectedSubcategory('');
                            const subs = await fetchSubcategories(cat.id);
                            setSubcategories(subs);
                            if (!subs || subs.length === 0) {
                              setTimeout(() => setCategoryPopoverVisible(null), 100);
                            }
                          }}
                        >
                          {cat.name}
                          {cat.id === selectedCategory && subcategories.length > 0 && (
                            <span style={{ marginLeft: 8 }}>&#9654;</span>
                          )}
                        </div>
                        {/* Subcategory nested menu */}
                        {cat.id === selectedCategory && subcategories.length > 0 && categoryPopoverVisible === 'category' && (
                          <div
                            style={{
                              position: 'absolute',
                              left: '100%',
                              top: 0,
                              background: '#fff',
                              border: '1px solid #eee',
                              minWidth: 180,
                              zIndex: 1000,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            }}
                          >
                            {subcategories.map((sc: any) => (
                              <div
                                key={sc.id}
                                style={{
                                  padding: '8px 16px',
                                  cursor: 'pointer',
                                  background: selectedSubcategory === sc.id ? '#e6f7ff' : undefined,
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSubcategory(sc.id);
                                  setTimeout(() => setCategoryPopoverVisible(null), 100);
                                }}
                              >
                                {sc.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              open={categoryPopoverVisible === 'category'}
            >
              {/* Hide default options, handled in dropdownRender */}
            </Select>
            {/* Show selected subcategory as tag */}
            {selectedSubcategory && (
              <Tag closable onClose={() => setSelectedSubcategory('')} style={{ marginLeft: 8 }}>
                {subcategories.find(sc => sc.id === selectedSubcategory)?.name || 'Subcategory'}
              </Tag>
            )}
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/dashboard/warehouse/add-product')}
          >
            Add Product
          </Button>
        </div>
        <Card className="p-0 overflow-hidden border-0 shadow-sm rounded-xl">
          {loading ? <Spin size="large" /> : (
            <Table
              dataSource={products}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          )}
        </Card>
        <Modal
          title={`Add Stock to ${addStockProduct?.name || ''}`}
          open={addStockModalVisible}
          onOk={handleAddStockOk}
          onCancel={handleAddStockCancel}
        >
          <Input
            type="number"
            min={1}
            value={addStockQuantity}
            onChange={e => setAddStockQuantity(Number(e.target.value))}
            placeholder="Enter quantity"
          />
        </Modal>
      </div>
      <div className="w-full md:w-1/3 lg:w-1/4">
        <Card title="Stock Movements" className="h-full">
          {loadingMovements ? <Spin size="large" /> : (
            <div className="space-y-3">
              {stockMovements.map((m: any) => (
                <div key={m.id} className="flex flex-col pb-2 mb-2 border-b">
                  <div className="flex justify-between text-sm">
                    <span>{m.productName}</span>
                    <span>{m.type === 'IN' ? '+' : '-'}{m.quantity}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{m.type === 'IN' ? 'Stock In' : 'Stock Out'}</span>
                    <span>{m.date ? new Date(m.date).toLocaleString() : ''}</span>
                  </div>
                </div>
              ))}
              {stockMovements.length === 0 && <div className="text-center text-gray-400">No stock movements</div>}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default WarehouseInventory;
