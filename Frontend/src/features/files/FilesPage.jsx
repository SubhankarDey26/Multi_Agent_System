import React, { useState, useRef } from 'react';
import {
  Folder,
  UploadCloud,
  Search,
  Trash2,
  FileText,
  FileCode,
  FileSpreadsheet,
  Image as ImageIcon,
  Download,
  Filter,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import fileService from '../../services/fileService';
import EmptyState from '../../components/common/EmptyState';

export const FilesPage = () => {
  const { requestConfirm, showToast } = useAppStore();
  const [files, setFiles] = useState(fileService.getFiles());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const fileInputRef = useRef(null);

  const getFileIcon = (type) => {
    switch (type.toUpperCase()) {
      case 'PDF':
        return <FileText className="w-5 h-5 text-red-400" />;
      case 'TYPESCRIPT':
      case 'JAVASCRIPT':
        return <FileCode className="w-5 h-5 text-[#56CFE1]" />;
      case 'SPREADSHEET':
      case 'XLSX':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
      case 'IMAGE':
      case 'PNG':
      case 'JPG':
        return <ImageIcon className="w-5 h-5 text-pink-400" />;
      default:
        return <Folder className="w-5 h-5 text-[#8B7CFF]" />;
    }
  };

  const handleUpload = (e) => {
    const uploaded = Array.from(e.target.files || []);
    if (!uploaded.length) return;
    uploaded.forEach((f) => fileService.addFile(f));
    setFiles(fileService.getFiles());
    showToast(`Uploaded ${uploaded.length} file(s) successfully`, 'success');
    e.target.value = '';
  };

  const handleDelete = (file) => {
    requestConfirm({
      title: 'Delete File',
      message: `Are you sure you want to delete "${file.name}"? This file will be removed from workspace context.`,
      confirmText: 'Delete',
      onConfirm: () => {
        fileService.deleteFile(file.id);
        setFiles(fileService.getFiles());
        showToast(`File "${file.name}" removed`, 'info');
      },
    });
  };

  const filteredFiles = files.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'ALL' || f.type.toUpperCase() === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex-1 flex flex-col w-full px-4 sm:px-6 py-6 max-w-5xl mx-auto min-h-[calc(100vh-4rem)] gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#232B3E]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#56CFE1]/15 text-[#56CFE1] border border-[#56CFE1]/30 flex items-center justify-center">
            <Folder className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#F1F5F9]">Uploaded Files Library</h1>
            <p className="text-xs text-[#94A3B8]">
              Manage ingested documents, datasets, and codebase context
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#8B7CFF] hover:bg-[#7C6BF0] text-[#0B0D12] text-xs font-semibold transition-all shadow-[0_0_15px_rgba(139,124,255,0.3)] active:scale-95 w-full sm:w-auto"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Files</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search files by name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121620] border border-[#232B3E] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#8B7CFF]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'PDF', 'TYPESCRIPT', 'SPREADSHEET', 'IMAGE'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors border ${
                selectedType === t
                  ? 'bg-[#181D2A] text-[#56CFE1] border-[#56CFE1]/40'
                  : 'bg-[#121620] text-[#94A3B8] border-[#232B3E] hover:text-[#F1F5F9]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Files Table / List */}
      {filteredFiles.length === 0 ? (
        <EmptyState
          icon={Folder}
          title="No files match your query"
          description="Upload a document or clear filters to view files."
          actionText="Upload File"
          onAction={() => fileInputRef.current?.click()}
        />
      ) : (
        <div className="rounded-2xl bg-[#121620] border border-[#232B3E] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#181D2A] text-[#94A3B8] border-b border-[#232B3E]">
                  <th className="p-3.5 pl-5 font-semibold">File Name</th>
                  <th className="p-3.5 font-semibold">Type</th>
                  <th className="p-3.5 font-semibold">Size</th>
                  <th className="p-3.5 font-semibold">Associated Agent</th>
                  <th className="p-3.5 font-semibold">Uploaded</th>
                  <th className="p-3.5 font-semibold">Status</th>
                  <th className="p-3.5 pr-5 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232B3E]/60">
                {filteredFiles.map((file) => (
                  <tr
                    key={file.id}
                    className="hover:bg-[#181D2A]/60 transition-colors group text-[#F1F5F9]"
                  >
                    <td className="p-3.5 pl-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#0E1118] border border-[#232B3E] flex items-center justify-center shrink-0">
                          {getFileIcon(file.type)}
                        </div>
                        <span className="font-medium truncate max-w-[200px] sm:max-w-xs">
                          {file.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-[#94A3B8]">{file.type}</td>
                    <td className="p-3.5 font-mono text-[11px] text-[#94A3B8]">{file.size}</td>
                    <td className="p-3.5 text-[#56CFE1] font-medium">{file.agent}</td>
                    <td className="p-3.5 text-[#94A3B8]">{file.uploadedAt}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {file.status}
                      </span>
                    </td>
                    <td className="p-3.5 pr-5 text-right">
                      <button
                        onClick={() => handleDelete(file)}
                        className="p-1.5 rounded-lg text-[#94A3B8] hover:text-red-400 hover:bg-[#0E1118] transition-colors"
                        title="Delete file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilesPage;
