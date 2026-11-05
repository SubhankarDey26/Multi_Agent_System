import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useAppStore();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-colors border ${
        theme === 'dark'
          ? 'bg-[#181D2A] border-[#232B3E] text-[#94A3B8] hover:text-[#56CFE1] hover:border-[#56CFE1]/40'
          : 'bg-white border-slate-200 text-slate-600 hover:text-indigo-600'
      } ${className}`}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
};

export default ThemeToggle;
