import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const Sidebar = () => {
  const {
    isSidebarCollapsed,
    toggleSidebarCollapse,
    user,
    logoutUser,
    showToast,
    requestConfirm,
  } = useAppStore();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      showToast('Logged out successfully', 'success');
    } catch (err) {
      console.warn('Logout error:', err);
    } finally {
      navigate('/login', { replace: true });
    }
  };

  return (
    <aside
      className={`hidden lg:flex flex-col justify-between h-screen fixed top-0 left-0 bottom-0 z-40 bg-[#11141B] border-r border-[#232B3E] transition-all duration-300 ${
        isSidebarCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Top area */}
      <div className="flex flex-col gap-3 p-3.5 overflow-y-auto overflow-x-hidden flex-1">
        {/* Brand & collapse trigger */}
        <div className="flex items-center justify-between px-1 py-1">
          <div
            onClick={() => navigate('/agent/chat')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#181D2A] border border-[#232B3E] flex items-center justify-center text-[#8B7CFF] shadow-[0_0_12px_rgba(139,124,255,0.25)] relative overflow-hidden shrink-0 group-hover:border-[#8B7CFF]/50 transition-colors">
              <Sparkles className="w-4 h-4 text-[#8B7CFF]" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#8B7CFF]/20 to-[#56CFE1]/20 pointer-events-none"></div>
            </div>

            {!isSidebarCollapsed && (
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base tracking-tight text-[#F1F5F9]">Cortex AI</span>
                </div>
                <p className="text-[10px] text-[#94A3B8]">Autonomous Workspace</p>
              </div>
            )}
          </div>

          <button
            onClick={toggleSidebarCollapse}
            className="p-1 rounded-md text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#181D2A] transition-colors"
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-1 mt-3">
          <NavLink
            to="/agent/chat"
            className={({ isActive }) =>
              `flex items-center rounded-xl p-2.5 transition-all text-xs font-medium ${
                isSidebarCollapsed ? 'justify-center' : 'justify-start gap-2.5'
              } ${
                isActive
                  ? 'bg-[#181D2A] text-[#F1F5F9] border-l-2 border-[#8B7CFF] shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#181D2A]/60'
              }`
            }
            title="Workspace"
          >
            <MessageSquare className="w-4 h-4 text-[#8B7CFF]" />
            {!isSidebarCollapsed && <span>Workspace</span>}
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center rounded-xl p-2.5 transition-all text-xs font-medium ${
                isSidebarCollapsed ? 'justify-center' : 'justify-start gap-2.5'
              } ${
                isActive
                  ? 'bg-[#181D2A] text-[#F1F5F9] border-l-2 border-[#8B7CFF] shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#181D2A]/60'
              }`
            }
            title="Settings"
          >
            <Settings className="w-4 h-4 text-[#94A3B8]" />
            {!isSidebarCollapsed && <span>Settings</span>}
          </NavLink>
        </div>
      </div>

      {/* Bottom User Profile Card */}
      <div className="p-3 border-t border-[#232B3E] flex flex-col gap-1 bg-[#0E1118]">
        {user ? (
          <div
            className={`p-2 rounded-xl bg-[#181D2A] border border-[#232B3E] flex items-center ${
              isSidebarCollapsed ? 'justify-center' : 'justify-between'
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="relative shrink-0">
                <img
                  src={
                    user.photoURL ||
                    user.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
                  }
                  alt={user.name || 'User'}
                  className="w-7 h-7 rounded-full object-cover border border-[#232B3E]"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-[#11141B]"></span>
              </div>
              {!isSidebarCollapsed && (
                <div className="flex flex-col truncate">
                  <span className="text-xs font-medium text-[#F1F5F9] truncate">{user.name}</span>
                  <span className="text-[10px] text-[#94A3B8] truncate">{user.email}</span>
                </div>
              )}
            </div>

            {!isSidebarCollapsed && (
              <button
                onClick={handleLogout}
                className="p-1 rounded text-[#94A3B8] hover:text-red-400 hover:bg-[#121620] transition-colors"
                title="Sign out / Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <NavLink
            to="/login"
            className={`p-2 rounded-xl bg-[#181D2A] hover:bg-[#232B3E] border border-[#232B3E] hover:border-[#8B7CFF]/40 text-[#8B7CFF] flex items-center ${
              isSidebarCollapsed ? 'justify-center' : 'justify-center gap-2'
            } text-xs font-medium transition-colors`}
            title="Sign In"
          >
            <LogOut className="w-3.5 h-3.5 rotate-180" />
            {!isSidebarCollapsed && <span>Sign In</span>}
          </NavLink>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;