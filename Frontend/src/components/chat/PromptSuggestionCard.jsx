import React from 'react';
import { ArrowRight } from 'lucide-react';

export const PromptSuggestionCard = ({
  icon: Icon,
  title,
  description,
  onClick,
  accent = 'violet',
}) => {
  const isCyan = accent === 'cyan';

  return (
    <div
      onClick={onClick}
      className={`group p-4 rounded-xl bg-[#121620] border border-[#232B3E] transition-all duration-200 cursor-pointer shadow-sm flex flex-col justify-between h-36 ${
        isCyan
          ? 'hover:border-[#56CFE1]/50 hover:bg-[#181D2A] hover:shadow-[0_0_20px_-4px_rgba(86,207,225,0.2)]'
          : 'hover:border-[#8B7CFF]/50 hover:bg-[#181D2A] hover:shadow-[0_0_20px_-4px_rgba(139,124,255,0.2)]'
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`w-9 h-9 rounded-lg bg-[#181D2A] border border-[#232B3E] flex items-center justify-center transition-colors ${
            isCyan
              ? 'text-[#56CFE1] group-hover:border-[#56CFE1]/40'
              : 'text-[#8B7CFF] group-hover:border-[#8B7CFF]/40'
          }`}
        >
          {Icon && <Icon className="w-4 h-4" />}
        </div>
        <ArrowRight
          className={`w-4 h-4 text-[#94A3B8] transition-colors ${
            isCyan ? 'group-hover:text-[#56CFE1]' : 'group-hover:text-[#8B7CFF]'
          }`}
        />
      </div>

      <div>
        <h2
          className={`text-sm font-semibold text-[#F1F5F9] transition-colors line-clamp-1 ${
            isCyan ? 'group-hover:text-[#56CFE1]' : 'group-hover:text-[#8B7CFF]'
          }`}
        >
          {title}
        </h2>
        <p className="text-xs text-[#94A3B8] mt-1 line-clamp-1">{description}</p>
      </div>
    </div>
  );
};

export default PromptSuggestionCard;
