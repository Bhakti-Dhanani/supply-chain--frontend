import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../redux/store';
import {
  FiHome,
  FiPackage,
  FiTruck,
  FiSettings,
  FiTrendingUp,
  FiMap,
  FiAlertCircle,
  FiBox,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { fetchOrders } from '../../apis/orders';
import { setOrders } from '../../redux/slices/orderSlice';

const WarehouseSidebar: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const orderCount = useSelector((state: RootState) => Array.isArray(state.orders.orders) ? state.orders.orders.length : 0);
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const generateUserInitials = (name?: string): string => {
    if (!name) return 'Manager';
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
  };

  const formatUserRole = (role?: string): string => {
    if (!role) return 'Manager';
    return `${role.charAt(0).toUpperCase()}${role.slice(1).toLowerCase()} Account`;
  };

  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchOrders();
        dispatch(setOrders(data));
      } catch (err) {}
    };
    getOrders();
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-[#1E3B3B] text-[#D6ECE6] shadow-lg"
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`w-64 h-screen bg-[#1E3B3B] text-white fixed top-0 left-0 shadow-xl z-40 transition-all duration-300 ${
          isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : ''
        }`}
      >
        {/* Logo and Application Title */}
        <div className="p-6 flex items-center space-x-3 border-b border-[#6E8F89]">
          <div className="bg-[#EADCD6] p-2 rounded-lg">
            <FiBox className="text-[#1E3B3B] text-2xl" />
          </div>
          <h1 className="text-xl font-bold text-[#D6ECE6]">SupplyChainPro</h1>
        </div>

        {/* User Profile Section */}
        <div className="p-4 flex items-center space-x-3 border-b border-[#6E8F89]">
          <div 
            className="w-10 h-10 rounded-full bg-[#B3D5CF] flex items-center justify-center text-[#1E3B3B] font-bold" 
            title={user?.name || 'Warehouse Manager'}
          >
            {generateUserInitials(user?.name)}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-[#D6ECE6] truncate">{user?.name || 'Warehouse Manager'}</p>
            <p className="text-xs text-[#B3D5CF] truncate">{formatUserRole(user?.role)}</p>
          </div>
        </div>

        {/* Main Navigation Menu */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-220px)]">
          <NavLink
            to="/dashboard/warehouse/overview"
            end
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:text-[#B3D5CF] active:text-[#B3D5CF] ${
                isActive 
                  ? 'bg-[#6E8F89] text-[#B3D5CF] shadow-md'
                  : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-[#B3D5CF]'
              }`
            }
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            <FiHome className="flex-shrink-0 text-lg" />
            <span>Overview</span>
          </NavLink>

          <NavLink
            to="/dashboard/warehouse/inventory"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:text-[#B3D5CF] active:text-[#B3D5CF] ${
                isActive 
                  ? 'bg-[#6E8F89] text-[#B3D5CF] shadow-md'
                  : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-[#B3D5CF]'
              }`
            }
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            <FiPackage className="flex-shrink-0 text-lg" />
            <span>Inventory</span>
          </NavLink>

          <NavLink
            to="/dashboard/warehouse/orders"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:text-[#B3D5CF] active:text-[#B3D5CF] ${
                isActive 
                  ? 'bg-[#6E8F89] text-[#B3D5CF] shadow-md'
                  : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-[#B3D5CF]'
              }`
            }
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            <FiTrendingUp className="flex-shrink-0 text-lg" />
            <span>Orders</span>
            <span className="ml-auto bg-[#EADCD6] text-[#1E3B3B] text-xs font-bold px-2 py-1 rounded-full">
              {orderCount}
            </span>
          </NavLink>

          <NavLink
            to="/dashboard/warehouse/shipments"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:text-[#B3D5CF] active:text-[#B3D5CF] ${
                isActive 
                  ? 'bg-[#6E8F89] text-[#B3D5CF] shadow-md'
                  : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-[#B3D5CF]'
              }`
            }
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            <FiTruck className="flex-shrink-0 text-lg" />
            <span>Shipments</span>
          </NavLink>

          <NavLink
            to="/dashboard/warehouse/alerts"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:text-[#B3D5CF] active:text-[#B3D5CF] ${
                isActive 
                  ? 'bg-[#6E8F89] text-[#B3D5CF] shadow-md'
                  : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-[#B3D5CF]'
              }`
            }
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            <FiAlertCircle className="flex-shrink-0 text-lg" />
            <span>Reorder Alerts</span>
          </NavLink>

          <NavLink
            to="/dashboard/warehouse/locations"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:text-[#B3D5CF] active:text-[#B3D5CF] ${
                isActive 
                  ? 'bg-[#6E8F89] text-[#B3D5CF] shadow-md'
                  : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-[#B3D5CF]'
              }`
            }
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            <FiMap className="flex-shrink-0 text-lg" />
            <span>Warehouse Locations</span>
          </NavLink>
        </nav>

        {/* Bottom Settings Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#6E8F89] bg-[#1E3B3B]">
          <NavLink
            to="/dashboard/warehouse/settings"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:text-[#B3D5CF] active:text-[#B3D5CF] ${
                isActive 
                  ? 'bg-[#6E8F89] text-[#B3D5CF] shadow-md'
                  : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-[#B3D5CF]'
              }`
            }
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            <FiSettings className="flex-shrink-0 text-lg" />
            <span>Settings</span>
          </NavLink>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default WarehouseSidebar;