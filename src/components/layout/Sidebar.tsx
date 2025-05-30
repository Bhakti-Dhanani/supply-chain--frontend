import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../redux/store';
import {
  FiHome,
  FiPackage,
  FiTruck,
  FiSettings,
  FiTrendingUp,
  FiUsers,
  FiMap,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { fetchOrders } from '../../apis/orders';
import { setOrders } from '../../redux/slices/orderSlice';

const Sidebar: React.FC = () => {
  const { users, currentUserId } = useSelector((state: RootState) => state.auth);
  const user = currentUserId ? users[currentUserId] : null;
  const orderCount = useSelector((state: RootState) => {
    if (currentUserId) {
      const orders = state.orders.orders[currentUserId];
      return Array.isArray(orders) ? orders.length : 0;
    }
    return 0;
  });
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const generateUserInitials = (name?: string): string => {
    if (!name) return 'V';
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
  };

  const formatUserRole = (role?: string): string => {
    if (!role) return 'Premium Member';
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
    if (location.pathname === '/dashboard/vendor') {
      navigate('/dashboard/vendor/overview', { replace: true });
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
            title={user?.name || 'Vendor Account'}
          >
            {generateUserInitials(user?.name)}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-[#D6ECE6] truncate">
              {user?.name || 'Vendor Account'}
            </p>
            <p className="text-xs text-[#B3D5CF] truncate">
              {formatUserRole(user?.role)}
            </p>
          </div>
        </div>

        {/* Main Navigation Menu */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-220px)]">
          <NavLink
            to="/dashboard/vendor/overview"
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
            to="/dashboard/vendor/orders"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-[#6E8F89] text-[#B3D5CF] shadow-md'
                  : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-[#B3D5CF]'
              }`
            }
            onClick={() => setIsMobileOpen(false)}
          >
            <FiTrendingUp className="flex-shrink-0 text-lg" />
            <span>Orders</span>
            <span className="ml-auto bg-[#EADCD6] text-[#1E3B3B] text-xs font-bold px-2 py-1 rounded-full">
              {orderCount}
            </span>
          </NavLink>

          <NavLink
            to="/dashboard/vendor/products"
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
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/dashboard/vendor/shipments"
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
            <span className="ml-auto bg-[#EADCD6] text-[#1E3B3B] text-xs font-bold px-2 py-1 rounded-full">
              2
            </span>
          </NavLink>

          <NavLink
            to="/dashboard/vendor/warehouses"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-[#6E8F89] text-[#B3D5CF] shadow-md'
                  : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-[#B3D5CF]'
              }`
            }
            onClick={() => setIsMobileOpen(false)}
          >
            <FiUsers className="flex-shrink-0 text-lg" />
            <span>Warehouses</span>
          </NavLink>

          <NavLink
            to="/dashboard/vendor/routes"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-[#6E8F89] text-[#B3D5CF] shadow-md'
                  : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-[#B3D5CF]'
              }`
            }
            onClick={() => setIsMobileOpen(false)}
          >
            <FiMap className="flex-shrink-0 text-lg" />
            <span>Delivery Routes</span>
          </NavLink>
        </nav>

        {/* Bottom Settings Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#6E8F89] bg-[#1E3B3B]">
          <NavLink
            to="/dashboard/vendor/settings"
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

export default Sidebar;