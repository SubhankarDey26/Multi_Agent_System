import React, { useState } from 'react';
import { Copy, Check, RotateCw, ExternalLink, Zap } from 'lucide-react';
import AgentIcon from '../common/AgentIcon';
import MarkdownRenderer from './MarkdownRenderer';
import { AGENTS } from '../../mocks/mockData';

export const ChatMessage = ({ message, onRegenerate }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const agent = AGENTS.find((a) => a.id === message.agentId) || AGENTS[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 max-w-3xl ml-auto w-full group">
        <div className="p-4 rounded-2xl rounded-tr-sm bg-[#181D2A] border border-[#232B3E] text-[#F1F5F9] shadow-sm">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          <div className="mt-2 flex items-center justify-end gap-2 text-[11px] text-[#94A3B8]">
            <span>{message.timestamp || 'Just now'}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 max-w-4xl mr-auto w-full group animate-in fade-in duration-200">
      {/* Agent Avatar */}
      <div
        className="w-8 h-8 rounded-xl bg-[#121620] border border-[#232B3E] flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(139,124,255,0.2)]"
        style={{ borderColor: agent.color + '40' }}
      >
        <AgentIcon agentId={agent.id} className="w-4 h-4" style={{ color: agent.color }} />
      </div>

      <div className="flex-1 p-4 sm:p-5 rounded-2xl rounded-tl-sm bg-[#121620] border border-[#232B3E] text-[#F1F5F9] shadow-md flex flex-col gap-3">
        {/* Header meta */}
        <div className="flex items-center justify-between border-b border-[#232B3E] pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#F1F5F9] tracking-wide">{agent.name}</span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono bg-[#181D2A] text-[#56CFE1] border border-[#232B3E]">
              <Zap className="w-3 h-3" />
              <span>{message.model || agent.model}</span>
              {message.latency && <span>• {message.latency}</span>}
            </span>
            {message.isStreaming && (
              <span className="inline-flex items-center gap-1 text-[11px] text-[#8B7CFF] animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B7CFF]"></span>
                Streaming...
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="p-1 rounded text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#181D2A] transition-colors"
              title="Copy message"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="p-1 rounded text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#181D2A] transition-colors"
                title="Regenerate response"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Markdown Content */}
        <MarkdownRenderer content={message.content} />

        {/* Citations if available */}
        {message.citations && message.citations.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-2 pt-3 border-t border-[#232B3E]">
            <span className="text-[11px] font-semibold text-[#94A3B8]">Citations & Sources:</span>
            {message.citations.map((cite, i) => (
              <a
                key={i}
                href={cite.url || '#'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-[#181D2A] border border-[#232B3E] text-[#56CFE1] hover:border-[#56CFE1]/60 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span>{cite.title}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
