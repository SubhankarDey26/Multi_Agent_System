import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const ConfirmDialog = () => {
  const { confirmState } = useAppStore();

  if (!confirmState) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-[#121620] border border-[#232B3E] p-6 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#F1F5F9]">{confirmState.title}</h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">{confirmState.message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-2 pt-4 border-t border-[#232B3E]">
          <button
            onClick={confirmState.onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#181D2A] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmState.onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-colors shadow-lg shadow-red-500/20"
          >
            {confirmState.confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
