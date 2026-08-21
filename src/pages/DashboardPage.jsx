import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  MapPin,
  Camera,
  Wrench,
  Download,
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export default function DashboardPage({ defects, onUpdateStatus, onTriggerToast }) {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [activeDefectModal, setActiveDefectModal] = useState(null);

  const filters = ['All', 'Critical', 'High', 'Medium', 'Low', 'Waterlogging'];

  const sortedPriorityQueue = [...defects].sort((a, b) => b.priorityScore - a.priorityScore);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            Urban Infrastructure Command Center
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono">
              v2.0 LIVE
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time road condition monitoring, AI defect severity scoring, and automated contractor dispatching.
          </p>
        </div>

        {/* Quick Launchpad Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => navigate('/analysis')}
            className="px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-100 rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" /> Snap Road Photo
          </button>
          <button
            onClick={() => navigate('/gis-map')}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold border border-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Google GIS Map
          </button>
          <button
            onClick={() => onTriggerToast('Exporting Infrastructure Telemetry Report (PDF)...')}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded-xl text-xs border border-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
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
      <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" /> Google Maps Live Infrastructure Monitoring
            </h3>
            <p className="text-xs text-slate-400">
              Interactive Google Maps API satellite & vector map with real-time severity markers & location pins
            </p>
          </div>

          {/* Filter Toggles */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 overflow-x-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedFilter === f
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-100 shadow-md'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
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
      <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              🔥 Priority Maintenance Dispatch Queue
            </h3>
            <p className="text-xs text-slate-400">
              Ranked automatically by AI Severity Depth & Citizen Complaint Impact Score
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            {sortedPriorityQueue.length} Active Tickets
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800/80">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Location & Ticket ID</th>
                <th className="p-3.5">Defect Type</th>
                <th className="p-3.5">Severity</th>
                <th className="p-3.5">Waterlogging</th>
                <th className="p-3.5">Complaints</th>
                <th className="p-3.5">Priority Score</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {sortedPriorityQueue.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="p-3.5 font-semibold text-slate-100">
                    {item.location}
                    <span className="block text-[10px] font-mono text-cyan-400 mt-0.5">{item.id}</span>
                  </td>
                  <td className="p-3.5 font-medium">{item.type}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        item.severity === 'Critical'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : item.severity === 'High'
                          ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {item.severity}
                    </span>
                  </td>
                  <td className="p-3.5">
                    {item.waterlogging ? (
                      <span className="text-cyan-400 font-semibold flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5" /> Yes
                      </span>
                    ) : (
                      <span className="text-slate-500">No</span>
                    )}
                  </td>
                  <td className="p-3.5 font-extrabold text-slate-200">{item.complaints}</td>
                  <td className="p-3.5">
                    <span className="font-extrabold text-rose-400 text-sm font-mono">{item.priorityScore}</span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setActiveDefectModal(item)}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 rounded-lg font-semibold text-xs border border-slate-700/80 transition-colors inline-flex items-center gap-1 cursor-pointer"
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
