import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOrderById } from '../../../apis/orders';
import { FiMapPin, FiPackage, FiTruck, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import { Card, Spin, Tag, } from 'antd';
import { format } from 'date-fns';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!id) return;
    const getOrder = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchOrderById(id);
        setOrder(data);
      } catch (err) {
        setError('Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    };
    getOrder();
  }, [id]);

  useEffect(() => {
    if (
      order?.location &&
      order.warehouse &&
      isLoaded &&
      window.google &&
      window.google.maps &&
      typeof window.google.maps.DirectionsService === 'function'
    ) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: { lat: Number(order.warehouse.latitude), lng: Number(order.warehouse.longitude) },
          destination: { lat: Number(order.location.latitude), lng: Number(order.location.longitude) },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`error fetching directions`, result);
          }
        }
      );
    }
  }, [order, isLoaded]);

  useEffect(() => {
    if (mapRef.current && order?.location && order.warehouse) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend({ lat: Number(order.location.latitude), lng: Number(order.location.longitude) });
      if (order.warehouse.latitude && order.warehouse.longitude) {
        bounds.extend({ lat: Number(order.warehouse.latitude), lng: Number(order.warehouse.longitude) });
      }
      mapRef.current.fitBounds(bounds);
      
      // Add padding on mobile to account for header
      if (isMobile) {
        mapRef.current.panBy(0, -50);
      }
    }
  }, [order, isMobile]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <FiClock className="mr-2 text-[#EADCD6]" />;
      case 'completed':
      case 'delivered':
        return <FiCheckCircle className="mr-2 text-[#B3D5CF]" />;
      case 'shipped':
        return <FiTruck className="mr-2 text-[#6E8F89]" />;
      default:
        return <FiAlertCircle className="mr-2 text-[#2A4D4D]" />;
    }
  };

  const statusColors: Record<string, string> = {
    'Delivered': 'bg-[#B3D5CF] text-[#1E3B3B]',
    'Pending': 'bg-[#EADCD6] text-[#1E3B3B]',
    'Shipped': 'bg-[#6E8F89] text-[#D6ECE6]',
    'Cancelled': 'bg-[#2A4D4D] text-[#D6ECE6]',
  };

  return (
    <div className="min-h-screen px-0 sm:px-0 pt-4 pb-8 bg-white">
      <div className="transition-all duration-300 ml-0">
        <div className="flex flex-col gap-4 lg:flex-row sm:gap-6">
          {/* Map Section - Full width on mobile, 2/3 on desktop */}
          <Card className="w-full p-0 overflow-hidden border-0 shadow-sm lg:w-2/3 rounded-xl">
            {order?.location && order.location.latitude && order.location.longitude && isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ 
                  width: '100%', 
                  height: isMobile ? '300px' : '500px',
                  borderRadius: '12px'
                }}
                onLoad={(map) => { mapRef.current = map; }}
                options={{
                  styles: [
                    {
                      featureType: "poi",
                      elementType: "labels",
                      stylers: [{ visibility: "off" }]
                    }
                  ],
                  gestureHandling: isMobile ? 'greedy' : 'auto'
                }}
              >
                <Marker
                  position={{ lat: Number(order.location.latitude), lng: Number(order.location.longitude) }}
                  icon={{
                    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1E3B3B"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>'
                    )}`,
                    scaledSize: new google.maps.Size(isMobile ? 24 : 32, isMobile ? 24 : 32)
                  }}
                />
                {order.warehouse?.latitude && order.warehouse?.longitude && (
                  <Marker
                    position={{ lat: Number(order.warehouse.latitude), lng: Number(order.warehouse.longitude) }}
                    icon={{
                      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6E8F89"><path d="M19 7h-3V6c0-1.1-.9-2-2-2H8C6.9 4 6 4.9 6 6v1H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM8 6h6v1H8V6zm11 12H3V9h3v1c0 .55.45 1 1 1s1-.45 1-1V9h6v1c0 .55.45 1 1 1s1-.45 1-1V9h3v9z"/></svg>'
                      )}`,
                      scaledSize: new google.maps.Size(isMobile ? 24 : 32, isMobile ? 24 : 32)
                    }}
                  />
                )}
                {directions && <DirectionsRenderer 
                  directions={directions}
                  options={{
                    polylineOptions: {
                      strokeColor: "#1E3B3B",
                      strokeOpacity: 0.8,
                      strokeWeight: isMobile ? 3 : 4
                    },
                    suppressMarkers: true
                  }}
                />}
              </GoogleMap>
            ) : (
              <div className={`flex items-center justify-center ${isMobile ? 'h-64' : 'h-96'} bg-[#F5F9F8] rounded-lg text-[#1E3B3B]`}>
                {loading ? 'Loading map...' : 'Location not available'}
              </div>
            )}
          </Card>

          {/* Order Details Section - Full width on mobile, 1/3 on desktop */}
          <div className="w-full lg:w-1/3">
            <Card className="h-full border-0 shadow-sm rounded-xl">
              {loading ? (
                <div className="flex justify-center p-8">
                  <Spin size="large" />
                </div>
              ) : error ? (
                <div className="text-[#2A4D4D] p-4">{error}</div>
              ) : order ? (
                <>
                  <div className="flex flex-col justify-between gap-2 mb-4 sm:flex-row sm:items-center sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-[#1E3B3B] truncate">Order #{order.id}</h2>
                    <Tag className={`px-3 py-1 rounded-full text-xs sm:text-sm ${statusColors[order.status] || 'bg-[#EADCD6] text-[#1E3B3B]'}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </Tag>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {/* Order Summary */}
                    <div className="bg-[#F5F9F8] p-3 sm:p-4 rounded-lg">
                      <h3 className="text-xs sm:text-sm font-semibold text-[#6E8F89] mb-2">ORDER SUMMARY</h3>
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <div>
                          <p className="text-xs text-[#6E8F89]">Date</p>
                          <p className="text-sm font-medium text-[#1E3B3B]">
                            {order.created_at ? format(new Date(order.created_at), 'MMM d, yyyy') : '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#6E8F89]">Amount</p>
                          <p className="text-sm font-medium text-[#1E3B3B]">
                            ${Number(order.total_amount || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Address */}
                    {order.location && (
                      <div className="bg-[#F5F9F8] p-3 sm:p-4 rounded-lg">
                        <h3 className="text-xs sm:text-sm font-semibold text-[#6E8F89] mb-2">DELIVERY ADDRESS</h3>
                        <div className="flex items-start">
                          <FiMapPin className="mt-0.5 mr-2 text-[#6E8F89]" size={isMobile ? 14 : 16} />
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-[#1E3B3B]">
                              {order.location.house}, {order.location.street}
                            </p>
                            <p className="text-xs text-[#6E8F89]">
                              {order.location.city}, {order.location.state}, {order.location.country}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Warehouse Details */}
                    {order.warehouse && (
                      <div className="bg-[#F5F9F8] p-3 sm:p-4 rounded-lg">
                        <h3 className="text-xs sm:text-sm font-semibold text-[#6E8F89] mb-2">WAREHOUSE DETAILS</h3>
                        <div className="flex items-start">
                          <FiPackage className="mt-0.5 mr-2 text-[#6E8F89]" size={isMobile ? 14 : 16} />
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-[#1E3B3B]">
                              {order.warehouse.name}
                            </p>
                            <p className="text-xs text-[#6E8F89]">
                              {order.warehouse.address}
                            </p>
                            {order.warehouse.manager && (
                              <p className="text-xs text-[#6E8F89] mt-1">
                                Manager: {order.warehouse.manager.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Order Items */}
                    {order.items && Array.isArray(order.items) && order.items.length > 0 && (
                      <div className="bg-[#F5F9F8] p-3 sm:p-4 rounded-lg">
                        <h3 className="text-xs sm:text-sm font-semibold text-[#6E8F89] mb-2">ORDER ITEMS</h3>
                        <div className="space-y-2 sm:space-y-3">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center pb-2 border-b border-[#EADCD6] last:border-0">
                              <div className="flex items-center">
                                <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} bg-[#EADCD6] rounded flex items-center justify-center mr-2 sm:mr-3`}>
                                  <FiPackage className="text-[#1E3B3B]" size={isMobile ? 12 : 14} />
                                </div>
                                <div className="max-w-[120px] sm:max-w-[180px]">
                                  <p className="text-xs sm:text-sm font-medium text-[#1E3B3B] truncate">
                                    {item.product?.name || 'Product'}
                                  </p>
                                  <p className="text-xs text-[#6E8F89]">Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <p className="text-xs sm:text-sm font-medium text-[#1E3B3B] whitespace-nowrap">
                                ${Number(item.price || 0).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;