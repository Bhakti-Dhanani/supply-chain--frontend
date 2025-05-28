import React, { useEffect, useState } from 'react';
import { getProductsByWarehouse } from '../../apis/products';
import { Input, Select, Table } from 'antd';

const { Search } = Input;
const { Option } = Select;

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    warehouseId: '',
    categoryId: '',
    subcategoryId: '',
    search: '',
  });

  useEffect(() => {
    // Fetch initial data for warehouses, categories, and subcategories
    const fetchInitialData = async () => {
      // Replace with actual API calls
      const warehouseData = await fetch('/api/warehouses').then((res) => res.json());
      const categoryData = await fetch('/api/categories').then((res) => res.json());
      const subcategoryData = await fetch('/api/subcategories').then((res) => res.json());

      setWarehouses(warehouseData);
      setCategories(categoryData);
      setSubcategories(subcategoryData);
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    // Fetch products based on filters
    const fetchProducts = async () => {
      const data = await getProductsByWarehouse(
        filters.warehouseId,
        filters.categoryId,
        filters.subcategoryId,
        filters.search
      );
      setProducts(data);
    };

    fetchProducts();
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Subcategory',
      dataIndex: 'subcategory',
      key: 'subcategory',
    },
    {
      title: 'Warehouse',
      dataIndex: 'warehouse',
      key: 'warehouse',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
  ];

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Product List</h1>
      <div className="flex gap-4 mb-4">
        <Select
          placeholder="Select Warehouse"
          onChange={(value) => handleFilterChange('warehouseId', value)}
          className="w-1/4"
        >
          <Option value="">All Warehouses</Option>
          {warehouses.map((warehouse) => (
            <Option key={warehouse.id} value={warehouse.id}>
              {warehouse.name}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Select Category"
          onChange={(value) => handleFilterChange('categoryId', value)}
          className="w-1/4"
        >
          <Option value="">All Categories</Option>
          {categories.map((category) => (
            <Option key={category.id} value={category.id}>
              {category.name}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Select Subcategory"
          onChange={(value) => handleFilterChange('subcategoryId', value)}
          className="w-1/4"
        >
          <Option value="">All Subcategories</Option>
          {subcategories.map((subcategory) => (
            <Option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </Option>
          ))}
        </Select>
        <Search
          placeholder="Search Products"
          onSearch={(value) => handleFilterChange('search', value)}
          className="w-1/4"
        />
      </div>
      <Table dataSource={products} columns={columns} rowKey="id" />
    </div>
  );
};

export default ProductList;
