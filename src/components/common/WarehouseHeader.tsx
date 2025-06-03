import React, { useEffect, useState } from 'react';
import { FiBell, FiHelpCircle } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import Logout from './Logout';
import { fetchUnreadNotificationCountAndDetails, markNotificationAsReadInDatabase } from '../../apis/notifications';
import type { RootState } from '../../redux/store';

interface WarehouseHeaderProps {
  isMobile: boolean;
}

const WarehouseHeader: React.FC<WarehouseHeaderProps> = ({ isMobile }) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const currentUserId = useSelector((state: RootState) => state.auth.currentUserId);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await fetchUnreadNotificationCountAndDetails();
        setUnreadCount(data.count);
        setNotifications(data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setUnreadCount(0);
        setNotifications([]);
      }
    };
    fetchNotifications();
  }, [currentUserId]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await markNotificationAsReadInDatabase(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <header className={`sticky top-0 z-10 bg-[#6E8F89] shadow-md border-b border-[#1E3B3B] ${isMobile ? 'p-2' : 'p-4'}`}>
      <div className={`flex items-center justify-between ${isMobile ? 'text-sm' : 'text-base'} transition-all duration-300`}>
        {/* Left side - Only Title, no logo */}
        <div>
          <h1 className={`font-bold text-[#1E3B3B] ${isMobile ? 'truncate max-w-[120px]' : 'truncate max-w-[180px]'}`}>
          </h1>
        </div>
        {/* Right side - Help, Bell, Logout */}
        <div className={`flex items-center space-x-${isMobile ? '2' : '4'} md:space-x-${isMobile ? '4' : '6'}`}>
          <button className={`p-${isMobile ? '1' : '2'} rounded-full hover:bg-[#B3D5CF] transition-colors`}>
            <FiHelpCircle className={`w-${isMobile ? '4' : '5'} h-${isMobile ? '4' : '5'} text-[#1E3B3B]`} />
          </button>
          <button
            className={`p-${isMobile ? '1' : '2'} rounded-full hover:bg-[#B3D5CF] transition-colors relative`}
            onClick={toggleNotifications}
          >
            <FiBell className={`w-${isMobile ? '4' : '5'} h-${isMobile ? '4' : '5'} text-[#1E3B3B]`} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <Logout />
        </div>
      </div>
      {showNotifications && (
        <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg p-4 w-64 z-50">
          <h3 className="text-sm font-bold text-[#1E3B3B] mb-2">Notifications</h3>
          <p className="text-xs text-[#6E8F89] mb-2">You have {unreadCount} unread notifications.</p>
          <ul className="max-h-48 overflow-y-auto">
            {notifications.length > 0 ? notifications.map((n) => (
              <li key={n.id} className="mb-2 p-2 rounded hover:bg-[#F0F7F6]">
                <span className="block text-xs text-[#1E3B3B]">{n.message}</span>
                <span className="block text-[10px] text-gray-400">{new Date(n.created_at).toLocaleString()}</span>
                <button
                  className="text-[10px] text-blue-500 hover:underline mt-1"
                  onClick={() => markAsRead(n.id)}
                >
                  Mark as Read
                </button>
              </li>
            )) : <li className="text-xs text-gray-400">No unread notifications.</li>}
          </ul>
        </div>
      )}
    </header>
  );
};

export default WarehouseHeader;
