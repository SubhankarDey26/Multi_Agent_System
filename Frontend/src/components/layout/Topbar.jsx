import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  ChevronDown,
  History,
  Bell,
  Rocket,
  Check,
  Zap,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AGENTS } from '../../mocks/mockData';
import AgentIcon from '../common/AgentIcon';
import ThemeToggle from '../common/ThemeToggle';

const MODELS = [
  { id: 'omni', name: 'Cortex Omni 3.5', latency: '⚡ 142ms', desc: 'Fastest reasoning' },
  { id: 'claude', name: 'Claude 3.7 Sonnet', latency: '⚡ 280ms', desc: 'Advanced coding & synthesis' },
  { id: 'gpt4o', name: 'GPT-4o Multimodal', latency: '⚡ 220ms', desc: 'High context window' },
];

export const Topbar = () => {
  const { setMobileSidebarOpen, activeAgentId, user, showToast } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Find active agent from URL or store
  const matchedAgent = AGENTS.find((a) => location.pathname.startsWith(a.route)) || AGENTS[0];
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

  const handleSelectModel = (model) => {
    setSelectedModel(model);
    setModelDropdownOpen(false);
    showToast(`Switched active model to ${model.name}`, 'info');
  };

  const handleDeploy = () => {
    showToast(`Agent '${matchedAgent.name}' deployed to autonomous edge endpoint`, 'success');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 h-16 w-full bg-[#0B0D12]/90 backdrop-blur-md border-b border-[#232B3E]">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#181D2A] lg:hidden"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg bg-[#181D2A] border border-[#232B3E] flex items-center justify-center shrink-0"
            style={{ borderColor: matchedAgent.color + '40' }}
          >
            <AgentIcon agentId={matchedAgent.id} className="w-4 h-4" style={{ color: matchedAgent.color }} />
          </div>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#F1F5F9]">
            <span>{matchedAgent.name}</span>
            <span className="text-[#94A3B8] hidden sm:inline">/</span>
            <span className="text-[#56CFE1] font-normal text-xs hidden sm:inline">{matchedAgent.tagline}</span>
          </div>
        </div>

        <div className="h-4 w-px bg-[#232B3E] mx-1 hidden md:block"></div>

        {/* Model dropdown */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setModelDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#121620] border border-[#232B3E] hover:border-[#8B7CFF]/40 text-xs font-medium text-[#F1F5F9] transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B7CFF] animate-pulse"></span>
            <span>{selectedModel.name}</span>
            <span className="px-1 py-0.2 rounded text-[10px] font-mono bg-[#56CFE1]/10 text-[#56CFE1]">
              {selectedModel.latency}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
          </button>

          {modelDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 rounded-xl bg-[#121620] border border-[#232B3E] p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                Select Inference Model
              </div>
              {MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleSelectModel(model)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs text-left transition-colors ${
                    selectedModel.id === model.id
                      ? 'bg-[#181D2A] text-[#F1F5F9] font-medium'
                      : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#181D2A]/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span>{model.name}</span>
                      <span className="text-[10px] font-mono text-[#56CFE1]">{model.latency}</span>
                    </div>
                    <span className="text-[10px] text-[#94A3B8]">{model.desc}</span>
                  </div>
                  {selectedModel.id === model.id && <Check className="w-3.5 h-3.5 text-[#8B7CFF]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right tools */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <ThemeToggle />

        <button
          onClick={() => navigate('/history')}
          className="p-2 rounded-lg text-[#94A3B8] hover:text-[#56CFE1] hover:bg-[#181D2A] transition-colors"
          title="Task History"
        >
          <History className="w-4 h-4" />
        </button>

        <button
          onClick={() => showToast('No new notifications', 'info')}
          className="p-2 rounded-lg text-[#94A3B8] hover:text-[#56CFE1] hover:bg-[#181D2A] transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#56CFE1]"></span>
        </button>

        <button
          onClick={handleDeploy}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181D2A] hover:bg-[#232B3E] border border-[#232B3E] hover:border-[#56CFE1]/40 text-xs font-medium text-[#F1F5F9] transition-all shadow-sm active:scale-95 ml-1"
        >
          <Rocket className="w-3.5 h-3.5 text-[#56CFE1]" />
          <span>Deploy Agent</span>
        </button>

        {user && (
          <img
            src={user.photoURL}
            alt={user.name}
            className="w-7 h-7 rounded-full object-cover border border-[#232B3E] ml-1 cursor-pointer"
            onClick={() => navigate('/settings')}
            title="Account Settings"
          />
        )}
      </div>
    </header>
  );
};

export default Topbar;
