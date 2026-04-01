import React, { useState } from 'react'
import Sidebar from './Sidebar';
import Header from './Header';

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-900">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} /> 
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className='flex-1 overflow-x-hidden overflow-y-auto p-6'>
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppLayout