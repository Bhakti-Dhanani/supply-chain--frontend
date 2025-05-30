import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../../../apis/products';
import { Spin, message, Tag } from 'antd';
import { 
  FiArrowLeft,
  FiBox,
  FiDollarSign,
  FiHash,
  FiInfo,
  FiLayers,
  FiMapPin,
  FiPackage,
  FiTag
} from 'react-icons/fi';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(Number(id));
        setProduct(data);
      } catch (error) {
        message.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const getStockStatus = (quantity: number) => {
    if (quantity <= 0) return <Tag color="red">Out of Stock</Tag>;
    if (quantity < 10) return <Tag color="orange">Low Stock</Tag>;
    return <Tag color="green">In Stock</Tag>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen md:ml-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 md:ml-64">
        Product not found
      </div>
    );
  }

  return (
    <div className="min-h-screen px-2 pt-4 pb-8 sm:px-4">
      <div className={`transition-all duration-300 ml-0`}>
        <div className="flex flex-col gap-4 lg:flex-row sm:gap-6">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#1E3B3B] hover:text-[#2A4D4D] mb-4 text-sm"
          >
            <FiArrowLeft className="mr-1" />
            Back to Products
          </button>

          {/* Product Card */}
          <div className="flex-1 overflow-hidden bg-white rounded-lg shadow-sm">
            {/* Header */}
            <div className="bg-[#1E3B3B] p-4 text-white">
              <div className="flex flex-col">
                <h1 className="flex items-center gap-2 text-xl font-bold">
                  <FiPackage className="text-[#B3D5CF]" />
                  {product.name}
                </h1>
                <div className="flex items-center mt-1">
                  <span className="bg-[#6E8F89] text-[#D6ECE6] px-2 py-0.5 rounded-full text-xs flex items-center">
                    <FiHash className="mr-1" /> #{product.id}
                  </span>
                  <div className="ml-2">
                    {getStockStatus(product.quantity)}
                  </div>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
              {/* Description */}
              <div className="bg-[#F5F9F8] p-3 rounded border border-[#D6ECE6]">
                <div className="flex items-center text-[#6E8F89] text-sm font-medium mb-1">
                  <FiInfo className="mr-1" />
                  Description
                </div>
                <p className="text-[#1E3B3B] text-sm">{product.description || 'No description'}</p>
              </div>

              {/* Price */}
              <div className="bg-[#F5F9F8] p-3 rounded border border-[#D6ECE6]">
                <div className="flex items-center text-[#6E8F89] text-sm font-medium mb-1">
                  <FiDollarSign className="mr-1" />
                  Price
                </div>
                <p className="text-xl font-bold text-[#1E3B3B]">
                  ₹{typeof product.price === 'number' ? product.price.toFixed(2) : Number(product.price).toFixed(2)}
                </p>
              </div>

              {/* Quantity */}
              <div className="bg-[#F5F9F8] p-3 rounded border border-[#D6ECE6]">
                <div className="flex items-center text-[#6E8F89] text-sm font-medium mb-1">
                  <FiBox className="mr-1" />
                  Quantity
                </div>
                <div className="flex items-center">
                  <span className="text-xl font-bold text-[#1E3B3B] mr-2">{product.quantity}</span>
                  {getStockStatus(product.quantity)}
                </div>
              </div>

              {/* Warehouse */}
              <div className="bg-[#F5F9F8] p-3 rounded border border-[#D6ECE6]">
                <div className="flex items-center text-[#6E8F89] text-sm font-medium mb-1">
                  <FiMapPin className="mr-1" />
                  Warehouse
                </div>
                <p className="text-[#1E3B3B] text-sm">
                  {product.warehouse?.name || 'N/A'}
                </p>
              </div>

              {/* Category */}
              <div className="bg-[#F5F9F8] p-3 rounded border border-[#D6ECE6]">
                <div className="flex items-center text-[#6E8F89] text-sm font-medium mb-1">
                  <FiLayers className="mr-1" />
                  Category
                </div>
                <p className="text-[#1E3B3B] text-sm">
                  {product.category?.name || 'N/A'}
                  {product.subcategory?.name && (
                    <span className="block text-xs text-[#6E8F89]">({product.subcategory.name})</span>
                  )}
                </p>
              </div>

              {/* SKU */}
              <div className="bg-[#F5F9F8] p-3 rounded border border-[#D6ECE6]">
                <div className="flex items-center text-[#6E8F89] text-sm font-medium mb-1">
                  <FiTag className="mr-1" />
                  SKU
                </div>
                <p className="text-[#1E3B3B] text-sm">
                  {product.sku || 'N/A'}
                </p>
              </div>
            </div>

            {/* Back Button at Bottom */}
            <div className="p-4 border-t border-[#D6ECE6] flex justify-end">
              <button
                onClick={() => navigate(-1)}
                className="bg-white text-[#1E3B3B] px-4 py-1.5 rounded hover:bg-[#F5F9F8] transition text-sm border border-[#D6ECE6] shadow-sm"
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;