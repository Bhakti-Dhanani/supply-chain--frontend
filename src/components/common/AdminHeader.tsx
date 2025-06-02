
import React from 'react';
import { FiBell, FiHelpCircle } from 'react-icons/fi';
import Logout from './Logout';

interface AdminHeaderProps {
  isMobile: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ isMobile }) => {
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
          <button className={`p-${isMobile ? '1' : '2'} rounded-full hover:bg-[#B3D5CF] transition-colors relative`}>
            <FiBell className={`w-${isMobile ? '4' : '5'} h-${isMobile ? '4' : '5'} text-[#1E3B3B]`} />
            <span className={`absolute top-0 right-0 bg-[#1E3B3B] text-[#D6ECE6] text-xs font-bold rounded-full w-${isMobile ? '4' : '5'} h-${isMobile ? '4' : '5'} flex items-center justify-center`}>
              0
            </span>
          </button>
          <Logout />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
