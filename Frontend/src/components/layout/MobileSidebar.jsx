import React, { useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  X,
  Plus,
  Folder,
  Coins,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AGENTS } from '../../mocks/mockData';
import AgentIcon from '../common/AgentIcon';

export const MobileSidebar = () => {
  const {
    mobileSidebarOpen,
    setMobileSidebarOpen,
    activeAgentId,
    setActiveAgentId,
    conversations,
    currentConversationId,
    setCurrentConversationId,
    createNewTask,
    user,
    logoutUser,
    showToast,
    requestConfirm,
  } = useAppStore();

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setMobileSidebarOpen(false);
    requestConfirm({
      title: 'Sign Out of Cortex AI',
      message: `Are you sure you want to end your mobile session as ${user?.name || 'Operator'}?`,
      confirmText: 'Sign Out',
      onConfirm: async () => {
        try {
          await logoutUser();
          showToast('Logged out successfully', 'success');
          navigate('/login');
        } catch (err) {
          showToast('Error signing out', 'error');
        }
      },
    });
  };

  // Close drawer on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname, setMobileSidebarOpen]);

  if (!mobileSidebarOpen) return null;

  const handleAgentClick = (agent) => {
    setActiveAgentId(agent.id);
    navigate(agent.route);
    setMobileSidebarOpen(false);
  };

  const handleNewTask = () => {
    const task = createNewTask(activeAgentId);
    const agent = AGENTS.find((a) => a.id === task.agentId) || AGENTS[0];
    navigate(agent.route);
    setMobileSidebarOpen(false);
  };

  const handleTaskClick = (task) => {
    setCurrentConversationId(task.id);
    setActiveAgentId(task.agentId);
    const agent = AGENTS.find((a) => a.id === task.agentId) || AGENTS[0];
    navigate(agent.route);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => setMobileSidebarOpen(false)}
      ></div>

      {/* Drawer */}
      <div className="relative w-80 max-w-[85vw] bg-[#11141B] border-r border-[#232B3E] h-full flex flex-col justify-between p-4 shadow-2xl z-10 animate-in slide-in-from-left duration-200 overflow-y-auto">
        <div className="flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#232B3E]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#181D2A] border border-[#232B3E] flex items-center justify-center text-[#8B7CFF] shadow-[0_0_12px_rgba(139,124,255,0.25)]">
                <Sparkles className="w-4 h-4 text-[#8B7CFF]" />
              </div>
              <div>
                <span className="font-bold text-base text-[#F1F5F9]">Cortex AI</span>
                <p className="text-[10px] text-[#94A3B8]">Autonomous Workspace</p>
              </div>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#181D2A]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Task */}
          <button
            onClick={handleNewTask}
            className="w-full h-10 px-4 rounded-xl bg-[#8B7CFF] hover:bg-[#7C6BF0] text-[#0B0D12] font-semibold text-xs flex items-center justify-between shadow-[0_0_16px_-2px_rgba(139,124,255,0.3)]"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </div>
            <span className="text-[10px] bg-black/15 px-1.5 py-0.5 rounded font-mono">⌘K</span>
          </button>

          {/* Agents */}
          <div className="flex flex-col gap-1 mt-2">
            <span className="text-[10px] font-semibold tracking-wider text-[#94A3B8] uppercase px-2 py-1">
              Specialist Agents
            </span>
            {AGENTS.map((agent) => {
              const isActive = location.pathname.startsWith(agent.route);
              return (
                <button
                  key={agent.id}
                  onClick={() => handleAgentClick(agent)}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#181D2A] text-[#F1F5F9] border-l-2 border-[#8B7CFF]'
                      : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#181D2A]/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <AgentIcon
                      agentId={agent.id}
                      className={`w-4 h-4 ${isActive ? 'text-[#8B7CFF]' : ''}`}
                    />
                    <span>{agent.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#56CFE1]">{agent.status}</span>
                </button>
              );
            })}
          </div>

          {/* Recent tasks */}
          <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-[#232B3E]">
            <span className="text-[10px] font-semibold tracking-wider text-[#94A3B8] uppercase px-2 py-1">
              Recent Tasks
            </span>
            {conversations.slice(0, 4).map((task) => (
              <button
                key={task.id}
                onClick={() => handleTaskClick(task)}
                className={`text-left px-2.5 py-1.5 rounded-lg text-xs truncate transition-colors ${
                  currentConversationId === task.id
                    ? 'bg-[#181D2A] text-[#F1F5F9] font-medium'
                    : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                {task.title}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-3 border-t border-[#232B3E] flex flex-col gap-1">
          <NavLink
            to="/files"
            className="flex items-center justify-between p-2 rounded-xl text-xs text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#181D2A]"
          >
            <div className="flex items-center gap-2.5">
              <Folder className="w-4 h-4" />
              <span>Files</span>
            </div>
            <span className="text-[10px]">1.4 GB</span>
          </NavLink>
          <NavLink
            to="/usage"
            className="flex items-center justify-between p-2 rounded-xl text-xs text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#181D2A]"
          >
            <div className="flex items-center gap-2.5">
              <Coins className="w-4 h-4" />
              <span>Usage & Credits</span>
            </div>
            <span className="text-[10px] font-mono text-[#56CFE1]">84.2k/100k</span>
          </NavLink>
          <NavLink
            to="/settings"
            className="flex items-center gap-2.5 p-2 rounded-xl text-xs text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#181D2A]"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </NavLink>

          {user && (
            <div className="mt-2 p-2 rounded-xl bg-[#181D2A] border border-[#232B3E] flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <img src={user.photoURL} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                <div className="flex flex-col truncate">
                  <span className="text-xs font-medium text-[#F1F5F9] truncate">{user.name}</span>
                  <span className="text-[10px] text-[#94A3B8] truncate">{user.email}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Sign out / Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
