import React, { useState } from 'react';
import { Wrench, Clock, CheckCircle2, UserCheck, AlertOctagon, Eye } from 'lucide-react';
import WorkOrderModal from '../components/WorkOrderModal';

export default function MaintenancePage({ workOrders, onUpdateStatus, onTriggerToast }) {
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);

  const columns = [
    { id: 'Pending', label: 'Pending Dispatch', color: 'border-rose-500/40 text-rose-400 bg-rose-500/10' },
    { id: 'Assigned', label: 'Contractor Assigned', color: 'border-orange-500/40 text-orange-400 bg-orange-500/10' },
    { id: 'In Progress', label: 'In Progress', color: 'border-blue-500/40 text-blue-400 bg-blue-500/10' },
    { id: 'Completed', label: 'Completed & Sealed', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Wrench className="w-7 h-7 text-cyan-400" /> Maintenance Work-Order Dispatch Kanban
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Track contractor assignment, budget allocation, and repair execution lifecycles in real-time.
        </p>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((col) => {
          const items = workOrders.filter((w) => w.status === col.id);
          return (
            <div key={col.id} className="space-y-4">
              {/* Column Header */}
              <div className={`p-3 rounded-xl border flex items-center justify-between ${col.color}`}>
                <span className="text-xs font-bold uppercase tracking-wider">{col.label}</span>
                <span className="w-5 h-5 rounded-full bg-slate-950/80 text-white font-extrabold text-[11px] flex items-center justify-center">
                  {items.length}
                </span>
              </div>

              {/* Work Order Cards Column */}
              <div className="space-y-3">
                {items.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                    No work orders in {col.label.toLowerCase()}
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="glass-panel p-4 rounded-xl border border-slate-800/80 space-y-3 hover:border-cyan-500/40 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-cyan-400 font-mono text-xs">{item.id}</span>
                        <span className="text-[10px] font-extrabold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                          Priority: {item.priorityScore}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-white text-xs">{item.defectType}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{item.location}</p>
                      </div>

                      <div className="text-[11px] space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-900">
                        <div className="flex justify-between text-slate-400">
                          <span>Contractor:</span>
                          <span className="text-slate-200 font-semibold">{item.contractor}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Completion:</span>
                          <span className="text-slate-200 font-medium">{item.targetCompletion}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Est. Cost:</span>
                          <span className="text-emerald-400 font-bold">{item.estimatedCost}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => setSelectedWorkOrder(item)}
                          className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                        {item.status !== 'Completed' && (
                          <button
                            onClick={() => {
                              const nextStatus = item.status === 'Pending' ? 'Assigned' : item.status === 'Assigned' ? 'In Progress' : 'Completed';
                              onUpdateStatus(item.defectId, nextStatus);
                              onTriggerToast(`Work Order ${item.id} moved to ${nextStatus}!`);
                            }}
                            className="py-1.5 px-3 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 rounded-lg text-xs font-semibold border border-cyan-500/30 transition-colors"
                          >
                            Advance ➔
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedWorkOrder && (
        <WorkOrderModal
          defect={{
            id: selectedWorkOrder.defectId,
            location: selectedWorkOrder.location,
            type: selectedWorkOrder.defectType,
            severity: selectedWorkOrder.priority,
            priorityScore: selectedWorkOrder.priorityScore,
            complaints: 14,
            waterlogging: true,
            status: selectedWorkOrder.status
          }}
          onClose={() => setSelectedWorkOrder(null)}
          onUpdateStatus={(id, status) => {
            onUpdateStatus(id, status);
            onTriggerToast(`Work Order ${id} updated to ${status}!`);
          }}
        />
      )}
    </div>
  );
}
