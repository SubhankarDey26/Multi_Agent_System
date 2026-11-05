import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  Download,
  Copy,
  Check,
  Maximize2,
  X,
  Layers,
  RotateCw,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { SAMPLE_IMAGE_RESULTS } from '../../mocks/mockData';
import agentService from '../../services/agentService';

const STYLES = [
  'Cinematic 3D',
  'Photorealistic',
  'Isometric 3D',
  'Abstract Digital',
  'Minimalist Vector',
];

const ASPECT_RATIOS = [
  { id: '16:9', label: 'Landscape (16:9)' },
  { id: '1:1', label: 'Square (1:1)' },
  { id: '9:16', label: 'Portrait (9:16)' },
];

export const ImageWorkspace = () => {
  const { showToast } = useAppStore();
  const [images, setImages] = useState(SAMPLE_IMAGE_RESULTS);
  const [prompt, setPrompt] = useState(
    'A futuristic AI neural workspace console in deep space obsidian, neon violet and cyan glowing fiber optics, cinematic volumetric lighting, 8k render.'
  );
  const [style, setStyle] = useState('Cinematic 3D');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [count, setCount] = useState(2);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const newImages = await agentService.generateImages({
        prompt,
        style,
        aspectRatio,
        count,
      });
      setImages((prev) => [...newImages, ...prev]);
      setIsGenerating(false);
      showToast(`Generated ${newImages.length} image(s) with ${style} style`, 'success');
    } catch {
      setIsGenerating(false);
      showToast('Image generation failed', 'error');
    }
  };

  const handleCopyPrompt = (img) => {
    navigator.clipboard.writeText(img.prompt);
    setCopiedId(img.id);
    showToast('Prompt copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (img) => {
    const a = document.createElement('a');
    a.href = img.url;
    a.download = `cortex-art-${img.id}.jpg`;
    a.target = '_blank';
    a.click();
    showToast('Downloading demo visual asset', 'success');
  };

  return (
    <div className="flex-1 flex flex-col w-full px-4 sm:px-6 py-6 max-w-7xl mx-auto min-h-[calc(100vh-4rem)] gap-6">
      {/* Creation Studio Bar */}
      <div className="p-5 rounded-2xl bg-[#121620] border border-[#232B3E] shadow-xl flex flex-col gap-4">
        <div className="flex items-center gap-3 pb-3 border-b border-[#232B3E]">
          <div className="w-9 h-9 rounded-xl bg-pink-500/15 text-pink-400 border border-pink-500/30 flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#F1F5F9]">Image Agent — Creative Diffusion</h2>
            <p className="text-[11px] text-[#94A3B8]">
              High-resolution visual generation from text prompts with customizable art styles and aspect ratios
            </p>
          </div>
        </div>

        {/* Input & Controls Form */}
        <form onSubmit={handleGenerate} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#94A3B8]">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image in rich detail (lighting, composition, mood, camera angle)..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0E1118] border border-[#232B3E] text-xs text-[#F1F5F9] focus:outline-none focus:border-pink-500 resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end">
            {/* Style Selector */}
            <div className="sm:col-span-4 flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#94A3B8]">Art Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0E1118] border border-[#232B3E] text-xs text-[#F1F5F9] focus:outline-none focus:border-pink-500"
              >
                {STYLES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Aspect Ratio */}
            <div className="sm:col-span-4 flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#94A3B8]">Aspect Ratio</label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0E1118] border border-[#232B3E] text-xs text-[#F1F5F9] focus:outline-none focus:border-pink-500"
              >
                {ASPECT_RATIOS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Count */}
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#94A3B8]">Count</label>
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#0E1118] border border-[#232B3E] text-xs text-[#F1F5F9] focus:outline-none focus:border-pink-500"
              >
                <option value={1}>1 Image</option>
                <option value={2}>2 Images</option>
                <option value={4}>4 Images</option>
              </select>
            </div>

            {/* Submit CTA */}
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={isGenerating || !prompt.trim()}
                className="w-full h-9 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)] active:scale-95 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Rendering...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Gallery Header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
          Generated Gallery ({images.length} results)
        </span>
        <span className="text-[11px] font-mono text-[#56CFE1]">
          Cortex Diffusion XL Engine • Demo Assets
        </span>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Loading Skeletons during generation */}
        {isGenerating &&
          Array.from({ length: count }).map((_, i) => (
            <div
              key={'skel-' + i}
              className="rounded-2xl bg-[#121620] border border-pink-500/30 overflow-hidden shadow-lg animate-pulse h-72 flex flex-col justify-between p-4"
            >
              <div className="w-20 h-4 rounded bg-[#181D2A]"></div>
              <div className="flex flex-col items-center justify-center gap-2">
                <RotateCw className="w-6 h-6 text-pink-400 animate-spin" />
                <span className="text-xs text-[#94A3B8]">Diffusing latent vectors...</span>
              </div>
              <div className="w-full h-8 rounded bg-[#181D2A]"></div>
            </div>
          ))}

        {/* Real / Mock Image Cards */}
        {images.map((img) => (
          <div
            key={img.id}
            className="group rounded-2xl bg-[#121620] border border-[#232B3E] hover:border-pink-500/50 overflow-hidden shadow-xl transition-all duration-200 flex flex-col justify-between"
          >
            {/* Image Thumbnail Container */}
            <div className="relative aspect-video w-full bg-[#0E1118] overflow-hidden">
              <img
                src={img.url}
                alt={img.prompt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                <button
                  onClick={() => setPreviewImage(img)}
                  className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/90 transition-colors"
                  title="Full Preview"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDownload(img)}
                  className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/90 transition-colors"
                  title="Download Image"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card Details */}
            <div className="p-4 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
                <span className="font-mono px-2 py-0.5 rounded bg-[#181D2A] text-pink-400 border border-pink-500/20">
                  {img.style}
                </span>
                <span>{img.timestamp}</span>
              </div>

              <p className="text-xs text-[#F1F5F9] line-clamp-2 leading-relaxed">{img.prompt}</p>

              <div className="flex items-center justify-between pt-2 border-t border-[#232B3E]/60">
                <div className="flex items-center gap-1.5">
                  {img.tags?.slice(0, 2).map((t, idx) => (
                    <span key={idx} className="text-[10px] text-[#94A3B8] font-mono">
                      #{t}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => handleCopyPrompt(img)}
                  className="flex items-center gap-1 text-[11px] text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
                  title="Copy Prompt"
                >
                  {copiedId === img.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Prompt</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full rounded-2xl bg-[#121620] border border-[#232B3E] overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#232B3E]">
              <span className="text-xs font-semibold text-[#F1F5F9]">{previewImage.style}</span>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F1F5F9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={previewImage.url}
                alt={previewImage.prompt}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="p-4 flex items-center justify-between bg-[#0E1118]">
              <p className="text-xs text-[#94A3B8] max-w-lg truncate">{previewImage.prompt}</p>
              <button
                onClick={() => handleDownload(previewImage)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Asset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageWorkspace;
