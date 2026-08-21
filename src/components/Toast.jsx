import React from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 border border-slate-700/80 text-white px-4 py-3 rounded-xl shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
      {type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      ) : (
        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
      )}
      <span className="text-xs font-semibold">{message}</span>
      <button onClick={onClose} className="text-slate-400 hover:text-white ml-2">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
