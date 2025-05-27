import React from 'react';
import { FiBell, FiHelpCircle } from 'react-icons/fi';
import Logout from './Logout';

const VendorHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 bg-[#6E8F89] shadow-md border-b border-[#1E3B3B]">
      <div className="flex items-center justify-between p-4 ml-64"> {/* ml-64 matches sidebar width */}
        {/* Left side - Title aligned with sidebar */}
        <h1 className="text-xl font-bold text-[#1E3B3B]">Vendor Dashboard</h1>

        {/* Right side - Navigation icons */}
        <div className="flex items-center space-x-6">
          <button className="p-2 rounded-full hover:bg-[#B3D5CF] transition-colors">
            <FiHelpCircle className="w-5 h-5 text-[#1E3B3B]" />
          </button>
          
          <button className="p-2 rounded-full hover:bg-[#B3D5CF] transition-colors relative">
            <FiBell className="w-5 h-5 text-[#1E3B3B]" />
            <span className="absolute top-0 right-0 bg-[#1E3B3B] text-[#D6ECE6] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>
          
          <div className="relative group">
            <button className="flex items-center space-x-2 hover:bg-[#B3D5CF] px-3 py-2 rounded-lg transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#1E3B3B] flex items-center justify-center text-[#D6ECE6] font-bold">
                V
              </div>
              <span className="text-[#1E3B3B]">Vendor</span>
            </button>
            
            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-48 bg-[#D6ECE6] rounded-md shadow-lg py-1 border border-[#6E8F89] hidden group-hover:block">
              <Logout />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default VendorHeader;