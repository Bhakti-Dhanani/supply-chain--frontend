import React from 'react';
import { FiBell, FiHelpCircle } from 'react-icons/fi';
import Logout from './Logout';

interface VendorHeaderProps {
  isMobile: boolean;
}

const VendorHeader: React.FC<VendorHeaderProps> = ({ isMobile }) => {
  return (
    <header className="sticky top-0 z-10 bg-[#6E8F89] shadow-md border-b border-[#1E3B3B]">
      <div className={`flex items-center justify-between p-4 transition-all duration-300`}>
        {/* Left side - Only Title, no logo */}
        <div>
          <h1 className={`text-xl font-bold text-[#1E3B3B] ${
            isMobile ? 'truncate max-w-[180px]' : ''
          }`}>
          </h1>
        </div>
        {/* Right side - Help, Bell, Logout */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <button className="p-2 rounded-full hover:bg-[#B3D5CF] transition-colors">
            <FiHelpCircle className="w-5 h-5 text-[#1E3B3B]" />
          </button>
          <button className="p-2 rounded-full hover:bg-[#B3D5CF] transition-colors relative">
            <FiBell className="w-5 h-5 text-[#1E3B3B]" />
            <span className="absolute top-0 right-0 bg-[#1E3B3B] text-[#D6ECE6] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>
          <Logout />
        </div>
      </div>
    </header>
  );
};

export default VendorHeader;