import React from 'react';
import {
  Settings,
  User,
  Moon,
  Sun,
  ShieldCheck,
  LogOut,
  Mail,
  Fingerprint,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const SettingsPage = () => {
  const { user, theme, toggleTheme, logoutUser, showToast, requestConfirm } = useAppStore();

  const handleLogout = () => {
    requestConfirm({
      title: 'Sign Out of Cortex AI',
      message: `Are you sure you want to end your active session as ${user?.name || 'Operator'}?`,
      confirmText: 'Sign Out',
      onConfirm: async () => {
        try {
          await logoutUser();
          showToast('Signed out successfully', 'success');
        } catch (err) {
          showToast('Error during sign out', 'error');
        }
      },
    });
  };

  return (
    <div className="flex-1 flex flex-col w-full px-4 sm:px-6 py-6 max-w-3xl mx-auto min-h-[calc(100vh-4rem)] gap-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#232B3E]">
        <div className="w-10 h-10 rounded-xl bg-[#8B7CFF]/15 text-[#8B7CFF] border border-[#8B7CFF]/30 flex items-center justify-center">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-bold text-[#F1F5F9]">Settings & Account</h1>
          <p className="text-xs text-[#94A3B8]">Authenticated session information and display preferences</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Section 1: User Profile (from backend /api/me) */}
        <div className="p-6 rounded-2xl bg-[#121620] border border-[#232B3E] shadow-xl flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#232B3E]">
            <User className="w-4 h-4 text-[#8B7CFF]" />
            <h2 className="text-sm font-semibold text-[#F1F5F9]">Account Profile</h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative">
              <img
                src={
                  user?.photoURL ||
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
                }
                alt={user?.name || 'User Profile'}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#8B7CFF]/40 shadow-lg"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#121620]"></span>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-[#94A3B8] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#8B7CFF]" />
                  Name
                </span>
                <span className="text-xs font-semibold text-[#F1F5F9] px-3 py-2 rounded-xl bg-[#0E1118] border border-[#232B3E]">
                  {user?.name || 'Not provided'}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-[#94A3B8] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#56CFE1]" />
                  Email
                </span>
                <span className="text-xs font-semibold text-[#F1F5F9] px-3 py-2 rounded-xl bg-[#0E1118] border border-[#232B3E] truncate">
                  {user?.email || 'Not provided'}
                </span>
              </div>

              {(user?.id || user?.uid) && (
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <span className="text-[11px] text-[#94A3B8] flex items-center gap-1.5">
                    <Fingerprint className="w-3.5 h-3.5 text-violet-400" />
                    User ID
                  </span>
                  <span className="text-xs font-mono text-[#94A3B8] px-3 py-2 rounded-xl bg-[#0E1118] border border-[#232B3E] truncate">
                    {user?.id || user?.uid}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Appearance & Theme */}
        <div className="p-6 rounded-2xl bg-[#121620] border border-[#232B3E] shadow-xl flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#232B3E]">
            <Moon className="w-4 h-4 text-[#56CFE1]" />
            <h2 className="text-sm font-semibold text-[#F1F5F9]">Appearance</h2>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-[#F1F5F9] block">Color Theme</span>
              <span className="text-[#94A3B8]">Toggle dark obsidian or light mode</span>
            </div>

            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#181D2A] border border-[#232B3E] text-xs text-[#F1F5F9] hover:border-[#8B7CFF]/50 transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <Moon className="w-4 h-4 text-[#8B7CFF]" />
                  <span>Dark Obsidian</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Light Studio</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Section 3: Active Session (Backed by Backend Redis 7-Day Session) */}
        <div className="p-6 rounded-2xl bg-[#121620] border border-[#232B3E] shadow-xl flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#232B3E]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-[#F1F5F9]">Session & Authentication</h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#F1F5F9]">Active Session</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Verified
                </span>
              </div>
              <span className="text-[#94A3B8] text-[11px] block mt-0.5">
                Session verified through Backend Gateway & Redis (7-Day TTL)
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold transition-colors shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;