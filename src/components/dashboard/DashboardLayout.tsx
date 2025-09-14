import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSearchResult = (result: any) => {
    console.log('Search result:', result);
    // يمكن إضافة منطق التنقل هنا
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={handleSidebarToggle} />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col lg:mr-64">
        {/* Header */}
        <Header 
          onSidebarToggle={handleSidebarToggle}
          onSearchResult={handleSearchResult}
        />
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
