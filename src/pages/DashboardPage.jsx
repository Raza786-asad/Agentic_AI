import React, { useState } from 'react';
import StatCard from '../components/StatCard';
import DefectMap from '../components/DefectMap';
import WorkOrderModal from '../components/WorkOrderModal';
import { 
  AlertOctagon, 
  Flame, 
  Droplets, 
  MessageSquareWarning, 
  CheckCircle2, 
  Eye, 
  Filter,
  ArrowUpDown,
  MapPin
} from 'lucide-react';

export default function DashboardPage({ defects, onUpdateStatus, onTriggerToast }) {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [activeDefectModal, setActiveDefectModal] = useState(null);

  const filters = ['All', 'Critical', 'High', 'Medium', 'Low', 'Waterlogging'];

  const sortedPriorityQueue = [...defects].sort((a, b) => b.priorityScore - a.priorityScore);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Urban Infrastructure Command Center
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time road condition monitoring, defect severity scoring, and automated priority dispatching.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Defects"
          value="238"
          trend="12.5% vs last month"
          trendUp={true}
          icon={AlertOctagon}
          colorTheme="cyan"
        />
        <StatCard
          title="Critical Issues"
          value="19"
          trend="3 new today"
          trendUp={false}
          icon={Flame}
          colorTheme="rose"
        />
        <StatCard
          title="Waterlogging Hotspots"
          value="34"
          trend="8 high risk"
          trendUp={false}
          icon={Droplets}
          colorTheme="orange"
        />
        <StatCard
          title="Open Complaints"
          value="126"
          trend="93% AI deduplicated"
          trendUp={true}
          icon={MessageSquareWarning}
          colorTheme="amber"
        />
        <StatCard
          title="Resolved This Month"
          value="182"
          trend="82% resolution rate"
          trendUp={true}
          icon={CheckCircle2}
          colorTheme="emerald"
        />
      </div>

      {/* Google Maps Live Road Defect Map */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" /> Google Maps Live Infrastructure Monitoring
            </h3>
            <p className="text-xs text-slate-400">
              Interactive Google Maps API satellite & vector map with real-time severity markers & location pins
            </p>
          </div>

          {/* Filter Toggles */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 overflow-x-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  selectedFilter === f
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[460px]">
          <DefectMap
            defects={defects}
            selectedFilter={selectedFilter}
            onSelectWorkOrder={setActiveDefectModal}
          />
        </div>
      </div>

      {/* Priority Maintenance Queue Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              🔥 Priority Maintenance Queue
            </h3>
            <p className="text-xs text-slate-400">
              Ranked by AI Severity & Citizen Complaint Impact Score
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">Location & ID</th>
                <th className="p-3">Defect Type</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Waterlogging</th>
                <th className="p-3">Complaints</th>
                <th className="p-3">Priority Score</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sortedPriorityQueue.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-semibold text-white">
                    {item.location}
                    <span className="block text-[10px] font-mono text-cyan-400 mt-0.5">{item.id}</span>
                  </td>
                  <td className="p-3 font-medium">{item.type}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        item.severity === 'Critical'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : item.severity === 'High'
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {item.severity}
                    </span>
                  </td>
                  <td className="p-3">
                    {item.waterlogging ? (
                      <span className="text-cyan-400 font-semibold flex items-center gap-1">
                        <Droplets className="w-3 h-3" /> Yes
                      </span>
                    ) : (
                      <span className="text-slate-500">No</span>
                    )}
                  </td>
                  <td className="p-3 font-bold text-slate-200">{item.complaints}</td>
                  <td className="p-3">
                    <span className="font-extrabold text-rose-400 text-sm">{item.priorityScore}</span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setActiveDefectModal(item)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 rounded-lg font-semibold text-xs border border-slate-700/80 transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Work Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Work Order Modal */}
      {activeDefectModal && (
        <WorkOrderModal
          defect={activeDefectModal}
          onClose={() => setActiveDefectModal(null)}
          onUpdateStatus={(id, status) => {
            onUpdateStatus(id, status);
            onTriggerToast(`Work order ${id} status updated to ${status}!`);
          }}
        />
      )}
    </div>
  );
}
