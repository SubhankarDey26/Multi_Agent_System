import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Download,
  Play,
  RotateCw,
  Terminal,
  Cpu,
  FileCode,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import MessageComposer from '../../components/chat/MessageComposer';
import MarkdownRenderer from '../../components/chat/MarkdownRenderer';
import chatService from '../../services/chatService';

const SAMPLE_GENERATED_CODE = {
  javascript: `// authController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const ACCESS_SECRET = process.env.ACCESS_SECRET || 'cortex-jwt-secret';

export async function loginUser(req, res) {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  // Simulated user lookup
  const token = jwt.sign({ sub: 'user_101', role: 'admin' }, ACCESS_SECRET, {
    expiresIn: '1h',
  });

  return res.json({
    token,
    tokenType: 'Bearer',
    expiresIn: 3600,
  });
}`,
  typescript: `// telemetrySync.ts
export interface TelemetryFrame {
  timestamp: number;
  nodeId: string;
  payload: Record<string, unknown>;
}

export class TelemetryDispatcher {
  private channel = new BroadcastChannel('telemetry_bus');

  public broadcast(frame: TelemetryFrame): void {
    this.channel.postMessage({
      ...frame,
      emittedAt: performance.now(),
    });
  }
}`,
  python: `# cache_manager.py
import redis
import json

class CacheManager:
    def __init__(self, host='localhost', port=6379):
        self.client = redis.Redis(host=host, port=port, decode_responses=True)

    def get_or_set(self, key: str, fallback_fn, ttl: int = 300):
        val = self.client.get(key)
        if val:
            return json.loads(val)
        computed = fallback_fn()
        self.client.setex(key, ttl, json.dumps(computed))
        return computed`,
};

