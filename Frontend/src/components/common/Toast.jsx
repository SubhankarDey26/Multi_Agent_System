import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const Toast = () => {
  const { toast } = useAppStore();

  if (!toast) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-[#8B7CFF] shrink-0" />,
  };

  return (
    <aside
      aria-label="Notifications"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#181D2A] border border-[#232B3E] shadow-xl text-sm text-[#F1F5F9] animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      {iconMap[toast.type] || iconMap.info}
      <span className="font-medium">{toast.message}</span>
    </aside>
  );
};

export default Toast;
