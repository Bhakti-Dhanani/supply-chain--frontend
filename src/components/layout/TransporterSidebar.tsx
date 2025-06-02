import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../redux/store';
import {
  FiHome,
  FiTruck,
  FiSettings,
  FiTrendingUp,
  FiMap,
  FiClipboard,
  FiBarChart2,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { fetchShipments } from '../../apis/shipments';
import { setShipments } from '../../redux/slices/shipmentSlice';

const TransporterSidebar: React.FC = () => {
  const { users, currentUserId } = useSelector((state: RootState) => state.auth);
  const user = currentUserId ? users[currentUserId] : null;
  const shipmentCount = useSelector((state: RootState) => {
    if (currentUserId) {
      const shipments = state.shipments.shipments[currentUserId];
      return Array.isArray(shipments) ? shipments.length : 0;
    }
    return 0;
  });
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const generateUserInitials = (name?: string): string => {
    if (!name) return 'TR';
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
  };

  const formatUserRole = (role?: string): string => {
    if (!role) return 'Transporter';
    return `${role.charAt(0).toUpperCase()}${role.slice(1).toLowerCase()}`;
  };

  useEffect(() => {
    const getShipments = async () => {
      if (currentUserId) {
        try {
                  const data = await fetchShipments(); // Removed argument from fetchShipments
          dispatch(setShipments(data)); // Removed userId property from dispatch
        } catch (err) {
          console.error('Error fetching shipments:', err);
        }
      }
    };
    getShipments();
  }, [dispatch, currentUserId]);

  useEffect(() => {
    if (location.pathname === '/dashboard/transporter') {
      navigate('/dashboard/transporter/overview', { replace: true });
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
            <FiTruck className="text-[#1E3B3B] text-2xl" />
          </div>
          <h1 className="text-xl font-bold text-[#D6ECE6]">SupplyChainPro</h1>
        </div>
        
        {/* User Profile Section */}
        <div className="p-4 flex items-center space-x-3 border-b border-[#6E8F89]">
          <div 
            className="w-10 h-10 rounded-full bg-[#B3D5CF] flex items-center justify-center text-[#1E3B3B] font-bold"
            title={user?.name || 'Transporter'}
          >
            {generateUserInitials(user?.name)}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-[#D6ECE6] truncate">
              {user?.name || 'Transporter'}
            </p>
            <p className="text-xs text-[#B3D5CF] truncate">
              {formatUserRole(user?.role)}
            </p>
          </div>
        </div>

        {/* Main Navigation Menu */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-220px)]">
          <NavLink
            to="/dashboard/transporter/overview"
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
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/dashboard/transporter/assigned-shipments"
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
            <span>Assigned Shipments</span>
            <span className="ml-auto bg-[#EADCD6] text-[#1E3B3B] text-xs font-bold px-2 py-1 rounded-full">
              {shipmentCount}
            </span>
          </NavLink>

          <NavLink
            to="/dashboard/transporter/delivery-reporting"
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
            <span>Delivery Reporting</span>
          </NavLink>

          <NavLink
            to="/dashboard/transporter/vehicle-routing"
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
            <span>Vehicle Routing</span>
          </NavLink>

          <NavLink
            to="/dashboard/transporter/transport-logs"
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
            <span>Transport Logs</span>
          </NavLink>

          <NavLink
            to="/dashboard/transporter/performance"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-[#6E8F89] text-[#B3D5CF] shadow-md'
                  : 'text-[#D6ECE6] hover:bg-[#2A4D4D] hover:text-[#B3D5CF]'
              }`
            }
            onClick={() => setIsMobileOpen(false)}
          >
            <FiBarChart2 className="flex-shrink-0 text-lg" />
            <span>Performance Metrics</span>
          </NavLink>
        </nav>

        {/* Bottom Settings Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#6E8F89] bg-[#1E3B3B]">
          <NavLink
            to="/dashboard/transporter/settings"
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

export default TransporterSidebar;