const LANGUAGES = [
  { id: 'typescript', label: 'TypeScript' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
];

export const CodingWorkspace = () => {
  const { showToast } = useAppStore();
  const [selectedLang, setSelectedLang] = useState('typescript');
  const [activeCode, setActiveCode] = useState(SAMPLE_GENERATED_CODE['typescript']);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('both'); // for mobile: 'chat' | 'editor' | 'both'

  const [messages, setMessages] = useState([
    {
      id: 'c-1',
      role: 'user',
      content: 'Build a low-latency state synchronization service in TypeScript using BroadcastChannel and typed frame interfaces.',
      timestamp: '10:30 AM',
    },
    {
      id: 'c-2',
      role: 'assistant',
      content: `I've architected a production-ready **TelemetryDispatcher** service in TypeScript. 

### Implementation Highlights:
1. **Low-Latency Bus**: Uses the native browser \`BroadcastChannel\` API to bypass the main JavaScript serialization bottlenecks.
2. **Strict Typing**: The \`TelemetryFrame\` interface guarantees schema compliance across micro-frontends.
3. **Zero UI Blocking**: Designed for use in web workers or isolated background threads.

Take a look at the generated code on the right panel. You can copy it, download the file, or ask for refactorings.`,
      timestamp: '10:31 AM',
      model: 'Cortex Code Pro',
    },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    showToast('Code copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = selectedLang === 'python' ? 'py' : selectedLang === 'typescript' ? 'ts' : 'js';
    const blob = new Blob([activeCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cortex-generated.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded cortex-generated.${ext}`, 'success');
  };

  const handleLangChange = (lang) => {
    setSelectedLang(lang);
    if (SAMPLE_GENERATED_CODE[lang]) {
      setActiveCode(SAMPLE_GENERATED_CODE[lang]);
    }
  };

  const handleSend = async ({ content }) => {
    const userMsg = {
      id: 'c-' + Date.now(),
      role: 'user',
      content,
      timestamp: 'Just now',
    };
    setMessages((prev) => [...prev, userMsg]);

    const assistMsgId = 'c-assist-' + Date.now();
    const assistMsg = {
      id: assistMsgId,
      role: 'assistant',
      content: '',
      isStreaming: true,
      timestamp: 'Just now',
      model: 'Cortex Code Pro',
    };
    setMessages((prev) => [...prev, assistMsg]);
    setIsGenerating(true);

    try {
      await chatService.streamResponse(content, 'coding', (chunk) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === assistMsgId ? { ...m, content: chunk } : m))
        );
      });
      setIsGenerating(false);
    } catch {
      setIsGenerating(false);
      showToast('Generation failed', 'error');
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full px-4 sm:px-6 py-4 max-w-7xl mx-auto min-h-[calc(100vh-4rem)]">
      {/* Top Coding Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#232B3E]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#56CFE1]/15 text-[#56CFE1] border border-[#56CFE1]/30 flex items-center justify-center">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#F1F5F9]">Coding Agent Workspace</h2>
            <p className="text-[11px] text-[#94A3B8]">Syntax validation, refactoring, and real-time generation</p>
          </div>
        </div>

        {/* Quick Language Switcher & Tab toggle for small screens */}
        <div className="flex items-center gap-2">
          {/* Mobile view toggle */}
          <div className="flex xl:hidden bg-[#121620] p-0.5 rounded-lg border border-[#232B3E] text-xs">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-2.5 py-1 rounded-md ${activeTab === 'chat' ? 'bg-[#181D2A] text-[#F1F5F9] font-medium' : 'text-[#94A3B8]'}`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-2.5 py-1 rounded-md ${activeTab === 'editor' ? 'bg-[#181D2A] text-[#F1F5F9] font-medium' : 'text-[#94A3B8]'}`}
            >
              Code Editor
            </button>
          </div>

          <div className="flex items-center gap-1 bg-[#121620] p-1 rounded-xl border border-[#232B3E]">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                onClick={() => handleLangChange(lang.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                  selectedLang === lang.id
                    ? 'bg-[#56CFE1]/15 text-[#56CFE1] font-medium border border-[#56CFE1]/30'
                    : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-4 pt-4 pb-4">
        {/* Left Column: Chat Thread & Composer (Columns 1-6) */}
        <div
          className={`flex-col justify-between h-[calc(100vh-12rem)] flex ${
            activeTab === 'editor' ? 'hidden xl:flex' : 'flex'
          } xl:col-span-6`}
        >
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-xl border ${
                  msg.role === 'user'
                    ? 'bg-[#181D2A] border-[#232B3E] ml-auto max-w-xl'
                    : 'bg-[#121620] border-[#232B3E] mr-auto w-full'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-[#94A3B8] mb-2 border-b border-[#232B3E]/40 pb-1.5">
                  <span className="font-semibold text-[#56CFE1]">
                    {msg.role === 'user' ? 'Operator' : 'Coding Agent'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>
                <MarkdownRenderer content={msg.content} />
              </div>
            ))}
          </div>

          <div className="pt-2">
            <MessageComposer
              onSend={handleSend}
              isGenerating={isGenerating}
              onStop={() => setIsGenerating(false)}
              placeholder="Describe bug to fix, API to generate, or function to optimize..."
              activeAgentId="coding"
            />
          </div>
        </div>

        {/* Right Column: Code Editor Preview Panel (Columns 7-12) */}
        <div
          className={`flex-col rounded-2xl bg-[#0E1118] border border-[#232B3E] overflow-hidden shadow-2xl h-[calc(100vh-12rem)] ${
            activeTab === 'chat' ? 'hidden xl:flex' : 'flex'
          } xl:col-span-6`}
        >
          {/* Editor Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#121620] border-b border-[#232B3E]">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5 mr-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
              </div>
              <FileCode className="w-3.5 h-3.5 text-[#56CFE1]" />
              <span className="text-xs font-mono text-[#F1F5F9]">
                output.{selectedLang === 'python' ? 'py' : selectedLang === 'typescript' ? 'ts' : 'js'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-[#181D2A] hover:bg-[#232B3E] text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
                title="Copy code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px]">Copy</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-[#181D2A] hover:bg-[#232B3E] text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
                title="Download file"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="text-[11px]">Save</span>
              </button>

              <button
                onClick={() => {
                  handleSend({ content: 'Explain this code line by line and show edge case tests' });
                  if (activeTab === 'editor') setActiveTab('chat');
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-[#56CFE1]/15 text-[#56CFE1] hover:bg-[#56CFE1]/25 transition-colors border border-[#56CFE1]/30"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span className="text-[11px]">Explain</span>
              </button>
            </div>
          </div>

          {/* Code Textarea / Viewer with Line Numbers */}
          <div className="flex-1 flex overflow-hidden font-mono text-xs leading-relaxed">
            {/* Line Numbers */}
            <div className="w-10 bg-[#11141B] text-[#94A3B8]/40 select-none py-4 text-right pr-2.5 border-r border-[#232B3E]">
              {activeCode.split('\n').map((_, i) => (
                <div key={i} className="h-5">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Editable code buffer */}
            <textarea
              value={activeCode}
              onChange={(e) => setActiveCode(e.target.value)}
              spellCheck={false}
              className="flex-1 p-4 bg-transparent text-[#F1F5F9] resize-none focus:outline-none overflow-auto font-mono text-xs leading-5"
            />
          </div>

          {/* Status footer */}
          <div className="px-4 py-2 bg-[#121620] border-t border-[#232B3E] flex items-center justify-between text-[11px] text-[#94A3B8] font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              TypeScript v5.6 Clean Build • 0 errors
            </span>
            <span>UTF-8 • Spaces: 2</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingWorkspace;
