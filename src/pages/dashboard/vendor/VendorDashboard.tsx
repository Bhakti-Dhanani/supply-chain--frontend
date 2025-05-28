import React from 'react';

const VendorDashboard: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <div className="flex-grow p-4">
          <h1 className="text-2xl font-bold text-[#1E3B3B] mb-4">Welcome to your Vendor Dashboard!</h1>
          <p className="text-[#1E3B3B] mb-2">Use the sidebar to navigate your orders, products, shipments, and more.</p>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
