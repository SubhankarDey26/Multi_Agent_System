import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AGENTS } from '../../mocks/mockData';
import AgentIcon from '../../components/common/AgentIcon';
import EmptyState from '../../components/common/EmptyState';

export const HistoryPage = () => {
  const {
    conversations,
    setCurrentConversationId,
    setActiveAgentId,
    requestConfirm,
    showToast,
  } = useAppStore();

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgentFilter, setSelectedAgentFilter] = useState('all');

  const filteredTasks = conversations.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAgent = selectedAgentFilter === 'all' || task.agentId === selectedAgentFilter;
    return matchesSearch && matchesAgent;
  });

  const handleOpenTask = (task) => {
    setCurrentConversationId(task.id);
    setActiveAgentId(task.agentId);
    const agent = AGENTS.find((a) => a.id === task.agentId) || AGENTS[0];
    navigate(agent.route);
  };

  const handleDeleteTask = (e, task) => {
    e.stopPropagation();
    requestConfirm({
      title: 'Delete Task',
      message: `Are you sure you want to delete "${task.title}"? This conversation history cannot be recovered.`,
      confirmText: 'Delete',
      onConfirm: () => {
        showToast(`Task "${task.title}" deleted`, 'info');
      },
    });
  };

  return (
    <div className="flex-1 flex flex-col w-full px-4 sm:px-6 py-6 max-w-5xl mx-auto min-h-[calc(100vh-4rem)] gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#232B3E]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8B7CFF]/15 text-[#8B7CFF] border border-[#8B7CFF]/30 flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#F1F5F9]">Task & Conversation History</h1>
            <p className="text-xs text-[#94A3B8]">Review, resume, or export previous specialist sessions</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#121620] border border-[#232B3E] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#8B7CFF]"
          />
        </div>
      </div>

      {/* Agent Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedAgentFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors border ${
            selectedAgentFilter === 'all'
              ? 'bg-[#8B7CFF]/15 text-[#8B7CFF] border-[#8B7CFF]/30'
              : 'bg-[#121620] text-[#94A3B8] border-[#232B3E] hover:text-[#F1F5F9]'
          }`}
        >
          All Agents ({conversations.length})
        </button>
        {AGENTS.map((agent) => {
          const count = conversations.filter((c) => c.agentId === agent.id).length;
          return (
            <button
              key={agent.id}
              onClick={() => setSelectedAgentFilter(agent.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors border ${
                selectedAgentFilter === agent.id
                  ? 'bg-[#181D2A] text-[#F1F5F9] border-[#56CFE1]/40'
                  : 'bg-[#121620] text-[#94A3B8] border-[#232B3E] hover:text-[#F1F5F9]'
              }`}
            >
              <AgentIcon agentId={agent.id} className="w-3.5 h-3.5" />
              <span>{agent.name}</span>
              <span className="text-[10px] text-[#94A3B8]/60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* List */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={History}
          title="No tasks match your criteria"
          description="Try clearing your search query or switching to another agent filter."
          actionText="Clear Filters"
          onAction={() => {
            setSearchTerm('');
            setSelectedAgentFilter('all');
          }}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filteredTasks.map((task) => {
            const agent = AGENTS.find((a) => a.id === task.agentId) || AGENTS[0];
            return (
              <div
                key={task.id}
                onClick={() => handleOpenTask(task)}
                className="group p-4 rounded-2xl bg-[#121620] border border-[#232B3E] hover:border-[#8B7CFF]/40 hover:bg-[#181D2A] transition-all cursor-pointer flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3.5 overflow-hidden">
                  <div
                    className="w-10 h-10 rounded-xl bg-[#181D2A] border border-[#232B3E] flex items-center justify-center shrink-0"
                    style={{ borderColor: agent.color + '40' }}
                  >
                    <AgentIcon agentId={agent.id} className="w-5 h-5" style={{ color: agent.color }} />
                  </div>
                  <div className="flex flex-col truncate">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-[#F1F5F9] truncate group-hover:text-[#8B7CFF] transition-colors">
                        {task.title}
                      </h3>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#181D2A] text-[#94A3B8] border border-[#232B3E]">
                        {agent.name}
                      </span>
                    </div>
                    <span className="text-xs text-[#94A3B8] mt-0.5">
                      Last updated {task.updatedAt} • {task.dateGroup}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => handleDeleteTask(e, task)}
                    className="p-2 rounded-lg text-[#94A3B8] hover:text-red-400 hover:bg-[#0E1118] transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="p-2 text-[#94A3B8] group-hover:text-[#8B7CFF] transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
