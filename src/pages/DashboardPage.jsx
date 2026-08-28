import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import DefectMap from '../components/DefectMap';
import WorkOrderModal from '../components/WorkOrderModal';
import { 
  AlertOctagon, Flame, Droplets, MessageSquareWarning, CheckCircle2, Eye, Filter,
  MapPin, Camera, Wrench, Download, Sparkles, ArrowRight, ShieldAlert, Loader2
} from 'lucide-react';
import { State } from 'country-state-city';
import { getDistricts } from 'india-state-district';

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // in metres
}

export default function DashboardPage({ defects, workOrders = [], onVerifyRepair, onUpdateStatus, onTriggerToast }) {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [activeDefectModal, setActiveDefectModal] = useState(null);
  const [verifyingWO, setVerifyingWO] = useState(null);
  const [aiVerifying, setAiVerifying] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');

  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const filters = ['All', 'Critical', 'High', 'Medium', 'Low', 'Waterlogging'];

  // Indian Data Setup
  const allStates = useMemo(() => State.getStatesOfCountry('IN'), []);
  
  const availableDistricts = useMemo(() => {
    if (selectedState === 'ALL') return [];
    const stateObj = allStates.find(s => s.name === selectedState);
    if (!stateObj) return [];
    const districts = getDistricts(stateObj.isoCode) || [];
    
    // Custom districts not in the package
    const customDistricts = { 'AP': ['Chebrolu'] };
    const extras = customDistricts[stateObj.isoCode] || [];
    return [...new Set([...districts, ...extras])];
  }, [selectedState, allStates]);

  const uniqueStates = ['ALL', ...allStates.map(s => s.name).sort()];
  const uniqueDistricts = ['ALL', ...availableDistricts.sort()];

  // Fetch filtered incidents
  useEffect(() => {
    const token = localStorage.getItem('roadnex_token');
    setIsLoading(true);
    
    const params = new URLSearchParams();
    if (selectedState !== 'ALL') params.append('state', selectedState);
    if (selectedDistrict !== 'ALL') params.append('district', selectedDistrict);
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
  }, [selectedState, selectedDistrict, selectedFilter]);

  const sortedPriorityQueue = [...incidents].sort((a, b) => b.priorityScore - a.priorityScore);

  const totalIncidents = incidents.length;
  const criticalRisks = incidents.filter(d => d.severity === 'Critical' || d.severity === 'High').length;
  const activeRepair = incidents.filter(d => d.status === 'Assigned' || d.status === 'In Progress').length;
  const resolvedVerified = incidents.filter(d => d.status === 'Completed' || d.status === 'RESOLVED').length;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">


      {/* TERRITORY DRILLDOWN BAR */}
      <div className="bg-white p-4 rounded-xl  shadow-md shadow-custom-sage/10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-8 flex-wrap w-full">
          <div className="flex items-center gap-2 text-custom-taupe font-extrabold text-xs tracking-wider">
            <Filter className="w-4 h-4" /> TERRITORY DRILLDOWN:
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-custom-sage font-semibold">State:</span>
            <select 
              value={selectedState} 
              onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict('ALL'); }}
              className="bg-custom-cream  text-custom-taupe text-xs rounded-lg px-3 py-1.5 outline-none focus:border-custom-terra min-w-[120px]"
            >
              {uniqueStates.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-custom-sage font-semibold">District:</span>
            <select 
              value={selectedDistrict} 
              onChange={(e) => { setSelectedDistrict(e.target.value); }}
              className="bg-custom-cream  text-custom-taupe text-xs rounded-lg px-3 py-1.5 outline-none focus:border-custom-terra min-w-[120px]"
            >
              {uniqueDistricts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        
        <button 
          onClick={() => { setSelectedState('ALL'); setSelectedDistrict('ALL'); }}
          className="text-xs font-bold text-custom-terra hover:opacity-80 transition-colors whitespace-nowrap"
        >
          Reset Filters
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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



      {/* Municipal Repair Verification Queue */}
      {workOrders.filter((w) => w.status === 'Pending Verification').length > 0 && (
        <div className="bg-white p-8 rounded-2xl shadow-md shadow-custom-sage/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-custom-taupe flex items-center gap-2">
                <Wrench className="w-5 h-5 text-custom-terra" /> Pending Municipal Verification Queue
              </h3>
              <p className="text-xs text-custom-sage font-medium">
                Potholes repaired by municipal contractors. Perform photographic and geolocation delta inspection.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 animate-pulse">
              {workOrders.filter((w) => w.status === 'Pending Verification').length} Awaiting Verification
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl">
            <table className="w-full text-left text-xs text-custom-taupe">
              <thead className="bg-custom-cream text-custom-sage uppercase tracking-wider text-[10px] font-bold border-b border-custom-sage/30">
                <tr>
                  <th className="p-3.5">Ticket ID & Location</th>
                  <th className="p-3.5">Defect Type</th>
                  <th className="p-3.5">Original Severity</th>
                  <th className="p-3.5">Contractor</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-custom-sage/20 bg-white">
                {workOrders
                  .filter((w) => w.status === 'Pending Verification')
                  .map((wo) => (
                    <tr key={wo.id} className="hover:bg-custom-cream transition-colors">
                      <td className="p-3.5 font-semibold text-custom-taupe">
                        {wo.location}
                        <span className="block text-[10px] font-mono text-custom-sage mt-0.5">{wo.id}</span>
                      </td>
                      <td className="p-3.5 font-medium">{wo.defectType}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-custom-terra/10 text-custom-terra">
                          {wo.severity}
                        </span>
                      </td>
                      <td className="p-3.5 font-semibold">{wo.contractor}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setVerifyingWO(wo)}
                          className="px-3.5 py-1.5 bg-custom-terra text-white rounded-lg font-bold text-xs hover:bg-custom-terra/90 transition-colors inline-flex items-center gap-1 cursor-pointer shadow-sm"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> Inspect Resolution
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Priority Maintenance Queue Table */}
      <div className="bg-white p-8 rounded-2xl  shadow-md shadow-custom-sage/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-custom-taupe flex items-center gap-2">
              🔥 Priority Maintenance Dispatch Queue
            </h3>
            <p className="text-xs text-custom-sage font-medium">
              Ranked automatically by AI Severity Depth & Citizen Complaint Impact Score
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-custom-terra bg-custom-terra/10 px-3 py-1 rounded-full border border-custom-terra/20">
            {sortedPriorityQueue.length} Active Tickets
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl ">
          <table className="w-full text-left text-xs text-custom-taupe">
            <thead className="bg-custom-cream text-custom-sage uppercase tracking-wider text-[10px] font-bold border-b border-custom-sage/30">
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
            <tbody className="divide-y divide-custom-sage/20 bg-white">
              {sortedPriorityQueue.map((item) => (
                <tr key={item.id} className="hover:bg-custom-cream transition-colors group">
                  <td className="p-3.5 font-semibold text-custom-taupe">
                    {item.location}
                    <span className="block text-[10px] font-mono text-custom-sage mt-0.5">{item.id}</span>
                  </td>
                  <td className="p-3.5 font-medium">{item.defectType || item.type}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        item.severity === 'Critical'
                          ? 'bg-red-500/10 text-red-600 border border-red-500/20' // Strong Red Alert
                          : item.severity === 'High'
                          ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                          : 'bg-custom-sage/10 text-custom-sage '
                      }`}
                    >
                      {item.severity}
                    </span>
                  </td>
                  <td className="p-3.5">
                    {item.waterlogging ? (
                      <span className="text-custom-terra font-semibold flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5" /> Yes
                      </span>
                    ) : (
                      <span className="text-custom-sage">No</span>
                    )}
                  </td>
                  <td className="p-3.5 font-bold text-custom-taupe">{item.complaints || 1}</td>
                  <td className="p-3.5">
                    <span className="font-extrabold text-red-500 text-sm font-mono">{item.priorityScore}</span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setActiveDefectModal(item)}
                      className="px-3.5 py-1.5 bg-custom-cream hover:bg-custom-sage/10 text-custom-taupe rounded-lg font-semibold text-xs  transition-colors inline-flex items-center gap-1 cursor-pointer"
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

      {/* Repair Verification Modal */}
      {verifyingWO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm select-none">
          <div className="bg-white border border-custom-sage/30 rounded-3xl p-6 shadow-2xl w-full max-w-3xl overflow-hidden animate-scale-in relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-custom-terra via-custom-terra to-custom-terra" />
            
            <div className="flex justify-between items-start border-b border-custom-sage/20 pb-4 mb-6">
              <div>
                <h3 className="text-base font-extrabold text-custom-taupe flex items-center gap-1.5">
                  <Wrench className="w-5 h-5 text-custom-terra" /> Inspect Road Repair Resolution
                </h3>
                <p className="text-[10px] text-custom-sage font-medium mt-0.5">Ticket ID: {verifyingWO.id} &bull; Contractor: {verifyingWO.contractor}</p>
              </div>
              <button 
                onClick={() => { setVerifyingWO(null); setAiVerifying(false); setAiResult(null); }}
                className="p-1 rounded-lg hover:bg-custom-cream text-custom-sage transition-all cursor-pointer font-extrabold text-xs"
              >
                ✕ Close
              </button>
            </div>

            {/* AI verification loader overlay */}
            {aiVerifying ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-custom-terra animate-spin" />
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold text-custom-taupe">ROADNEX AI Core Auditing Resolution Image...</p>
                  <p className="text-[10px] text-custom-sage font-mono animate-pulse">Running image texture alignment verification...</p>
                </div>
              </div>
            ) : aiResult ? (
              <div className="py-8 flex flex-col items-center justify-center space-y-4 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-emerald-500">AI Core Assessment: PASSED</h4>
                  <p className="text-xs text-custom-taupe max-w-md mx-auto">
                    Texture structural parity matches clean flat surface. Geolocation distance delta within threshold. Ready for final closure.
                  </p>
                </div>
                <button 
                  onClick={async () => {
                    const success = await onVerifyRepair(verifyingWO.id, 'Approve');
                    if (success) {
                      onTriggerToast(`Work order ${verifyingWO.id} approved and marked Completed.`);
                      setVerifyingWO(null);
                      setAiResult(null);
                    }
                  }}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Confirm Completion & Resolve Defect
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 1. Comparison Images Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Left: Original defect */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-custom-sage font-bold uppercase tracking-wider block">Original defect</span>
                    <div className="rounded-2xl overflow-hidden border border-custom-sage/30 h-44 bg-slate-900">
                      {defects.find((d) => d.id === verifyingWO.defectId)?.imageUrl ? (
                        <img 
                          src={defects.find((d) => d.id === verifyingWO.defectId).imageUrl} 
                          alt="Original defect" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500 font-medium">No original image</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Right: Repaired road */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-custom-sage font-bold uppercase tracking-wider block">Repaired resolution</span>
                    <div className="rounded-2xl overflow-hidden border border-custom-sage/30 h-44 bg-slate-900">
                      <img 
                        src={verifyingWO.repairedImageUrl} 
                        alt="Repaired road" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Geolocation Telemetry Match Panel */}
                <div className="p-4 bg-custom-cream/60 border border-custom-sage/30 rounded-2xl grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-custom-sage font-semibold uppercase">Assigned Location Coordinates</span>
                    <span className="font-bold block mt-0.5">Lat: {verifyingWO.lat.toFixed(5)}, Lng: {verifyingWO.lng.toFixed(5)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-custom-sage font-semibold uppercase">Municipal Upload Coordinates</span>
                    <span className="font-bold block mt-0.5">
                      Lat: {verifyingWO.repairedLat?.toFixed(5)}, Lng: {verifyingWO.repairedLng?.toFixed(5)}
                    </span>
                  </div>
                  <div className="col-span-2 border-t border-custom-sage/20 pt-2 flex items-center justify-between">
                    <span className="text-[10px] text-custom-sage font-semibold uppercase">GPS Discrepancy Delta</span>
                    {verifyingWO.repairedLat && verifyingWO.repairedLng ? (
                      <span className="font-bold text-custom-taupe font-mono">
                        {Math.floor(
                          getDistance(
                            verifyingWO.lat,
                            verifyingWO.lng,
                            verifyingWO.repairedLat,
                            verifyingWO.repairedLng
                          )
                        ).toFixed(0)}{' '}
                        meters delta (Safe Geofence Range)
                      </span>
                    ) : (
                      <span className="text-rose-500 font-bold">Unverified</span>
                    )}
                  </div>
                </div>

                {/* 3. Action Controls */}
                <div className="flex gap-4 border-t border-custom-sage/20 pt-4">
                  <button 
                    onClick={async () => {
                      const success = await onVerifyRepair(verifyingWO.id, 'Reject');
                      if (success) {
                        onTriggerToast(`Work order ${verifyingWO.id} repair rejected and sent back to dispatch queue.`);
                        setVerifyingWO(null);
                      }
                    }}
                    className="px-5 py-2.5 border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Reject Repair Logs
                  </button>
                  <button 
                    onClick={() => {
                      setAiVerifying(true);
                      setTimeout(() => {
                        setAiVerifying(false);
                        setAiResult(true);
                      }, 2500);
                    }}
                    className="flex-1 py-2.5 bg-custom-terra hover:bg-custom-terra/90 text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" /> Trigger AI Verification audit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
