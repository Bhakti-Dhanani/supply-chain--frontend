import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../redux/store';
import { fetchOrders } from '../../apis/orders';
import { setOrders } from '../../redux/slices/orderSlice';

const WarehouseSidebar: React.FC = () => {
  const { users, currentUserId } = useSelector((state: RootState) => state.auth);
  const user = currentUserId ? users[currentUserId] : null;
  const dispatch = useDispatch();

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

  return (
    <>
      {/* Sidebar */}
      <div
        className="w-64 h-screen bg-[#1E3B3B] text-white fixed top-0 left-0 shadow-xl z-40 transition-all duration-300"
      >
        {/* Logo and Application Title */}
        <div className="p-6 flex items-center space-x-3 border-b border-[#6E8F89]">
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
            onClick={() => {}}
          >
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
            onClick={() => {}}
          >
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
            onClick={() => {}}
          >
            <span>Orders</span>
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
            onClick={() => {}}
          >
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
            onClick={() => {}}
          >
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
            onClick={() => {}}
          >
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
            onClick={() => {}}
          >
            <span>Settings</span>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default WarehouseSidebar;