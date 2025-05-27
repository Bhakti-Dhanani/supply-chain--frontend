import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './redux/store';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/dashboard/admin/AdminDashboard';
import VendorDashboard from './pages/dashboard/vendor/VendorDashboard';
import TransporterDashboard from './pages/dashboard/transporter/TransporterDashboard';
import WarehouseDashboard from './pages/dashboard/warehouse/WarehouseDashboard';
import VendorHeader from './components/common/VendorHeader';
import Sidebar from './components/layout/Sidebar';


import './App.css'

function App() {
  // Get authentication state from Redux
  const isAuthenticated = useSelector((state: RootState) => !!(state.auth.user && state.auth.user.id));

  return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/admin" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" replace />} />
        <Route
          path="/dashboard/vendor/*"
          element={
            isAuthenticated ? (
              <div className="flex flex-col min-h-screen">
                <VendorHeader />
                <div className="flex flex-1">
                  <Sidebar />
                  <div className="flex-grow p-4">
                    <Routes>
                      <Route index element={<VendorDashboard />} />
                      <Route path="overview" element={<VendorDashboard />} />
                      <Route path="orders" element={<VendorDashboard />} />
                      <Route path="products" element={<VendorDashboard />} />
                      <Route path="settings" element={<VendorDashboard />} />
                    </Routes>
                  </div>
                </div>
              </div>
            ) : <Navigate to="/login" replace />
          }
        />
        <Route path="/dashboard/transporter" element={isAuthenticated ? <TransporterDashboard /> : <Navigate to="/login" replace />} />
        <Route path="/dashboard/warehouse" element={isAuthenticated ? <WarehouseDashboard /> : <Navigate to="/login" replace />} />
      </Routes>
  )
}

export default App
