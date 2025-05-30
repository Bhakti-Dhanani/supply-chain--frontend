import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import VendorHeader from '../common/VendorHeader';

interface VendorLayoutProps {
  children: React.ReactNode;
}

const VendorLayout: React.FC<VendorLayoutProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's md breakpoint
    };

    // Set initial value
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <VendorHeader isMobile={isMobile} />
      <div className="relative flex flex-1">
        <Sidebar />
        <main 
          className={`flex-grow p-4 transition-all duration-300 ${
            isMobile ? 'mt-16' : 'mt-0 md:ml-64'
          } ${
            sidebarOpen && isMobile ? 'ml-64' : 'ml-0'
          }`}
        >
          <div className="max-w-full overflow-x-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default VendorLayout;