import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import {
  FiHome,
  FiPackage,
  FiTruck,
  FiSettings,
  FiTrendingUp,
  FiUsers,
  FiMap
} from 'react-icons/fi';

const Sidebar: React.FC = () => {
  // Get authenticated user data from Redux store
  const { user } = useSelector((state: RootState) => state.auth);
  const orderCount = useSelector((state: RootState) => Array.isArray(state.orders.orders) ? state.orders.orders.length : 0);

  /**
   * Generates initials from user's name
   * @param name Full name of the user
   * @returns Initials (e.g., "John Smith" -> "JS")
   */
  const generateUserInitials = (name?: string): string => {
    if (!name) return 'V'; // Default to 'V' for Vendor if no name
    
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
  };

  /**
   * Formats the user role for display
   * @param role User's role from auth
   * @returns Formatted role text
   */
  const formatUserRole = (role?: string): string => {
    if (!role) return 'Premium Member';
    return `${role.charAt(0).toUpperCase()}${role.slice(1).toLowerCase()} Account`;
  };

  return (
    <div className="w-64 h-screen bg-[#1E3B3B] text-white fixed top-0 left-0 shadow-xl z-10">
      {/* Logo and Application Title */}
      <div className="p-6 flex items-center space-x-3 border-b border-[#6E8F89]">
        <div className="bg-[#EADCD6] p-2 rounded-lg">
          <FiPackage className="text-[#1E3B3B] text-2xl" />
        </div>
        <h1 className="text-xl font-bold text-[#D6ECE6]">SupplyChainPro</h1>
      </div>
      
      {/* User Profile Section - Dynamic Content */}
      <div className="p-4 flex items-center space-x-3 border-b border-[#6E8F89]">
        {/* Dynamic Initials Avatar */}
        <div 
          className="w-10 h-10 rounded-full bg-[#B3D5CF] flex items-center justify-center text-[#1E3B3B] font-bold"
          title={user?.name || 'Vendor Account'}
        >
          {generateUserInitials(user?.name)}
        </div>
        
        {/* User Details */}
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
          to="/dashboard/vendor/VendorDashboard"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:text-[#B3D5CF] active:text-[#B3D5CF] ${
              isActive 
                ? 'bg-[#6E8F89] text-[#B3D5CF] shadow-md'
                : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-[#B3D5CF]'
            }`
          }
        >
          <FiHome className="flex-shrink-0 text-lg" />
          <span>Overview</span>
        </NavLink>

        <NavLink
          to="/dashboard/vendor/orders"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:text-[#B3D5CF] active:text-[#B3D5CF] ${
              isActive 
                ? 'bg-[#6E8F89] text-[#B3D5CF] shadow-md'
                : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-[#B3D5CF]'
            }`
          }
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
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:text-[#B3D5CF] active:text-[#B3D5CF] ${
              isActive 
                ? 'bg-[#6E8F89] text-[#B3D5CF] shadow-md'
                : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-[#B3D5CF]'
            }`
          }
        >
          <FiPackage className="flex-shrink-0 text-lg" />
          <span>Products</span>
        </NavLink>

        <NavLink
          to="/dashboard/vendor/shipments"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:text-[#B3D5CF] active:text-[#B3D5CF] ${
              isActive 
                ? 'bg-[#6E8F89] text-[#B3D5CF] shadow-md'
                : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-[#B3D5CF]'
            }`
          }
        >
          <FiTruck className="flex-shrink-0 text-lg" />
          <span>Shipments</span>
          <span className="ml-auto bg-[#EADCD6] text-[#1E3B3B] text-xs font-bold px-2 py-1 rounded-full">
            2
          </span>
        </NavLink>

        <NavLink
          to="/dashboard/vendor/customers"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:text-[#B3D5CF] active:text-[#B3D5CF] ${
              isActive 
                ? 'bg-[#6E8F89] text-[#B3D5CF] shadow-md'
                : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-[#B3D5CF]'
            }`
          }
        >
          <FiUsers className="flex-shrink-0 text-lg" />
          <span>Customers</span>
        </NavLink>

        <NavLink
          to="/dashboard/vendor/routes"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:text-[#B3D5CF] active:text-[#B3D5CF] ${
              isActive 
                ? 'bg-[#6E8F89] text-[#B3D5CF] shadow-md'
                : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-[#B3D5CF]'
            }`
          }
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
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:text-[#B3D5CF] active:text-[#B3D5CF] ${
              isActive 
                ? 'bg-[#6E8F89] text-[#B3D5CF] shadow-md'
                : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-[#B3D5CF]'
            }`
          }
        >
          <FiSettings className="flex-shrink-0 text-lg" />
          <span>Settings</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;