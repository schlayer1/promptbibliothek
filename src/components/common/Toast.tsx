import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  title: string;
  message?: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ title, message, type = 'info', onClose }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-start gap-3 p-4 max-w-md bg-white rounded-2xl shadow-float border border-slate-200 animate-fadeIn">
      <div className="shrink-0 mt-0.5">
        {type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        {type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600" />}
        {type === 'info' && <Info className="w-5 h-5 text-school-primary" />}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-slate-900 leading-tight">{title}</h4>
        {message && <p className="text-xs text-slate-600 mt-1 leading-relaxed">{message}</p>}
      </div>
      <button
        onClick={onClose}
        className="shrink-0 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
