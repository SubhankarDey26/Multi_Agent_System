import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Settings,
  X,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const MobileSidebar = () => {
  const {
    mobileSidebarOpen,
    setMobileSidebarOpen,
    user,
    logoutUser,
    showToast,
    requestConfirm,
  } = useAppStore();

  const navigate = useNavigate();

  if (!mobileSidebarOpen) return null;

  const handleLogout = async () => {
    setMobileSidebarOpen(false);
    try {
      await logoutUser();
      showToast('Logged out successfully', 'success');
    } catch (err) {
      console.warn('Logout error:', err);
    } finally {
      navigate('/login', { replace: true });
    }
  };

  const handleNav = (path) => {
    navigate(path);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setMobileSidebarOpen(false)}
      ></div>

      {/* Drawer */}
      <div className="relative w-72 max-w-[80vw] h-full bg-[#11141B] border-r border-[#232B3E] flex flex-col justify-between p-4 z-10 shadow-2xl">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#232B3E]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#181D2A] border border-[#232B3E] flex items-center justify-center text-[#8B7CFF]">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-[#F1F5F9]">Cortex AI</span>
            </div>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#181D2A]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-1">
            <button
              onClick={() => handleNav('/agent/chat')}
              className="flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium text-[#F1F5F9] hover:bg-[#181D2A] transition-colors text-left"
            >
              <MessageSquare className="w-4 h-4 text-[#8B7CFF]" />
              <span>Workspace</span>
            </button>

            <button
              onClick={() => handleNav('/settings')}
              className="flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#181D2A] transition-colors text-left"
            >
              <Settings className="w-4 h-4 text-[#94A3B8]" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Footer User Profile */}
        <div className="pt-3 border-t border-[#232B3E]">
          {user ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#181D2A] border border-[#232B3E]">
              <div className="flex items-center gap-2 overflow-hidden">
                <img
                  src={
                    user.photoURL ||
                    user.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
                  }
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-[#232B3E]"
                />
                <div className="flex flex-col truncate">
                  <span className="text-xs font-medium text-[#F1F5F9] truncate">{user.name}</span>
                  <span className="text-[10px] text-[#94A3B8] truncate">{user.email}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-red-400 hover:bg-[#121620]"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNav('/login')}
              className="w-full py-2.5 rounded-xl bg-[#8B7CFF] text-[#0B0D12] font-semibold text-xs text-center"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;