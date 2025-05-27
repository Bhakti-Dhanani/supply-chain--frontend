import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiPackage,
  FiTruck,
  FiSettings,
  FiTrendingUp,
  FiUsers,
  FiMap,
  FiBell
} from 'react-icons/fi';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-screen bg-[#1E3B3B] text-white fixed top-0 left-0 shadow-xl transform transition-all duration-300 hover:shadow-2xl z-10">
      {/* Logo and Title */}
      <div className="p-6 flex items-center space-x-3 border-b border-[#6E8F89]">
        <div className="bg-[#EADCD6] p-2 rounded-lg">
          <FiPackage className="text-[#1E3B3B] text-2xl" />
        </div>
        <h1 className="text-xl font-bold text-[#D6ECE6]">SupplyChainPro</h1>
      </div>
      
      {/* User Profile */}
      <div className="p-4 flex items-center space-x-3 border-b border-[#6E8F89]">
        <div className="w-10 h-10 rounded-full bg-[#B3D5CF] flex items-center justify-center text-[#1E3B3B] font-bold">
          V
        </div>
        <div>
          <p className="font-medium text-[#D6ECE6]">Vendor Account</p>
          <p className="text-xs text-[#B3D5CF]">Premium Member</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="p-4 space-y-1">
        <NavLink
          to="/dashboard/vendor/overview"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive 
                ? 'bg-[#6E8F89] text-white shadow-md'
                : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-white'
            }`
          }
        >
          <FiHome className="text-lg" />
          <span>Overview</span>
        </NavLink>

        <NavLink
          to="/dashboard/vendor/orders"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive 
                ? 'bg-[#6E8F89] text-white shadow-md'
                : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-white'
            }`
          }
        >
          <FiTrendingUp className="text-lg" />
          <span>Orders</span>
          <span className="ml-auto bg-[#EADCD6] text-[#1E3B3B] text-xs font-bold px-2 py-1 rounded-full">5</span>
        </NavLink>

        <NavLink
          to="/dashboard/vendor/products"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive 
                ? 'bg-[#6E8F89] text-white shadow-md'
                : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-white'
            }`
          }
        >
          <FiPackage className="text-lg" />
          <span>Products</span>
        </NavLink>

        <NavLink
          to="/dashboard/vendor/shipments"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive 
                ? 'bg-[#6E8F89] text-white shadow-md'
                : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-white'
            }`
          }
        >
          <FiTruck className="text-lg" />
          <span>Shipments</span>
          <span className="ml-auto bg-[#EADCD6] text-[#1E3B3B] text-xs font-bold px-2 py-1 rounded-full">2</span>
        </NavLink>

        <NavLink
          to="/dashboard/vendor/customers"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive 
                ? 'bg-[#6E8F89] text-white shadow-md'
                : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-white'
            }`
          }
        >
          <FiUsers className="text-lg" />
          <span>Customers</span>
        </NavLink>

        <NavLink
          to="/dashboard/vendor/routes"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive 
                ? 'bg-[#6E8F89] text-white shadow-md'
                : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-white'
            }`
          }
        >
          <FiMap className="text-lg" />
          <span>Delivery Routes</span>
        </NavLink>
      </nav>

      {/* Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#6E8F89]">
        <NavLink
          to="/dashboard/vendor/settings"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive 
                ? 'bg-[#6E8F89] text-white shadow-md'
                : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-white'
            }`
          }
        >
          <FiSettings className="text-lg" />
          <span>Settings</span>
        </NavLink>

        <button className="w-full mt-2 flex items-center space-x-3 px-4 py-3 rounded-lg text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-white transition-all duration-200">
          <FiBell className="text-lg" />
          <span>Notifications</span>
          <span className="ml-auto bg-[#EADCD6] text-[#1E3B3B] text-xs font-bold px-2 py-1 rounded-full">3</span>
        </button>
      </div>

      {/* Mobile Toggle (hidden on desktop) */}
      <button className="md:hidden absolute -right-12 top-4 bg-[#1E3B3B] p-2 rounded-r-lg text-white">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
};

export default Sidebar;