import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../redux/store';
import {
  FiHome,
  FiPackage,
  FiTruck,
  FiSettings,
  FiMapPin,
  FiClipboard,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { fetchOrders } from '../../apis/orders';
import { setOrders } from '../../redux/slices/orderSlice';

const WarehouseSidebar: React.FC = () => {
  const { users, currentUserId } = useSelector((state: RootState) => state.auth);
  const user = currentUserId ? users[currentUserId] : null;
 
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const generateUserInitials = (name?: string): string => {
    if (!name) return 'WM';
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
      if (currentUserId) {
        try {
          const data = await fetchOrders();
          dispatch(setOrders({ userId: currentUserId, orders: data }));
        } catch (err) {
          console.error('Error fetching orders:', err);
        }
      }
    };
    getOrders();
  }, [dispatch, currentUserId]);

  useEffect(() => {
    if (location.pathname === '/dashboard/warehouse') {
      navigate('/dashboard/warehouse/overview', { replace: true });
    }
  }, [location.pathname, navigate]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileOpen && !target.closest('.sidebar-container') && !target.closest('.mobile-menu-button')) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileOpen]);

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="mobile-menu-button md:hidden fixed top-4 left-4 z-30 p-2 rounded-md bg-[#1E3B3B] text-white shadow-lg"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <div 
        className={`sidebar-container w-64 h-screen bg-[#1E3B3B] text-white fixed top-0 left-0 shadow-xl z-20 transition-transform duration-300 ease-in-out 
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Logo and Application Title */}
        <div className="p-6 flex items-center space-x-3 border-b border-[#6E8F89]">
          <div className="bg-[#EADCD6] p-2 rounded-lg">
            <FiPackage className="text-[#1E3B3B] text-2xl" />
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
            <p className="font-medium text-[#D6ECE6] truncate">
              {user?.name || 'Warehouse Manager'}
            </p>
            <p className="text-xs text-[#B3D5CF] truncate">
              {formatUserRole(user?.role)}
            </p>
          </div>
        </div>

        {/* Main Navigation Menu */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-220px)]">
          <NavLink
            to="/dashboard/warehouse/overview"
            end
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-[#6E8F89] text-[#B3D5CF] shadow-md'
                  : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-[#B3D5CF]'
              }`
            }
            onClick={() => setIsMobileOpen(false)}
          >
            <FiHome className="flex-shrink-0 text-lg" />
            <span>Overview</span>
          </NavLink>

          <NavLink
            to="/dashboard/warehouse/inventory"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-[#6E8F89] text-[#B3D5CF] shadow-md'
                  : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-[#B3D5CF]'
              }`
            }
            onClick={() => setIsMobileOpen(false)}
          >
            <FiPackage className="flex-shrink-0 text-lg" />
            <span>Inventory</span>
          </NavLink>

          <NavLink
            to="/dashboard/warehouse/orders"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-[#6E8F89] text-[#B3D5CF] shadow-md'
                  : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-[#B3D5CF]'
              }`
            }
            onClick={() => setIsMobileOpen(false)}
          >
            <FiClipboard className="flex-shrink-0 text-lg" />
            <span>Orders</span>
           
          </NavLink>

          <NavLink
            to="/dashboard/warehouse/shipments"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-[#6E8F89] text-[#B3D5CF] shadow-md'
                  : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-[#B3D5CF]'
              }`
            }
            onClick={() => setIsMobileOpen(false)}
          >
            <FiTruck className="flex-shrink-0 text-lg" />
            <span>Shipments</span>
          </NavLink>

          <NavLink
            to="/dashboard/warehouse/locations"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-[#6E8F89] text-[#B3D5CF] shadow-md'
                  : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-[#B3D5CF]'
              }`
            }
            onClick={() => setIsMobileOpen(false)}
          >
            <FiMapPin className="flex-shrink-0 text-lg" />
            <span>Warehouse Locations</span>
          </NavLink>
        </nav>

        {/* Bottom Settings Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#6E8F89] bg-[#1E3B3B]">
          <NavLink
            to="/dashboard/warehouse/settings"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-[#6E8F89] text-[#B3D5CF] shadow-md'
                  : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-[#B3D5CF]'
              }`
            }
            onClick={() => setIsMobileOpen(false)}
          >
            <FiSettings className="flex-shrink-0 text-lg" />
            <span>Settings</span>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default WarehouseSidebar;