import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import AdminAIBot from '../admin/AdminAIBot';

const ManagerLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar role={"admin"} />
      <main className="lg:pl-64 min-h-screen">
        <div className="p-4 pt-24 lg:pt-6 sm:p-6 lg:p-8 max-w-7xl mx-auto relative">
          <Outlet />
        </div>
      </main>
      {/* Draggable AI Bot Overlay */}
      <AdminAIBot />
    </div>
  );
};

export default ManagerLayout;
