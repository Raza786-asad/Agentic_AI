import React from 'react';
import { Bell, CheckCheck, X, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export default function NotificationPanel({ notifications, onClose, onMarkAllRead }) {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Alert Center</h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onMarkAllRead}
            className="text-[11px] text-cyan-400 hover:underline font-medium flex items-center gap-1"
          >
            <CheckCheck className="w-3 h-3" /> Clear
          </button>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-100">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No unread notifications
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="p-3 hover:bg-slate-800/40 transition-colors flex items-start gap-2.5">
              {n.type === 'critical' ? (
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              ) : n.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{n.message}</p>
                <span className="text-[10px] text-slate-500 mt-1 block">{n.time}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
