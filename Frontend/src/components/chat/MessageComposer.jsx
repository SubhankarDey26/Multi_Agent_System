import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowUp,
  Paperclip,
  Code,
  Globe,
  Square,
  Sparkles,
  X,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import fileService from '../../services/fileService';

export const MessageComposer = ({
  onSend,
  isGenerating = false,
  onStop,
  placeholder = 'Ask Cortex or type / to invoke agent tools...',
  activeAgentId = 'chat',
}) => {
  const [text, setText] = useState('');
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const { showToast } = useAppStore();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 180) + 'px';
    }
  }, [text]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if ((!text.trim() && attachedFiles.length === 0) || isGenerating) return;
    onSend({
      content: text.trim(),
      webSearch: webSearchEnabled,
      files: attachedFiles,
    });
    setText('');
    setAttachedFiles([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const added = files.map((f) => fileService.addFile(f));
    setAttachedFiles((prev) => [...prev, ...added]);
    showToast(`Attached ${files.length} file(s)`, 'info');
    e.target.value = '';
  };

  const removeFile = (id) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const insertCodeTemplate = () => {
    setText((prev) => prev + '\n```javascript\n// Paste code here\n```\n');
    textareaRef.current?.focus();
  };

  return (
    <div className="w-full">
      <div className="rounded-2xl bg-[#121620]/95 backdrop-blur-xl border border-[#232B3E] shadow-[0_12px_40px_-6px_rgba(0,0,0,0.8),0_0_24px_-4px_rgba(139,124,255,0.1)] focus-within:border-[#8B7CFF]/80 focus-within:shadow-[0_12px_40px_-6px_rgba(0,0,0,0.9),0_0_28px_0_rgba(139,124,255,0.2)] transition-all duration-200 p-3 sm:p-4 flex flex-col gap-2.5">
        {/* Attached files pills */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-1">
            {attachedFiles.map((file) => (
              <span
                key={file.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-[#181D2A] border border-[#232B3E] text-[#56CFE1]"
              >
                <Paperclip className="w-3 h-3" />
                <span className="max-w-[150px] truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="hover:text-red-400 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="w-full bg-transparent border-0 resize-none text-sm text-[#F1F5F9] placeholder:text-[#94A3B8]/60 focus:ring-0 focus:outline-none p-0 leading-relaxed max-h-44"
        />

        {/* Toolbar */}
        <div className="flex items-center justify-between pt-2 border-t border-[#232B3E]/60 gap-2">
          {/* Left tools */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#181D2A] transition-colors"
              title="Attach File"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={insertCodeTemplate}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#181D2A] transition-colors"
              title="Insert Code Snippet"
            >
              <Code className="w-4 h-4" />
            </button>

            {/* Web search toggle */}
            <button
              type="button"
              onClick={() => setWebSearchEnabled((prev) => !prev)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                webSearchEnabled
                  ? 'bg-[#56CFE1]/15 text-[#56CFE1] border-[#56CFE1]/30'
                  : 'bg-[#181D2A] text-[#94A3B8] border-[#232B3E] hover:text-[#F1F5F9]'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span className="hidden sm:inline">Web Search</span>
            </button>
          </div>

          {/* Right send button */}
          <div className="flex items-center gap-2">
            {isGenerating ? (
              <button
                type="button"
                onClick={onStop}
                className="h-8 px-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!text.trim() && attachedFiles.length === 0}
                className={`h-8 px-3.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 active:scale-95 ${
                  text.trim() || attachedFiles.length > 0
                    ? 'bg-[#8B7CFF] text-[#0B0D12] hover:bg-[#7C6BF0] shadow-[0_0_15px_rgba(139,124,255,0.35)] cursor-pointer'
                    : 'bg-[#181D2A] text-[#94A3B8]/40 border border-[#232B3E] cursor-not-allowed'
                }`}
              >
                <span className="hidden sm:inline">↵ Return</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="text-center mt-2">
        <span className="text-[11px] text-[#94A3B8]/60">
          Cortex AI responses may contain inaccuracies. Verify critical system outputs.
        </span>
      </div>
    </div>
  );
};

export default MessageComposer;
