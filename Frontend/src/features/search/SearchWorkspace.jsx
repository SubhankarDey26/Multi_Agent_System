import React, { useState } from 'react';
import {
  Globe,
  Search,
  ExternalLink,
  CheckCircle2,
  Filter,
  RotateCw,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { SAMPLE_SEARCH_RESULTS } from '../../mocks/mockData';
import agentService from '../../services/agentService';
import MarkdownRenderer from '../../components/chat/MarkdownRenderer';

const TIMEFRAMES = ['Past 24 hours', 'Past 7 days', 'Past 30 days', 'All time'];
const DEPTHS = ['Quick Overview', 'Deep Synthesis'];

export const SearchWorkspace = () => {
  const { showToast } = useAppStore();
  const [query, setQuery] = useState(
    'Latest trends in multi-agent AI workspace systems and tool-calling runtimes'
  );
  const [timeframe, setTimeframe] = useState('Past 30 days');
  const [depth, setDepth] = useState('Deep Synthesis');
  const [results, setResults] = useState(SAMPLE_SEARCH_RESULTS);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStatus, setSearchStatus] = useState('');

  const handleSearch = async (targetQuery) => {
    const q = targetQuery || query.trim();
    if (!q || isSearching) return;

    setIsSearching(true);
    setSearchStatus('Connecting to live search cluster...');

    try {
      const data = await agentService.performSearch(q, (status) => setSearchStatus(status));
      setResults(data);
      setIsSearching(false);
      showToast(`Synthesized ${data.sources.length} sources for query`, 'success');
    } catch {
      setIsSearching(false);
      showToast('Search execution failed', 'error');
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full px-4 sm:px-6 py-6 max-w-5xl mx-auto min-h-[calc(100vh-4rem)] gap-6">
      {/* Search Hero & Query Bar */}
      <div className="p-6 rounded-2xl bg-[#121620] border border-[#232B3E] shadow-xl flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#F1F5F9]">Search Agent — Live Web Research</h1>
            <p className="text-xs text-[#94A3B8]">
              Deep web exploration, source verification, and structured research synthesis
            </p>
          </div>
        </div>

        {/* Input Field */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter research topic, question, or technology comparison..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0E1118] border border-[#232B3E] text-xs sm:text-sm text-[#F1F5F9] focus:outline-none focus:border-emerald-500 shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="h-11 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95 disabled:opacity-50 shrink-0"
          >
            {isSearching ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Synthesize</span>
              </>
            )}
          </button>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#232B3E]/60 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span className="text-[#94A3B8]">Time:</span>
            <div className="flex gap-1">
              {TIMEFRAMES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimeframe(t)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] transition-colors ${
                    timeframe === t
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {DEPTHS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDepth(d)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-colors border ${
                  depth === d
                    ? 'bg-[#181D2A] text-[#56CFE1] border-[#56CFE1]/40'
                    : 'border-transparent text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Loading status message */}
        {isSearching && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono animate-pulse pt-1">
            <RotateCw className="w-3.5 h-3.5 animate-spin" />
            <span>{searchStatus}</span>
          </div>
        )}
      </div>

      {/* Synthesis Results View */}
      {results && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          {/* Executive Summary Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#121620] border border-[#232B3E] shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#232B3E]">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI Research Synthesis
              </span>
              <span className="text-xs font-mono text-[#94A3B8]">
                Grounded across {results.sources.length} sources
              </span>
            </div>

            <MarkdownRenderer content={results.summaryText} />

            {/* Key Findings List */}
            <div className="mt-2 p-4 rounded-xl bg-[#0E1118] border border-[#232B3E] space-y-2.5">
              <span className="text-xs font-semibold text-[#F1F5F9] tracking-wide block">
                Key Strategic Takeaways:
              </span>
              {results.keyFindings.map((finding, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#94A3B8]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed text-[#F1F5F9]">{finding}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Numbered Grounded Sources Grid */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider px-1">
              Referenced Web Sources ({results.sources.length})
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {results.sources.map((src) => (
                <a
                  key={src.id}
                  href={`https://${src.domain}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-xl bg-[#121620] border border-[#232B3E] hover:border-emerald-500/40 hover:bg-[#181D2A] transition-all duration-150 flex flex-col justify-between group shadow-sm"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
                      <span className="font-mono text-emerald-400">{src.domain}</span>
                      <span className="font-mono text-[10px] bg-emerald-500/10 px-1.5 py-0.2 rounded text-emerald-400">
                        {src.relevance} match
                      </span>
                    </div>
                    <h3 className="text-xs font-semibold text-[#F1F5F9] group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {src.title}
                    </h3>
                    <p className="text-[11px] text-[#94A3B8] line-clamp-2 mt-0.5">{src.snippet}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-[#232B3E]/60 text-[10px] text-[#94A3B8]">
                    <span>Indexed {src.date}</span>
                    <ExternalLink className="w-3 h-3 group-hover:text-emerald-400 transition-colors" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Suggested Follow-up Questions */}
          <div className="p-4 rounded-xl bg-[#121620] border border-[#232B3E] flex flex-col gap-2.5">
            <span className="text-xs font-semibold text-[#94A3B8]">Explore Follow-up Questions:</span>
            <div className="flex flex-wrap gap-2">
              {[
                'How does Model Context Protocol handle authentication tokens?',
                'Benchmark comparison of SSE vs WebSocket for 60Hz streaming',
                'What are the failure modes of CRDT in collaborative AI state?',
              ].map((followUp, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery(followUp);
                    handleSearch(followUp);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs bg-[#181D2A] hover:bg-[#232B3E] text-[#94A3B8] hover:text-[#F1F5F9] border border-[#232B3E] transition-colors flex items-center gap-1.5"
                >
                  <span>{followUp}</span>
                  <ArrowRight className="w-3 h-3 text-emerald-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchWorkspace;
