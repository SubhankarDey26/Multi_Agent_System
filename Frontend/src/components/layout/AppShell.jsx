import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import Topbar from './Topbar';
import Toast from '../common/Toast';
import ConfirmDialog from '../common/ConfirmDialog';
import { useAppStore } from '../../store/useAppStore';

export const AppShell = () => {
  const { isSidebarCollapsed, user } = useAppStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F1F5F9] flex flex-col font-sans selection:bg-[#8B7CFF]/30 selection:text-white">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Main Canvas */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        }`}
      >
        <Topbar />
        <main className="flex-1 flex flex-col relative w-full overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Notifications & Modals */}
      <Toast />
      <ConfirmDialog />
    </div>
  );
};

export default AppShell;
