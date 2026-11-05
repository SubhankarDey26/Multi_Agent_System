import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = ({ message = 'Reasoning and synthesizing...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="relative">
        <Loader2 className="w-8 h-8 text-[#8B7CFF] animate-spin" />
        <div className="absolute inset-0 rounded-full blur-md bg-[#8B7CFF]/30 -z-10 animate-pulse"></div>
      </div>
      <p className="text-sm font-medium text-[#94A3B8] mt-4 animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingState;
