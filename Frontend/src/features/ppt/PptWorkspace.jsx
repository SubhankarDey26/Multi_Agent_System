import React, { useState } from 'react';
import {
  Presentation,
  Sparkles,
  Download,
  RotateCw,
  Plus,
  Edit3,
  Layers,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { SAMPLE_PPT_DECK } from '../../mocks/mockData';
import agentService from '../../services/agentService';

export const PptWorkspace = () => {
  const { showToast } = useAppStore();
  const [deck, setDeck] = useState(SAMPLE_PPT_DECK);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);

  // Form states
  const [topic, setTopic] = useState('Introduction to Distributed System Design');
  const [audience, setAudience] = useState('Senior Software Engineers & Architects');
  const [slidesCount, setSlidesCount] = useState(6);
  const [tone, setTone] = useState('Professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);

  const activeSlide = deck.slides[selectedSlideIndex] || deck.slides[0];

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setGenerationProgress(10);
    setGenerationStage('Initializing Cortex SlideGen pipeline...');

    try {
      const generatedDeck = await agentService.generatePresentation(
        { topic, audience, slidesCount, tone },
        (stage, progress) => {
          setGenerationStage(stage);
          setGenerationProgress(progress);
        }
      );
      setDeck(generatedDeck);
      setSelectedSlideIndex(0);
      setIsGenerating(false);
      showToast(`Generated ${generatedDeck.slides.length} slides for "${topic}"`, 'success');
    } catch {
      setIsGenerating(false);
      showToast('Slide generation failed', 'error');
    }
  };

  const handleDownloadDeck = () => {
    const jsonStr = JSON.stringify(deck, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deck.topic.toLowerCase().replace(/\s+/g, '_')}_deck.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded PPT deck specification (demo export)', 'success');
  };

  const handleRegenerateSlide = () => {
    showToast(`Regenerated Slide ${selectedSlideIndex + 1} layout`, 'info');
  };

  return (
    <div className="flex-1 flex flex-col w-full px-4 sm:px-6 py-6 max-w-7xl mx-auto min-h-[calc(100vh-4rem)] gap-6">
      {/* Creation Configuration Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#121620] border border-[#232B3E] shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#232B3E]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 flex items-center justify-center">
              <Presentation className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#F1F5F9]">PPT Agent — Deck Studio</h2>
              <p className="text-[11px] text-[#94A3B8]">
                Generate structured, presentation-ready decks from ideas or source briefs
              </p>
            </div>
          </div>
          <button
            onClick={handleDownloadDeck}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181D2A] hover:bg-[#232B3E] border border-[#232B3E] text-xs font-medium text-[#F1F5F9] transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Export Deck</span>
          </button>
        </div>

        {/* Form controls */}
        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
          <div className="md:col-span-5 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#94A3B8]">Topic / Prompt</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Distributed Consensus in Cloud-Native Architectures"
              className="w-full px-3 py-2 rounded-xl bg-[#0E1118] border border-[#232B3E] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#F59E0B]"
            />
          </div>

          <div className="md:col-span-3 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#94A3B8]">Audience</label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g. Enterprise Engineers"
              className="w-full px-3 py-2 rounded-xl bg-[#0E1118] border border-[#232B3E] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#F59E0B]"
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#94A3B8]">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0E1118] border border-[#232B3E] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#F59E0B]"
            >
              <option value="Professional">Professional</option>
              <option value="Pitch">Investor Pitch</option>
              <option value="Educational">Educational</option>
              <option value="Minimal">Minimalist</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isGenerating || !topic.trim()}
              className="w-full h-9 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Deck</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Progress Bar during generation */}
        {isGenerating && (
          <div className="flex flex-col gap-2 pt-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs text-[#F59E0B]">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping"></span>
                {generationStage}
              </span>
              <span className="font-mono">{Math.round(generationProgress)}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#181D2A] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#F59E0B] to-[#56CFE1] transition-all duration-300"
                style={{ width: `${generationProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Main Presentation Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Left Thumbnail Rail (Columns 1-4) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Slides ({deck.slides.length})
            </span>
            <span className="text-xs text-[#56CFE1] font-mono">{deck.tone}</span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {deck.slides.map((slide, index) => {
              const isSelected = selectedSlideIndex === index;
              return (
                <div
                  key={slide.id}
                  onClick={() => setSelectedSlideIndex(index)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-[#181D2A] border-[#F59E0B] shadow-[0_0_15px_-4px_rgba(245,158,11,0.25)]'
                      : 'bg-[#121620] border-[#232B3E] hover:border-[#232B3E]/80 hover:bg-[#181D2A]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#0E1118] text-[#94A3B8]">
                      Slide {index + 1}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
                    )}
                  </div>
                  <h3 className="text-xs font-semibold text-[#F1F5F9] line-clamp-1">{slide.title}</h3>
                  <p className="text-[11px] text-[#94A3B8] line-clamp-1">{slide.subtitle}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Full Slide Canvas Preview (Columns 5-12) */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Slide {selectedSlideIndex + 1} of {deck.slides.length} Preview
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRegenerateSlide}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-[#121620] hover:bg-[#181D2A] border border-[#232B3E] text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Regenerate</span>
              </button>
            </div>
          </div>

          {/* 16:9 Aspect Slide Canvas */}
          <div className="relative w-full rounded-2xl bg-gradient-to-br from-[#121620] via-[#181D2A] to-[#0E1118] border border-[#232B3E] p-6 sm:p-10 shadow-2xl flex flex-col justify-between min-h-[460px] overflow-hidden">
            {/* Ambient slide glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#F59E0B]/5 rounded-full blur-3xl pointer-events-none"></div>

            {/* Slide Header */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">
                  {deck.topic}
                </span>
                <span className="text-xs font-mono text-[#94A3B8]/60">
                  Slide {selectedSlideIndex + 1}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F5F9] leading-tight">
                {activeSlide.title}
              </h2>
              <p className="text-sm text-[#94A3B8] mt-1.5">{activeSlide.subtitle}</p>
            </div>

            {/* Slide Content Bullets */}
            <div className="my-6 space-y-3">
              {activeSlide.bullets.map((bullet, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#F59E0B] mt-1.5 shrink-0"></div>
                  <p className="text-sm text-[#F1F5F9] leading-relaxed">{bullet}</p>
                </div>
              ))}
            </div>

            {/* Architecture diagram & Key Metric Box */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-4 border-t border-[#232B3E]/60">
              <div className="sm:col-span-8 p-3 rounded-xl bg-[#0E1118]/80 border border-[#232B3E] font-mono text-xs text-[#56CFE1] flex items-center gap-2">
                <Layers className="w-4 h-4 shrink-0" />
                <span className="truncate">{activeSlide.diagram}</span>
              </div>

              <div className="sm:col-span-4 p-3 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Key Metric:</span>
                </div>
                <span className="font-mono font-bold text-xs">{activeSlide.keyMetric}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PptWorkspace;
