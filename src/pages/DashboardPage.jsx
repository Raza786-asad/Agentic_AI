import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import DefectMap from '../components/DefectMap';
import WorkOrderModal from '../components/WorkOrderModal';
import { 
  AlertOctagon, Flame, Droplets, MessageSquareWarning, CheckCircle2, Eye, Filter,
  MapPin, Camera, Wrench, Download, Sparkles, ArrowRight, ShieldAlert, Loader2
} from 'lucide-react';

export default function DashboardPage({ defects, onUpdateStatus, onTriggerToast }) {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [activeDefectModal, setActiveDefectModal] = useState(null);
  
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedCity, setSelectedCity] = useState('ALL');

  const [locations, setLocations] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const filters = ['All', 'Critical', 'High', 'Medium', 'Low', 'Waterlogging'];

  // 1. Fetch distinct locations
  useEffect(() => {
    const token = localStorage.getItem('roadnex_token');
    fetch('/api/reports/locations', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setLocations(data.locations);
      }
    })
    .catch(err => console.error('Failed to load locations', err));
  }, []);

  // 2. Fetch filtered incidents
  useEffect(() => {
    const token = localStorage.getItem('roadnex_token');
    setIsLoading(true);
    
    const params = new URLSearchParams();
    if (selectedState !== 'ALL') params.append('state', selectedState);
    if (selectedDistrict !== 'ALL') params.append('district', selectedDistrict);
    if (selectedCity !== 'ALL') params.append('city', selectedCity);
    if (selectedFilter !== 'All') params.append('severity', selectedFilter);

    fetch(`/api/reports?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setIncidents(data.reports);
      }
    })
    .catch(err => console.error('Failed to load incidents', err))
    .finally(() => setIsLoading(false));
  }, [selectedState, selectedDistrict, selectedCity, selectedFilter]);

  const sortedPriorityQueue = [...incidents].sort((a, b) => b.priorityScore - a.priorityScore);

  const totalIncidents = incidents.length;
  const criticalRisks = incidents.filter(d => d.severity === 'Critical' || d.severity === 'High').length;
  const activeRepair = incidents.filter(d => d.status === 'Assigned' || d.status === 'In Progress').length;
  const resolvedVerified = incidents.filter(d => d.status === 'Completed' || d.status === 'RESOLVED').length;

  // Extract unique locations for dropdowns
  const uniqueStates = ['ALL', ...new Set(locations.map(l => l.state).filter(Boolean))];
  const uniqueDistricts = ['ALL', ...new Set(locations.filter(l => selectedState === 'ALL' || l.state === selectedState).map(l => l.district).filter(Boolean))];
  const uniqueCities = ['ALL', ...new Set(locations.filter(l => (selectedState === 'ALL' || l.state === selectedState) && (selectedDistrict === 'ALL' || l.district === selectedDistrict)).map(l => l.city).filter(Boolean))];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="text-[10px] font-extrabold text-cyan-400 tracking-widest uppercase mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            National Oversight & Road Health Index
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            Ministry of Road Transport & Highways (MoRTH) Command
          </h1>
          <p className="text-xs text-slate-400 mt-2 max-w-2xl">
            Cross-state infrastructure telemetry, municipal compliance tracking, and automated AI quality audits.
          </p>
        </div>

        {/* Quick Launchpad Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-4 py-2 bg-slate-900 border border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-400 flex items-center gap-2 shadow-lg shadow-emerald-500/10">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            {uniqueStates.length - 1} States Online
          </div>
          <div className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-slate-300">
            {defects.length} Total Incidents
          </div>
        </div>
      </div>

      {/* TERRITORY DRILLDOWN BAR */}
      <div className="glass-panel p-4 rounded-xl border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap w-full">
          <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-xs tracking-wider">
            <Filter className="w-4 h-4" /> TERRITORY DRILLDOWN:
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">State:</span>
            <select 
              value={selectedState} 
              onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict('ALL'); setSelectedCity('ALL'); }}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 outline-none focus:border-cyan-500 min-w-[120px]"
            >
              {uniqueStates.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">District:</span>
            <select 
              value={selectedDistrict} 
              onChange={(e) => { setSelectedDistrict(e.target.value); setSelectedCity('ALL'); }}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 outline-none focus:border-cyan-500 min-w-[120px]"
            >
              {uniqueDistricts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">City:</span>
            <select 
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-slate-950 border border-cyan-500/50 text-cyan-100 text-xs font-bold rounded-lg px-3 py-1.5 outline-none focus:border-cyan-400 min-w-[120px]"
            >
              {uniqueCities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        
        <button 
          onClick={() => { setSelectedState('ALL'); setSelectedDistrict('ALL'); setSelectedCity('ALL'); }}
          className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors whitespace-nowrap"
        >
          Reset Filters
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="National Incidents"
          value={totalIncidents.toString()}
          trend="Cross-Agency Intake"
          trendUp={true}
          icon={AlertOctagon}
          colorTheme="cyan"
        />
        <StatCard
          title="Critical Road Risks"
          value={criticalRisks.toString()}
          trend="PriorityAI High Alert"
          trendUp={false}
          icon={Flame}
          colorTheme="rose"
        />
        <StatCard
          title="In Active Repair"
          value={activeRepair.toString()}
          trend="Contractor Workflows"
          trendUp={true}
          icon={Wrench}
          colorTheme="amber"
        />
        <StatCard
          title="Resolved & Verified"
          value={resolvedVerified.toString()}
          trend="93% Visual Proof QA"
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

        <div className="h-[460px] relative">
          {isLoading && (
            <div className="absolute inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
              <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
            </div>
          )}
          {incidents.length === 0 && !isLoading ? (
            <div className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center rounded-xl border border-slate-800">
              <MapPin className="w-12 h-12 text-slate-600 mb-3" />
              <p className="text-slate-300 font-semibold">No infrastructure incidents found.</p>
              <p className="text-xs text-slate-500 mt-1">Try expanding your territory or severity filters.</p>
            </div>
          ) : (
            <DefectMap
              defects={incidents}
              selectedFilter={selectedFilter}
              onSelectWorkOrder={setActiveDefectModal}
            />
          )}
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
                  <td className="p-3.5 font-medium">{item.defectType || item.type}</td>
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
                  <td className="p-3.5 font-bold text-slate-200">{item.complaints || 1}</td>
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
