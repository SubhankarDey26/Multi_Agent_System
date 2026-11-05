import React, { useState, useRef, useEffect } from 'react';
import {
  FileSpreadsheet,
  FileCode,
  Radar,
  Network,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import ChatMessage from '../../components/chat/ChatMessage';
import MessageComposer from '../../components/chat/MessageComposer';
import PromptSuggestionCard from '../../components/chat/PromptSuggestionCard';
import chatService from '../../services/chatService';

const SUGGESTIONS = [
  {
    icon: FileSpreadsheet,
    title: 'Analyze Quarterly Financials',
    description: 'Upload P&L statements & generate variance summaries',
    prompt: 'Analyze our quarterly financial statements and generate variance summaries for Q3 vs Q2.',
    accent: 'violet',
  },
  {
    icon: FileCode,
    title: 'Draft Product Requirements',
    description: 'Auto-structure PRD with user stories & API contracts',
    prompt: 'Draft a comprehensive Product Requirements Document (PRD) for a multi-agent AI workspace with user stories and endpoint schemas.',
    accent: 'cyan',
  },
  {
    icon: Radar,
    title: 'Deep Competitive Intelligence',
    description: 'Synthesize top 5 rivals across pricing, features & sentiment',
    prompt: 'Synthesize competitive intelligence on top 5 developer AI workspace tools comparing pricing, latency, and agent orchestration.',
    accent: 'violet',
  },
  {
    icon: Network,
    title: 'Architect Distributed System',
    description: 'Generate system diagrams, schema, and latency models',
    prompt: 'Architect a low-latency event-driven distributed system for telemetry streaming with Redis Cluster and Shared Workers.',
    accent: 'cyan',
  },
];

export const ChatWorkspace = () => {
  const {
    currentConversationId,
    messagesMap,
    addMessage,
    updateStreamingMessage,
    finalizeStreamingMessage,
    user,
    showToast,
  } = useAppStore();

  const messages = messagesMap[currentConversationId] || [];
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const handleSend = async ({ content, webSearch, files }) => {
    // 1. Add user message
    const userMsg = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content,
      timestamp: 'Just now',
      files,
    };
    addMessage(currentConversationId, userMsg);

    // 2. Add placeholder assistant message
    const assistantMsgId = 'msg-assist-' + Date.now();
    const placeholderAssistantMsg = {
      id: assistantMsgId,
      role: 'assistant',
      agentId: 'chat',
      content: '',
      isStreaming: true,
      timestamp: 'Just now',
      model: 'Cortex Omni 3.5',
    };
    addMessage(currentConversationId, placeholderAssistantMsg);
    setIsGenerating(true);

    try {
      await chatService.streamResponse(
        content,
        'chat',
        (chunk) => {
          updateStreamingMessage(currentConversationId, assistantMsgId, chunk);
        },
        (finalText) => {
          finalizeStreamingMessage(currentConversationId, assistantMsgId, {
            content: finalText,
            latency: '1.2s',
            citations: webSearch
              ? [
                  { title: 'Live Web Index Synthesis', url: 'https://cortex.ai/sources/live' },
                  { title: 'Grounding Verification Vector', url: 'https://cortex.ai/sources/verified' },
                ]
              : undefined,
          });
          setIsGenerating(false);
        }
      );
    } catch (err) {
      finalizeStreamingMessage(currentConversationId, assistantMsgId, {
        content: 'An error occurred while generating response: ' + (err.message || 'Unknown error'),
      });
      setIsGenerating(false);
      showToast('Error during generation', 'error');
    }
  };

  const handleStop = () => {
    setIsGenerating(false);
    showToast('Generation cancelled', 'info');
  };

  return (
    <div className="flex-1 flex flex-col justify-between max-w-5xl mx-auto w-full px-4 sm:px-6 pt-6 pb-6 relative min-h-[calc(100vh-4rem)]">
      {/* Scrollable messages and greeting */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pb-32">
        {messages.length === 0 ? (
          <div className="flex flex-col gap-6 pt-6 animate-in fade-in duration-300">
            {/* Hero Greeting */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#8B7CFF]/10 text-[#8B7CFF] border border-[#8B7CFF]/25 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8B7CFF]"></span>
                  Multi-Agent Neural Fabric Active
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#F1F5F9] via-[#8B7CFF] to-[#56CFE1]">
                What would you like to work on, {user?.name?.split(' ')[0] || 'Operator'}?
              </h1>
              <p className="text-sm text-[#94A3B8] max-w-2xl">
                Chat Agent is orchestrated with live web search, code sandbox, and multi-file reasoning capabilities.
              </p>
            </div>

            {/* 4 Bento Suggestion Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {SUGGESTIONS.map((card, idx) => (
                <PromptSuggestionCard
                  key={idx}
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                  accent={card.accent}
                  onClick={() => handleSend({ content: card.prompt, webSearch: false, files: [] })}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onRegenerate={() => handleSend({ content: 'Regenerate response with deeper technical depth' })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Anchored Bottom Composer */}
      <div className="sticky bottom-0 left-0 right-0 pt-2 pb-1 bg-gradient-to-t from-[#0B0D12] via-[#0B0D12]/90 to-transparent">
        <MessageComposer
          onSend={handleSend}
          isGenerating={isGenerating}
          onStop={handleStop}
          activeAgentId="chat"
        />
      </div>
    </div>
  );
};

export default ChatWorkspace;
