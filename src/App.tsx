import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import type { RootState } from './redux/store';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/dashboard/admin/AdminDashboard';
import VendorDashboard from './pages/dashboard/vendor/VendorDashboard';
import TransporterDashboard from './pages/dashboard/transporter/TransporterDashboard';
import WarehouseDashboard from './pages/dashboard/warehouse/WarehouseDashboard';
import VendorLayout from './components/layout/VendorLayout';
import Orders from './pages/dashboard/vendor/Orders';
import CreateOrder from './pages/dashboard/vendor/CreateOrder';
import OrderDetails from './pages/dashboard/vendor/OrderDetails';
import WorderDetails from './pages/dashboard/warehouse/WorderDetails';
import ProductList from './pages/dashboard/vendor/ProductList';
import ProductDetails from './pages/dashboard/vendor/ProductDetails';
import WarehouseLayout from './components/layout/WarehouseLayout';
import TransporterLayout from './components/layout/TransporterLayout';
import { persistor } from './redux/store';
import WarehouseLocations from './pages/dashboard/warehouse/WarehouseLocations';
import WarehouseOrders from './pages/dashboard/warehouse/WarehouseOrders';
import WarehouseInventory from './pages/dashboard/warehouse/WarehouseInventory';
import AddProduct from './pages/dashboard/warehouse/AddProduct';
import AssignedShipments from './pages/dashboard/transporter/AssignedShipments';
import DeliveryReporting from './pages/dashboard/transporter/DeliveryReporting';
import VehicleRouting from './pages/dashboard/transporter/VehicleRouting';
import TransportLogs from './pages/dashboard/transporter/TransportLogs';
import PerformanceMetrics from './pages/dashboard/transporter/PerformanceMetrics';
import TransporterSettings from './pages/dashboard/transporter/TransporterSettings';
import NotificationsPage from './pages/notifications/NotificationsPage';

import './App.css';

function App() {
  // Get authentication state from Redux
  const { users, tokens, currentUserId } = useSelector((state: RootState) => state.auth);
  const user = currentUserId ? users[currentUserId] : null;
  const token = currentUserId ? tokens[currentUserId] : null;

  // Robust check: authenticated if user and token exist
  const isReallyAuthenticated = Boolean(user && user.id && token);

  // Wait for redux-persist rehydration before rendering routes
  const [rehydrated, setRehydrated] = useState(persistor.getState().bootstrapped);

  useEffect(() => {
    const unsubscribe = persistor.subscribe(() => {
      if (persistor.getState().bootstrapped) setRehydrated(true);
    });
    return unsubscribe;
  }, []);

  if (!rehydrated) {
    // Optionally show a loading spinner here
    return <div>Loading...</div>;
  }

  return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/admin" element={isReallyAuthenticated ? <AdminDashboard /> : <Navigate to="/login" replace />} />
        <Route
          path="/dashboard/vendor/*"
          element={
            isReallyAuthenticated ? (
              <VendorLayout>
                <Routes>
                  <Route index element={<Navigate to="overview" replace />} />
                  <Route path="overview" element={<VendorDashboard />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="orders/create" element={<CreateOrder />} />
                  <Route path="orders/:id" element={<OrderDetails />} />
                  <Route path="products" element={<ProductList />} />
                  <Route path="products/:id" element={<ProductDetails />} />
                </Routes>
              </VendorLayout>
            ) : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/dashboard/transporter/*"
          element={
            isReallyAuthenticated ? (
              <TransporterLayout>
                <Routes>
                  <Route index element={<TransporterDashboard />} />
                  <Route path="overview" element={<TransporterDashboard />} />
                  <Route path="assigned-shipments" element={<AssignedShipments />} />
                  <Route path="delivery-reporting" element={<DeliveryReporting />} />
                  <Route path="vehicle-routing" element={<VehicleRouting />} />
                  <Route path="transport-logs" element={<TransportLogs />} />
                  <Route path="performance" element={<PerformanceMetrics />} />
                  <Route path="settings" element={<TransporterSettings />} />
                </Routes>
              </TransporterLayout>
            ) : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/dashboard/warehouse/*"
          element={
            isReallyAuthenticated ? (
              <WarehouseLayout>
                <Routes>
                  <Route index element={<WarehouseDashboard />} />
                  <Route path="overview" element={<WarehouseDashboard />} />
                  <Route path="locations" element={<WarehouseLocations />} />
                  <Route path="orders" element={<WarehouseOrders />} />
                  <Route path="inventory" element={<WarehouseInventory />} />
                  <Route path="add-product" element={<AddProduct />} />
                  <Route path="orders/:id" element={<WorderDetails />} />
                  {/* Add more warehouse manager routes here */}
                </Routes>
              </WarehouseLayout>
            ) : <Navigate to="/login" replace />
          }
        />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Routes>
  );
}

export default App;
