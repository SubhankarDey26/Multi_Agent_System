import React from 'react';
import { Sparkles } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Sparkles,
  title = 'No items found',
  description = 'Get started by creating a new task or query.',
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto my-auto">
      <div className="w-12 h-12 rounded-2xl bg-[#181D2A] border border-[#232B3E] flex items-center justify-center text-[#8B7CFF] mb-4 shadow-lg shadow-[#8B7CFF]/5">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-[#F1F5F9]">{title}</h3>
      <p className="text-sm text-[#94A3B8] mt-1 mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-lg bg-[#8B7CFF] hover:bg-[#7A6AEB] text-black font-semibold text-sm transition-all active:scale-95 shadow-[0_0_15px_rgba(139,124,255,0.3)]"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
