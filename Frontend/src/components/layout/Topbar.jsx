import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import ThemeToggle from '../common/ThemeToggle';

export const Topbar = () => {
  const { setMobileSidebarOpen, user, logoutUser, showToast, requestConfirm } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const isSettings = location.pathname.startsWith('/settings');

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserMenuOpen(false);
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
    <header className="sticky top-0 z-30 flex items-center justify-between px-3 sm:px-6 h-16 w-full bg-[#0B0D12]/90 backdrop-blur-md border-b border-[#232B3E]">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#181D2A] lg:hidden"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#181D2A] border border-[#8B7CFF]/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-[#8B7CFF]" />
          </div>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#F1F5F9]">
            <span>{isSettings ? 'Settings' : 'Workspace'}</span>
            <span className="text-[#94A3B8] hidden sm:inline">/</span>
            <span className="text-[#56CFE1] font-normal text-xs hidden sm:inline">
              {isSettings ? 'Account & Session' : 'Cortex AI'}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Theme Toggle & User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />

        {user ? (
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#181D2A] transition-colors border border-transparent hover:border-[#232B3E]"
              title="User Account"
            >
              <img
                src={
                  user.photoURL ||
                  user.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
                }
                alt={user.name || 'User'}
                className="w-7 h-7 rounded-full object-cover border border-[#232B3E]"
              />
              <span className="text-xs font-medium text-[#F1F5F9] hidden sm:inline">
                {user.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#121620] border border-[#232B3E] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-[#232B3E] mb-1">
                  <span className="text-xs font-semibold text-[#F1F5F9] block truncate">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] block truncate">
                    {user.email}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#181D2A] transition-colors text-left"
                >
                  <Settings className="w-3.5 h-3.5 text-[#8B7CFF]" />
                  <span>Settings & Profile</span>
                </button>

                <div className="my-1 border-t border-[#232B3E]"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="px-3.5 py-1.5 rounded-xl bg-[#8B7CFF] text-[#0B0D12] text-xs font-semibold hover:bg-[#7C6BF0] transition-colors"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default Topbar;