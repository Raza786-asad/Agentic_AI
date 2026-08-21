import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import { 
  Camera, 
  MapPin, 
  Settings, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export default function UserDashboardPage({ complaints = [], currentUser, onTriggerToast }) {
  const navigate = useNavigate();

  // Filter complaints related to this citizen
  const citizenName = currentUser?.name || 'Rahul Sharma';
  const myComplaints = complaints.filter(c => 
    c.citizenName === citizenName || c.citizenName === 'Rahul Sharma' || c.isMyUpload
  );

  // Compute metrics
  const totalSubmitted = myComplaints.length || 2;
  const pendingCount = myComplaints.filter(c => !c.status?.includes('Merged') && !c.status?.includes('Completed') && c.status !== 'Resolved').length || 1;
  const verifiedCount = myComplaints.filter(c => c.status?.includes('Match') || c.status === 'Verified' || c.status === 'In Progress').length || 1;
  const resolvedCount = myComplaints.filter(c => c.status === 'Resolved' || c.status?.includes('Completed')).length || 0;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto font-sans">
      
      {/* Welcome Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/40 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-1.5 z-10 text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <UserCheck className="w-3.5 h-3.5" /> Citizen Hub Live
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
            Welcome Back, {citizenName}!
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            You are logged into the ROADNEX Smart Infrastructure portal. Help keep Noida roads safe by reporting defects and tracking resolving actions.
          </p>
        </div>

        <button
          onClick={() => navigate('/user/report')}
          className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-100 rounded-xl text-xs font-extrabold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer shrink-0 z-10"
        >
          <Camera className="w-4 h-4" /> Report New Road Defect
        </button>

        {/* Backdrop Ambient Light */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>
      </div>

      {/* Citizen Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Reports Submitted"
          value={totalSubmitted}
          trend="Citizen Ledger"
          trendUp={true}
          icon={FileText}
          colorTheme="emerald"
        />
        <StatCard
          title="Pending Audits"
          value={pendingCount}
          trend="Under AI Review"
          trendUp={false}
          icon={Clock}
          colorTheme="amber"
        />
        <StatCard
          title="Verified Road Defects"
          value={verifiedCount}
          trend="Active Tickets"
          trendUp={true}
          icon={AlertTriangle}
          colorTheme="orange"
        />
        <StatCard
          title="Resolved Repairs"
          value={resolvedCount}
          trend="Work Completed"
          trendUp={true}
          icon={CheckCircle2}
          colorTheme="cyan"
        />
      </div>

      {/* Main Actions Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Quick Actions Links Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/10 space-y-4 shadow-xl lg:col-span-1">
          <h3 className="text-sm font-bold text-slate-200">Portal Services</h3>
          <p className="text-[11px] text-slate-400">Manage your reported logs or navigate city monitoring layers.</p>
          
          <div className="space-y-2.5 pt-2">
            <button 
              onClick={() => navigate('/user/report')} 
              className="w-full p-3.5 bg-slate-950/80 hover:bg-slate-900 rounded-xl border border-slate-900 hover:border-slate-800 text-left flex items-center justify-between text-xs font-semibold group transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Camera className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="block text-slate-200">Analyze Road Quality</span>
                  <span className="block text-[10px] text-slate-500 font-medium">Use AI defect computer vision scan</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
            </button>

            <button 
              onClick={() => navigate('/user/my-reports')} 
              className="w-full p-3.5 bg-slate-950/80 hover:bg-slate-900 rounded-xl border border-slate-900 hover:border-slate-800 text-left flex items-center justify-between text-xs font-semibold group transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="block text-slate-200">Track My Complaints</span>
                  <span className="block text-[10px] text-slate-500 font-medium">Check municipal resolution tickets</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
            </button>

            <button 
              onClick={() => navigate('/user/map')} 
              className="w-full p-3.5 bg-slate-950/80 hover:bg-slate-900 rounded-xl border border-slate-900 hover:border-slate-800 text-left flex items-center justify-between text-xs font-semibold group transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="block text-slate-200">Interactive GIS Map</span>
                  <span className="block text-[10px] text-slate-500 font-medium">View regional pothole markers</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
            </button>
          </div>
        </div>

        {/* Right: Citizen's Recent Reports Table */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/10 space-y-4 shadow-xl lg:col-span-2 text-left">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-200">My Recent Filings</h3>
              <p className="text-[11px] text-slate-400">History of tickets submitted from this account.</p>
            </div>
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              {myComplaints.length} Filed
            </span>
          </div>

          {myComplaints.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-900">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[9px] font-bold border-b border-slate-900">
                  <tr>
                    <th className="p-3">Ticket ID</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Similarity Match</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 bg-slate-950/20">
                  {myComplaints.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="p-3 font-mono font-bold text-emerald-400">{c.id}</td>
                      <td className="p-3 font-medium">
                        {c.location}
                        <span className="block text-[10px] text-slate-500 mt-0.5 font-sans font-normal">{c.date}</span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          c.status?.includes('Duplicate') || c.status?.includes('Merged')
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                            : c.status?.includes('Completed') || c.status === 'Resolved'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                            : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20'
                        }`}>
                          {c.status || 'Reported'}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-400">
                        {c.aiSimilarity ? `${c.aiSimilarity}%` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-48 rounded-xl bg-slate-950/60 border border-slate-900 flex flex-col items-center justify-center space-y-2">
              <p className="text-xs text-slate-500">No reported cases found on this ledger.</p>
              <button 
                onClick={() => navigate('/user/report')} 
                className="text-xs font-bold text-emerald-400 hover:underline"
              >
                File your first complaint
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
