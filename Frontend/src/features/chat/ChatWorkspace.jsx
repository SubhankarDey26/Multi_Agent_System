import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  User,
  Send,
  AlertCircle,
  Terminal,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const ChatWorkspace = () => {
  const {
    currentConversationId,
    messagesMap,
    addMessage,
    user,
  } = useAppStore();

  const messages = messagesMap[currentConversationId] || [];
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e?.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    // 1. Add user message
    const userMsg = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: trimmed,
      timestamp: 'Just now',
    };
    addMessage(currentConversationId, userMsg);
    setInputValue('');

    // 2. Add assistant message indicating backend service pending
    setTimeout(() => {
      const assistantMsg = {
        id: 'msg-assist-' + Date.now(),
        role: 'assistant',
        content:
          'Backend chat service is not yet implemented. Once you connect your LLM backend endpoint in the Gateway, live responses will stream directly here.',
        timestamp: 'Just now',
        isNotice: true,
      };
      addMessage(currentConversationId, assistantMsg);
    }, 400);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] relative bg-[#0B0D12] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#8B7CFF]/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Messages Canvas */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
        {messages.length === 0 ? (
          <div className="max-w-2xl mx-auto flex flex-col items-center justify-center text-center pt-16 pb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#181D2A] border border-[#232B3E] flex items-center justify-center text-[#8B7CFF] shadow-[0_0_24px_rgba(139,124,255,0.2)] mb-5">
              <Sparkles className="w-7 h-7" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F1F5F9] mb-2">
              Welcome, {user?.name || 'Operator'}
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md mb-8">
              Your autonomous AI workspace is ready. Authenticated session active.
            </p>

            <div className="p-4 rounded-xl bg-[#121620] border border-[#232B3E] max-w-md w-full text-left flex items-start gap-3">
              <Terminal className="w-4 h-4 text-[#56CFE1] shrink-0 mt-0.5" />
              <div className="text-xs text-[#94A3B8]">
                <span className="font-semibold text-[#F1F5F9] block mb-0.5">Backend Status</span>
                Auth Service and Session Gateway active. Ready for agent endpoint integration.
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs sm:text-sm ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role !== 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-[#181D2A] border border-[#8B7CFF]/30 flex items-center justify-center text-[#8B7CFF] shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#8B7CFF] text-[#0B0D12] font-medium rounded-tr-sm shadow-md'
                      : msg.isNotice
                      ? 'bg-[#121620] border border-[#56CFE1]/30 text-[#94A3B8] rounded-tl-sm'
                      : 'bg-[#181D2A] border border-[#232B3E] text-[#F1F5F9] rounded-tl-sm'
                  }`}
                >
                  {msg.isNotice && (
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#56CFE1] mb-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Agent Service Integration Pending</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <span
                    className={`text-[10px] block mt-1.5 ${
                      msg.role === 'user' ? 'text-black/60 text-right' : 'text-[#94A3B8]/60'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-[#8B7CFF]/20 border border-[#8B7CFF]/40 flex items-center justify-center text-[#8B7CFF] shrink-0 mt-0.5 overflow-hidden">
                    {user?.photoURL || user?.avatar ? (
                      <img
                        src={user.photoURL || user.avatar}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Composer */}
      <div className="p-4 sm:p-6 border-t border-[#232B3E] bg-[#0E1118]/80 backdrop-blur-md">
        <form
          onSubmit={handleSend}
          className="max-w-3xl mx-auto relative rounded-2xl bg-[#121620] border border-[#232B3E] focus-within:border-[#8B7CFF]/60 shadow-lg transition-all"
        >
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder="Send a prompt..."
            rows={2}
            className="w-full px-4 pt-3.5 pb-12 bg-transparent text-xs sm:text-sm text-[#F1F5F9] placeholder:text-[#94A3B8]/50 focus:outline-none resize-none"
          />

          <div className="absolute bottom-2.5 right-3 flex items-center gap-2">
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2 rounded-xl bg-[#8B7CFF] hover:bg-[#7C6BF0] text-[#0B0D12] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
              title="Send Prompt"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWorkspace;