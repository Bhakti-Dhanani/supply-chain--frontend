import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, Card, message } from 'antd';
import { fetchMyWarehouses } from '../../../apis/warehouse';
import { fetchCategories } from '../../../apis/inventory';
import { fetchSubcategories } from '../../../apis/inventory';
import { createProduct } from '../../../apis/products';
import { useNavigate } from 'react-router-dom';

const AddProduct: React.FC = () => {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const ws = await fetchMyWarehouses();
        setWarehouses(ws);
        const cats = await fetchCategories();
        setCategories(cats);
      } catch (err) {
        message.error('Failed to load form data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryChange = async (categoryId: string) => {
    form.setFieldsValue({ subcategoryId: undefined });
    const subs = await fetchSubcategories(categoryId);
    setSubcategories(subs);
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await createProduct(values);
      message.success('Product added successfully');
      navigate('/dashboard/warehouse/inventory');
    } catch (err) {
      message.error('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-2 pt-4 pb-8 sm:px-4 flex justify-center">
      <Card title="Add Product" className="w-full max-w-xl">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Product Name" rules={[{ required: true }]}> <Input /> </Form.Item>
          <Form.Item name="warehouseId" label="Warehouse" rules={[{ required: true }]}> <Select placeholder="Select warehouse"> {warehouses.map((w: any) => (<Select.Option key={w.id} value={w.id}>{w.name}</Select.Option>))} </Select> </Form.Item>
          <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}> <Select placeholder="Select category" onChange={handleCategoryChange}> {categories.map((c: any) => (<Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>))} </Select> </Form.Item>
          <Form.Item name="subcategoryId" label="Subcategory" rules={[{ required: true }]}> <Select placeholder="Select subcategory"> {subcategories.map((sc: any) => (<Select.Option key={sc.id} value={sc.id}>{sc.name}</Select.Option>))} </Select> </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}> <Input type="number" min={0} /> </Form.Item>
          <Form.Item name="quantity" label="Initial Stock" rules={[{ required: true }]}> <Input type="number" min={0} /> </Form.Item>
          <Form.Item> <Button type="primary" htmlType="submit" loading={loading}>Add Product</Button> <Button style={{ marginLeft: 8 }} onClick={() => navigate(-1)}>Cancel</Button> </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddProduct;
