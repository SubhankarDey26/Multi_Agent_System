import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

export const CodeBlock = ({ language = 'text', code = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-[#232B3E] bg-[#0E1118] my-3">
      <div className="flex items-center justify-between px-4 py-2 bg-[#121620] border-b border-[#232B3E]">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#56CFE1]" />
          <span className="text-xs font-mono text-[#94A3B8] lowercase">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#181D2A] transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-[#F1F5F9] selection:bg-[#8B7CFF]/30">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
