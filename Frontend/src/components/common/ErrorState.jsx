import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'An error occurred while executing this operation.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto">
      <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-[#F1F5F9]">{title}</h3>
      <p className="text-xs text-[#94A3B8] mt-1 mb-5">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#181D2A] border border-[#232B3E] hover:border-[#8B7CFF]/50 text-sm font-medium text-[#F1F5F9] transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-[#8B7CFF]" />
          <span>Retry Operation</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
