import { Routes, Route, Navigate } from 'react-router-dom';
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
 

  return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route

          path="/dashboard/vendor/*"
          element={
            <div className="flex flex-col min-h-screen">
              <VendorHeader />
              <div className="flex flex-1">
                <Sidebar />
                <div className="flex-grow p-4">
                  <Routes>
                  
                     <Route index element={<VendorDashboard />} />
                    <Route path="VendorDashboard" element={<VendorDashboard />} />
                    <Route path="orders" element={<VendorDashboard />} />
                    <Route path="products" element={<VendorDashboard />} />
                    <Route path="settings" element={<VendorDashboard />} />
                  </Routes>
                </div>
              </div>
            </div>
          }
        />
        <Route path="/dashboard/transporter" element={<TransporterDashboard />} />
        <Route path="/dashboard/warehouse" element={<WarehouseDashboard />} />
      </Routes>
  )
}

export default App
