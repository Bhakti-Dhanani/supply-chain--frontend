import React from 'react';
import WarehouseSidebar from './WarehouseSidebar';
import VendorHeader from '../common/VendorHeader';

interface WarehouseLayoutProps {
  children: React.ReactNode;
}

const WarehouseLayout: React.FC<WarehouseLayoutProps> = ({ children }) => {
  // Responsive logic can be added here if needed
  return (
    <div className="flex min-h-screen bg-gray-50">
      <WarehouseSidebar />
      <div className="flex-1 ml-0 lg:ml-64">
        <VendorHeader isMobile={false} />
        <main className="pt-4 pb-8 px-2 sm:px-4 md:px-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default WarehouseLayout;
