import React, { useState, useRef } from 'react';
import {
  FileText,
  UploadCloud,
  FileCheck,
  ChevronRight,
  BookOpen,
  Search,
  CheckCircle,
  ExternalLink,
  Send,
  Loader2,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { SAMPLE_PDF_DOC } from '../../mocks/mockData';
import agentService from '../../services/agentService';
import MarkdownRenderer from '../../components/chat/MarkdownRenderer';

export const PdfWorkspace = () => {
  const { showToast } = useAppStore();
  const [doc, setDoc] = useState(SAMPLE_PDF_DOC);
  const [selectedPage, setSelectedPage] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Q&A Conversation state
  const [qaList, setQaList] = useState(SAMPLE_PDF_DOC.qaHistory);
  const [questionText, setQuestionText] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(20);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          const newDoc = {
            id: 'doc-' + Date.now(),
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
            pages: 18,
            uploadDate: 'Just now',
            status: 'Ready',
            summary: `Vector indexed ${file.name}. Parsed headings, diagrams, and token embeddings across 18 pages.`,
            sections: [
              { page: 1, title: 'Document Abstract & Scope' },
              { page: 4, title: 'Architectural Topology' },
              { page: 9, title: 'Data Flow & Protocols' },
              { page: 14, title: 'Security & Access Control' },
            ],
            qaHistory: [],
          };
          setDoc(newDoc);
          setQaList([]);
          showToast(`Indexed document: ${file.name}`, 'success');
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const handleAsk = async (prompt) => {
    const query = prompt || questionText.trim();
    if (!query || isQuerying) return;

    setQuestionText('');
    const newQaId = 'qa-' + Date.now();
    const pendingQa = {
      id: newQaId,
      question: query,
      answer: 'Analyzing document vectors and citations...',
      pageRef: 'Indexing...',
      isStreaming: true,
    };
    setQaList((prev) => [...prev, pendingQa]);
    setIsQuerying(true);

    try {
      const response = await agentService.queryPdf(doc.id, query, (chunk) => {
        setQaList((prev) =>
          prev.map((item) => (item.id === newQaId ? { ...item, answer: chunk } : item))
        );
      });

      setQaList((prev) =>
        prev.map((item) =>
          item.id === newQaId
            ? { ...item, answer: response.answer, pageRef: response.pageRef, isStreaming: false }
            : item
        )
      );
      setIsQuerying(false);
    } catch {
      setIsQuerying(false);
      showToast('Document query failed', 'error');
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full px-4 sm:px-6 py-6 max-w-7xl mx-auto min-h-[calc(100vh-4rem)] gap-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#121620] border border-[#232B3E]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#F1F5F9]">{doc.name}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {doc.status}
              </span>
            </div>
            <p className="text-xs text-[#94A3B8]">
              {doc.size} • {doc.pages} pages • Uploaded {doc.uploadDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181D2A] hover:bg-[#232B3E] border border-[#232B3E] text-xs font-medium text-[#F1F5F9] transition-colors"
          >
            <UploadCloud className="w-4 h-4 text-[#56CFE1]" />
            <span>Upload Another PDF</span>
          </button>
        </div>
      </div>

      {/* Upload progress state */}
      {isUploading && (
        <div className="p-4 rounded-xl bg-[#121620] border border-[#56CFE1]/40 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-[#56CFE1]">
            <span>Parsing document AST and computing vector embeddings...</span>
            <span className="font-mono">{uploadProgress}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#181D2A] overflow-hidden">
            <div
              className="h-full bg-[#56CFE1] transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Main Split Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Document Table of Contents & Preview Placeholder (Columns 1-5) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-4 rounded-2xl bg-[#121620] border border-[#232B3E] flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#232B3E]">
              <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-red-400" />
                Document Sections
              </span>
              <span className="text-xs text-[#94A3B8]">{doc.pages} Pages Total</span>
            </div>

            <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
              {doc.sections.map((section, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPage(section.page)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs text-left transition-colors ${
                    selectedPage === section.page
                      ? 'bg-[#181D2A] text-red-400 font-medium border border-red-500/30'
                      : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#181D2A]/60'
                  }`}
                >
                  <span className="truncate pr-2">{section.title}</span>
                  <span className="text-[10px] font-mono text-[#94A3B8] shrink-0">
                    Page {section.page}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Document Preview Visual Placeholder */}
          <div className="flex-1 p-6 rounded-2xl bg-[#0E1118] border border-[#232B3E] shadow-inner flex flex-col justify-between min-h-[300px]">
            <div className="flex items-center justify-between pb-3 border-b border-[#232B3E]/60 text-xs text-[#94A3B8]">
              <span>Viewing: Page {selectedPage}</span>
              <span className="font-mono text-[10px]">Scale: 100%</span>
            </div>

            <div className="my-auto text-center p-6 border-2 border-dashed border-[#232B3E] rounded-xl">
              <FileCheck className="w-10 h-10 text-red-400 mx-auto mb-2 opacity-80" />
              <h3 className="text-xs font-semibold text-[#F1F5F9]">Interactive Document Canvas</h3>
              <p className="text-[11px] text-[#94A3B8] mt-1 max-w-xs mx-auto">
                Semantic citations link directly to grounded document paragraphs.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#232B3E]/60 text-[11px] text-[#94A3B8]">
              <button
                onClick={() => setSelectedPage((p) => Math.max(1, p - 1))}
                className="px-2 py-1 rounded bg-[#181D2A] hover:bg-[#232B3E]"
              >
                Previous Page
              </button>
              <span>{selectedPage} / {doc.pages}</span>
              <button
                onClick={() => setSelectedPage((p) => Math.min(doc.pages, p + 1))}
                className="px-2 py-1 rounded bg-[#181D2A] hover:bg-[#232B3E]"
              >
                Next Page
              </button>
            </div>
          </div>
        </div>

        {/* Right: Document Chat & Q&A Panel (Columns 6-12) */}
        <div className="lg:col-span-7 flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-[#121620] border border-[#232B3E] shadow-xl min-h-[500px]">
          {/* Suggested Quick Prompts */}
          <div className="flex flex-wrap items-center gap-1.5 pb-3 border-b border-[#232B3E]">
            <span className="text-[11px] font-semibold text-[#94A3B8] mr-1">Suggested:</span>
            {[
              'Summarize this PDF',
              'Explain Thundering Herd pattern',
              'Key capacity planning formulas',
              'Extract table on Page 7',
            ].map((sug, i) => (
              <button
                key={i}
                onClick={() => handleAsk(sug)}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#181D2A] hover:bg-[#232B3E] border border-[#232B3E] text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Conversation Thread */}
          <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
            {qaList.map((qa) => (
              <div key={qa.id} className="space-y-2">
                {/* User question */}
                <div className="p-3 rounded-xl bg-[#181D2A] border border-[#232B3E] text-xs font-semibold text-[#F1F5F9] max-w-lg ml-auto">
                  {qa.question}
                </div>

                {/* Assistant answer */}
                <div className="p-4 rounded-xl bg-[#0E1118] border border-[#232B3E] text-xs text-[#F1F5F9] space-y-2">
                  <div className="flex items-center justify-between border-b border-[#232B3E]/60 pb-1.5">
                    <span className="text-red-400 font-semibold flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      PDF Intelligence
                    </span>
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-red-500/10 text-red-400 border border-red-500/20">
                      {qa.pageRef}
                    </span>
                  </div>
                  <MarkdownRenderer content={qa.answer} />
                </div>
              </div>
            ))}
          </div>

          {/* Ask Input */}
          <div className="pt-3 border-t border-[#232B3E]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAsk();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Ask any question about this document or extract clauses..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#0E1118] border border-[#232B3E] text-xs text-[#F1F5F9] focus:outline-none focus:border-red-400"
              />
              <button
                type="submit"
                disabled={!questionText.trim() || isQuerying}
                className="h-9 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isQuerying ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <span>Query</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfWorkspace;
