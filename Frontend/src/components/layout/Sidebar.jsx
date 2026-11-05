import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Plus,
  Folder,
  Coins,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  Command,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AGENTS } from '../../mocks/mockData';
import AgentIcon from '../common/AgentIcon';

export const Sidebar = () => {
  const {
    isSidebarCollapsed,
    toggleSidebarCollapse,
    activeAgentId,
    setActiveAgentId,
    conversations,
    currentConversationId,
    setCurrentConversationId,
    createNewTask,
    user,
    logoutUser,
  } = useAppStore();

  const navigate = useNavigate();
  const location = useLocation();

  const handleAgentClick = (agent) => {
    setActiveAgentId(agent.id);
    navigate(agent.route);
  };

  const handleNewTask = () => {
    const task = createNewTask(activeAgentId);
    const agent = AGENTS.find((a) => a.id === task.agentId) || AGENTS[0];
    navigate(agent.route);
  };

  const handleTaskClick = (task) => {
    setCurrentConversationId(task.id);
    setActiveAgentId(task.agentId);
    const agent = AGENTS.find((a) => a.id === task.agentId) || AGENTS[0];
    navigate(agent.route);
  };

  // Group conversations
  const todayTasks = conversations.filter((c) => c.dateGroup === 'Today');
  const yesterdayTasks = conversations.filter((c) => c.dateGroup === 'Yesterday');

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
            {/* Neural Logo Mark */}
            <div className="w-8 h-8 rounded-lg bg-[#181D2A] border border-[#232B3E] flex items-center justify-center text-[#8B7CFF] shadow-[0_0_12px_rgba(139,124,255,0.25)] relative overflow-hidden shrink-0 group-hover:border-[#8B7CFF]/50 transition-colors">
              <Sparkles className="w-4 h-4 text-[#8B7CFF]" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#8B7CFF]/20 to-[#56CFE1]/20 pointer-events-none"></div>
            </div>

            {!isSidebarCollapsed && (
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base tracking-tight text-[#F1F5F9]">Cortex AI</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[#56CFE1]/10 text-[#56CFE1] border border-[#56CFE1]/25">
                    v2.4
                  </span>
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

        {/* New Task Button */}
        <button
          onClick={handleNewTask}
          className={`h-10 rounded-xl bg-[#8B7CFF] hover:bg-[#7C6BF0] text-[#0B0D12] font-semibold text-xs flex items-center transition-all duration-150 active:scale-[0.98] shadow-[0_0_16px_-2px_rgba(139,124,255,0.3)] ${
            isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'
          }`}
          title="Create New Task (⌘K)"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 stroke-[2.5]" />
            {!isSidebarCollapsed && <span>New Task</span>}
          </div>
          {!isSidebarCollapsed && (
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-black/15 text-black/80 font-medium">
              ⌘K
            </kbd>
          )}
        </button>

        {/* Specialist Agents section */}
        <div className="flex flex-col gap-1 mt-2">
          {!isSidebarCollapsed && (
            <div className="px-2 py-1 flex items-center justify-between">
              <span className="text-[10px] font-semibold tracking-wider text-[#94A3B8] uppercase">
                Specialist Agents
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#56CFE1] animate-pulse"></span>
            </div>
          )}

          {AGENTS.map((agent) => {
            const isActive = location.pathname.startsWith(agent.route);
            return (
              <button
                key={agent.id}
                onClick={() => handleAgentClick(agent)}
                className={`flex items-center rounded-xl p-2.5 transition-all text-xs font-medium group ${
                  isSidebarCollapsed ? 'justify-center' : 'justify-between'
                } ${
                  isActive
                    ? 'bg-[#181D2A] text-[#F1F5F9] border-l-2 border-[#8B7CFF] shadow-sm'
                    : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#181D2A]/60'
                }`}
                title={agent.name}
              >
                <div className="flex items-center gap-2.5">
                  <AgentIcon
                    agentId={agent.id}
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#8B7CFF]' : 'group-hover:text-[#56CFE1]'
                    }`}
                  />
                  {!isSidebarCollapsed && <span>{agent.name}</span>}
                </div>

                {!isSidebarCollapsed && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                      isActive
                        ? 'bg-[#56CFE1]/10 text-[#56CFE1] border border-[#56CFE1]/20'
                        : 'text-[#94A3B8]/60'
                    }`}
                  >
                    {agent.status}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Recent Tasks */}
        {!isSidebarCollapsed && (
          <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-[#232B3E]">
            <div className="px-2 py-1 flex items-center justify-between">
              <span className="text-[10px] font-semibold tracking-wider text-[#94A3B8] uppercase">
                Recent Tasks
              </span>
              <NavLink to="/history" className="text-[10px] text-[#8B7CFF] hover:underline">
                View all
              </NavLink>
            </div>

            {todayTasks.length > 0 && (
              <>
                <span className="px-2 text-[10px] font-semibold uppercase text-[#8B7CFF]/70 tracking-wider mt-1">
                  Today
                </span>
                {todayTasks.slice(0, 3).map((task) => (
                  <button
                    key={task.id}
                    onClick={() => handleTaskClick(task)}
                    className={`text-left px-2.5 py-1.5 rounded-lg text-xs truncate transition-colors ${
                      currentConversationId === task.id
                        ? 'bg-[#181D2A] text-[#F1F5F9] font-medium'
                        : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#181D2A]/60'
                    }`}
                  >
                    {task.title}
                  </button>
                ))}
              </>
            )}

            {yesterdayTasks.length > 0 && (
              <>
                <span className="px-2 text-[10px] font-semibold uppercase text-[#8B7CFF]/70 tracking-wider mt-2">
                  Yesterday
                </span>
                {yesterdayTasks.slice(0, 2).map((task) => (
                  <button
                    key={task.id}
                    onClick={() => handleTaskClick(task)}
                    className={`text-left px-2.5 py-1.5 rounded-lg text-xs truncate transition-colors ${
                      currentConversationId === task.id
                        ? 'bg-[#181D2A] text-[#F1F5F9] font-medium'
                        : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#181D2A]/60'
                    }`}
                  >
                    {task.title}
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom utilities & user profile */}
      <div className="p-3 border-t border-[#232B3E] flex flex-col gap-1 bg-[#0E1118]">
        {/* Navigation links */}
        <NavLink
          to="/files"
          className={({ isActive }) =>
            `flex items-center rounded-xl p-2 text-xs transition-colors ${
              isSidebarCollapsed ? 'justify-center' : 'justify-between'
            } ${
              isActive
                ? 'bg-[#181D2A] text-[#F1F5F9]'
                : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#181D2A]/60'
            }`
          }
          title="Files"
        >
          <div className="flex items-center gap-2.5">
            <Folder className="w-4 h-4 text-[#94A3B8]" />
            {!isSidebarCollapsed && <span>Files</span>}
          </div>
          {!isSidebarCollapsed && <span className="text-[10px] text-[#94A3B8]">1.4 GB</span>}
        </NavLink>

        <NavLink
          to="/usage"
          className={({ isActive }) =>
            `flex items-center rounded-xl p-2 text-xs transition-colors ${
              isSidebarCollapsed ? 'justify-center' : 'justify-between'
            } ${
              isActive
                ? 'bg-[#181D2A] text-[#F1F5F9]'
                : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#181D2A]/60'
            }`
          }
          title="Usage & Credits"
        >
          <div className="flex items-center gap-2.5">
            <Coins className="w-4 h-4 text-[#94A3B8]" />
            {!isSidebarCollapsed && <span>Usage & Credits</span>}
          </div>
          {!isSidebarCollapsed && (
            <span className="text-[10px] font-mono text-[#56CFE1]">84.2k/100k</span>
          )}
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center rounded-xl p-2 text-xs transition-colors ${
              isSidebarCollapsed ? 'justify-center' : 'justify-start'
            } ${
              isActive
                ? 'bg-[#181D2A] text-[#F1F5F9]'
                : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#181D2A]/60'
            }`
          }
          title="Settings"
        >
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4 text-[#94A3B8]" />
            {!isSidebarCollapsed && <span>Settings</span>}
          </div>
        </NavLink>

        {/* User Profile Card */}
        {user && (
          <div
            className={`mt-1.5 p-2 rounded-xl bg-[#181D2A] border border-[#232B3E] flex items-center ${
              isSidebarCollapsed ? 'justify-center' : 'justify-between'
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="relative shrink-0">
                <img
                  src={user.photoURL}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-[#232B3E]"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-[#11141B]"></span>
              </div>
              {!isSidebarCollapsed && (
                <div className="flex flex-col truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-[#F1F5F9] truncate">{user.name}</span>
                    <span className="px-1 py-0.2 rounded text-[9px] font-semibold bg-[#8B7CFF]/15 text-[#8B7CFF]">
                      Pro
                    </span>
                  </div>
                  <span className="text-[10px] text-[#94A3B8] truncate">{user.email}</span>
                </div>
              )}
            </div>

            {!isSidebarCollapsed && (
              <button
                onClick={logoutUser}
                className="p-1 rounded text-[#94A3B8] hover:text-red-400 hover:bg-[#121620] transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
