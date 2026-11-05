import React, { useState } from 'react';
import {
  Settings,
  User,
  Moon,
  Sun,
  Laptop,
  Sliders,
  Database,
  Key,
  Shield,
  Trash2,
  Check,
  Save,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AGENTS } from '../../mocks/mockData';

export const SettingsPage = () => {
  const { user, theme, toggleTheme, showToast, logoutUser } = useAppStore();

  const [name, setName] = useState(user?.name || 'Alex Vance');
  const [email, setEmail] = useState(user?.email || 'alex.vance@cortex.ai');
  const [defaultAgent, setDefaultAgent] = useState('chat');
  const [responseStyle, setResponseStyle] = useState('Detailed');
  const [streamSpeed, setStreamSpeed] = useState('Fast');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    showToast('Preferences updated successfully', 'success');
  };

  const handleClearCache = () => {
    localStorage.removeItem('cortex_token');
    showToast('Local application cache cleared', 'info');
  };

  return (
    <div className="flex-1 flex flex-col w-full px-4 sm:px-6 py-6 max-w-4xl mx-auto min-h-[calc(100vh-4rem)] gap-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#232B3E]">
        <div className="w-10 h-10 rounded-xl bg-[#8B7CFF]/15 text-[#8B7CFF] border border-[#8B7CFF]/30 flex items-center justify-center">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-bold text-[#F1F5F9]">Workspace Settings & Preferences</h1>
          <p className="text-xs text-[#94A3B8]">Manage profile details, theme tokens, and agent default runtimes</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Section 1: Profile */}
        <div className="p-6 rounded-2xl bg-[#121620] border border-[#232B3E] shadow-xl flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#232B3E]">
            <User className="w-4 h-4 text-[#8B7CFF]" />
            <h2 className="text-sm font-semibold text-[#F1F5F9]">Operator Profile</h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative">
              <img
                src={user?.photoURL}
                alt="Profile"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#8B7CFF]/40 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-[#8B7CFF] text-black font-bold">
                PRO
              </span>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#94A3B8]">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#0E1118] border border-[#232B3E] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#8B7CFF]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#94A3B8]">Email Address</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="px-3 py-2 rounded-xl bg-[#0E1118]/60 border border-[#232B3E] text-xs text-[#94A3B8] cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Appearance & Theme */}
        <div className="p-6 rounded-2xl bg-[#121620] border border-[#232B3E] shadow-xl flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#232B3E]">
            <Moon className="w-4 h-4 text-[#56CFE1]" />
            <h2 className="text-sm font-semibold text-[#F1F5F9]">Appearance & Atmosphere</h2>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-[#F1F5F9] block">Color Theme Mode</span>
              <span className="text-[#94A3B8]">Toggle between dark luxury workspace and high-contrast light mode</span>
            </div>

            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#181D2A] border border-[#232B3E] text-xs text-[#F1F5F9] hover:border-[#8B7CFF]/50 transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <Moon className="w-4 h-4 text-[#8B7CFF]" />
                  <span>Dark Obsidian Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Light Studio Mode</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Section 3: Agent Preferences */}
        <div className="p-6 rounded-2xl bg-[#121620] border border-[#232B3E] shadow-xl flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#232B3E]">
            <Sliders className="w-4 h-4 text-[#10B981]" />
            <h2 className="text-sm font-semibold text-[#F1F5F9]">Agent Inference Preferences</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="text-[#94A3B8]">Default Launch Agent</label>
              <select
                value={defaultAgent}
                onChange={(e) => setDefaultAgent(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#0E1118] border border-[#232B3E] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#8B7CFF]"
              >
                {AGENTS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[#94A3B8]">Response Reasoning Depth</label>
              <select
                value={responseStyle}
                onChange={(e) => setResponseStyle(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#0E1118] border border-[#232B3E] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#8B7CFF]"
              >
                <option value="Concise">Concise & Telemetry-First</option>
                <option value="Balanced">Balanced (Code + Summary)</option>
                <option value="Detailed">Detailed Deep Architecture</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Backend & Connected Services */}
        <div className="p-6 rounded-2xl bg-[#121620] border border-[#232B3E] shadow-xl flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#232B3E]">
            <Database className="w-4 h-4 text-[#F59E0B]" />
            <h2 className="text-sm font-semibold text-[#F1F5F9]">Connected Infrastructure & Services</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[#0E1118] border border-[#232B3E] flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#F1F5F9] block">Firebase Authentication</span>
                <span className="text-[#94A3B8] font-mono text-[11px]">cortexai-105fb.firebaseapp.com</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Connected
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#0E1118] border border-[#232B3E] flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#F1F5F9] block">API Gateway Endpoint</span>
                <span className="text-[#94A3B8] font-mono text-[11px]">http://localhost:8000</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#56CFE1]/10 text-[#56CFE1] border border-[#56CFE1]/20">
                Configured
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#0E1118] border border-[#232B3E] flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#F1F5F9] block">Vector Engine & Redis Cache</span>
                <span className="text-[#94A3B8] font-mono text-[11px]">Qdrant Vector DB & Redis Cluster</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#8B7CFF]/10 text-[#8B7CFF] border border-[#8B7CFF]/20">
                Awaiting Backend Link
              </span>
            </div>
          </div>
        </div>

        {/* Section 5: Session & Danger Zone */}
        <div className="p-6 rounded-2xl bg-[#121620] border border-red-500/20 shadow-xl flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-red-400">Session Management</h2>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-semibold text-[#F1F5F9] block">Clear Local Context</span>
              <span className="text-[#94A3B8]">Wipes transient local storage tokens and reset cached parameters</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleClearCache}
                className="px-3.5 py-2 rounded-xl bg-[#181D2A] hover:bg-[#232B3E] text-[#94A3B8] hover:text-[#F1F5F9] border border-[#232B3E] transition-colors"
              >
                Reset Cache
              </button>
              <button
                onClick={logoutUser}
                className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors font-semibold"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveProfile}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B7CFF] hover:bg-[#7C6BF0] text-black font-semibold text-xs shadow-[0_0_15px_rgba(139,124,255,0.3)] transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
