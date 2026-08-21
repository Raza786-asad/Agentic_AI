import React from 'react';
import { X, Wrench, AlertTriangle, Calendar, UserCheck, Shield, CheckCircle2 } from 'lucide-react';

export default function WorkOrderModal({ defect, onClose, onUpdateStatus }) {
  if (!defect) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                Work Order Details: <span className="text-cyan-400 font-mono">{defect.id}</span>
              </h3>
              <p className="text-[11px] text-slate-400">{defect.location}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs text-slate-300">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-medium block">Defect Type</span>
              <span className="font-bold text-white text-sm">{defect.type}</span>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-medium block">Severity Level</span>
              <span className="font-extrabold text-rose-400 text-sm">{defect.severity}</span>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-medium block">AI Priority Score</span>
              <span className="font-extrabold text-amber-400 text-lg">{defect.priorityScore} / 100</span>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-medium block">Citizen Complaints</span>
              <span className="font-bold text-cyan-400 text-lg">{defect.complaints} reports</span>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-800/80 pt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> Assigned Contractor:
              </span>
              <span className="font-semibold text-slate-200">ABC Infrastructure Works Ltd.</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Target Completion:
              </span>
              <span className="font-semibold text-slate-200">24 Aug 2026</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-400" /> Waterlogging Status:
              </span>
              <span className="font-semibold text-rose-400">
                {defect.waterlogging ? 'Yes (Drainage Seal Required)' : 'No Risk'}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Current Status: <strong className="text-cyan-400">{defect.status}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onUpdateStatus(defect.id, 'In Progress');
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 font-semibold text-xs transition-colors"
            >
              Start Work
            </button>
            <button
              onClick={() => {
                onUpdateStatus(defect.id, 'Completed');
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 font-semibold text-xs transition-colors flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
