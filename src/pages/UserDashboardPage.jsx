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
import { motion } from 'framer-motion';

export default function UserDashboardPage({ complaints = [], currentUser, onTriggerToast }) {
  const navigate = useNavigate();

  // Filter complaints related to this citizen
  const citizenName = currentUser?.name || 'Rahul Sharma';
  const myComplaints = complaints.filter(c => 
    c.citizenName === citizenName || c.citizenName === 'Rahul Sharma' || c.isMyUpload
  );

  // Compute metrics
  const totalSubmitted = myComplaints.length;
  const pendingCount = myComplaints.filter(c => c.status === 'Reported').length;
  const verifiedCount = myComplaints.filter(c => c.status === 'Verified' || c.status === 'In Progress' || c.status?.includes('Merged') || c.status?.includes('Match')).length;
  const resolvedCount = myComplaints.filter(c => c.status === 'Resolved' || c.status?.includes('Completed')).length;

  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <motion.div 
      className="p-8 space-y-8 max-w-7xl mx-auto font-sans"
      variants={containerVars}
      initial="hidden"
      animate="show"
    >
      
      {/* Welcome Banner */}
      <motion.div variants={itemVars} className="glass-card p-8 rounded-3xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-8" style={{ background: 'rgba(255,255,255,0.8)', borderColor: 'rgba(163,160,147,0.3)' }}>
        <div className="space-y-1.5 z-10 text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-custom-sage/10  text-custom-sage text-xs font-bold">
            <UserCheck className="w-3.5 h-3.5" /> Citizen Hub Live
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-custom-taupe tracking-tight">
            Welcome Back, {citizenName}!
          </h1>
          <p className="text-xs text-custom-sage font-medium max-w-xl">
            You are logged into the ROADNEX Smart Infrastructure portal. Help keep Noida roads safe by reporting defects and tracking resolving actions.
          </p>
        </div>

        <button
          onClick={() => navigate('/user/report')}
          className="px-5 py-3 bg-custom-terra hover:opacity-90 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-custom-terra/20 flex items-center gap-2 transition-all cursor-pointer shrink-0 z-10"
        >
          <Camera className="w-4 h-4" /> Report New Road Defect
        </button>

        {/* Backdrop Ambient Light */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-custom-sage/10 rounded-full blur-[80px] pointer-events-none"></div>
      </motion.div>

      {/* Citizen Overview KPI Cards */}
      <motion.div variants={itemVars} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
          colorTheme="rose"
        />
        <StatCard
          title="Resolved Repairs"
          value={resolvedCount}
          trend="Work Completed"
          trendUp={true}
          icon={CheckCircle2}
          colorTheme="cyan"
        />
      </motion.div>

      {/* Main Actions Panel Grid */}
      <motion.div variants={itemVars} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Quick Actions Links Card */}
        <div className="bg-white p-8 rounded-2xl  shadow-md shadow-custom-sage/10 space-y-4 lg:col-span-1">
          <h3 className="text-sm font-bold text-custom-taupe">Portal Services</h3>
          <p className="text-[11px] text-custom-sage font-medium">Manage your reported logs or navigate city monitoring layers.</p>
          
          <div className="space-y-2.5 pt-2">
            <button 
              onClick={() => navigate('/user/report')} 
              className="w-full p-3.5 bg-custom-cream hover:bg-custom-sage/10 rounded-xl  hover:border-custom-sage/40 text-left flex items-center justify-between text-xs font-semibold group transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Camera className="w-4 h-4 text-custom-terra" />
                <div>
                  <span className="block text-custom-taupe">Analyze Road Quality</span>
                  <span className="block text-[10px] text-custom-sage font-medium">Use AI defect computer vision scan</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-custom-sage group-hover:text-custom-terra transition-colors" />
            </button>

            <button 
              onClick={() => navigate('/user/my-reports')} 
              className="w-full p-3.5 bg-custom-cream hover:bg-custom-sage/10 rounded-xl  hover:border-custom-sage/40 text-left flex items-center justify-between text-xs font-semibold group transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-custom-terra" />
                <div>
                  <span className="block text-custom-taupe">Track My Complaints</span>
                  <span className="block text-[10px] text-custom-sage font-medium">Check municipal resolution tickets</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-custom-sage group-hover:text-custom-terra transition-colors" />
            </button>

            <button 
              onClick={() => navigate('/user/map')} 
              className="w-full p-3.5 bg-custom-cream hover:bg-custom-sage/10 rounded-xl  hover:border-custom-sage/40 text-left flex items-center justify-between text-xs font-semibold group transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-custom-terra" />
                <div>
                  <span className="block text-custom-taupe">Interactive GIS Map</span>
                  <span className="block text-[10px] text-custom-sage font-medium">View regional pothole markers</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-custom-sage group-hover:text-custom-terra transition-colors" />
            </button>
          </div>
        </div>

        {/* Right: Citizen's Recent Reports Table */}
        <div className="bg-white p-8 rounded-2xl  shadow-md shadow-custom-sage/10 space-y-4 lg:col-span-2 text-left">
          <div className="flex items-center justify-between border-b border-custom-sage/20 pb-3">
            <div>
              <h3 className="text-sm font-bold text-custom-taupe">My Recent Filings</h3>
              <p className="text-[11px] text-custom-sage font-medium">History of tickets submitted from this account.</p>
            </div>
            <span className="text-[10px] font-mono bg-custom-sage/10 text-custom-sage  px-2.5 py-0.5 rounded-full">
              {myComplaints.length} Filed
            </span>
          </div>

          {myComplaints.length > 0 ? (
            <div className="overflow-x-auto rounded-xl ">
              <table className="w-full text-left text-xs text-custom-taupe">
                <thead className="bg-custom-cream text-custom-sage uppercase tracking-wider text-[9px] font-bold border-b border-custom-sage/30">
                  <tr>
                    <th className="p-3">Ticket ID</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Similarity Match</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-custom-sage/20 bg-white">
                  {myComplaints.map((c) => (
                    <tr key={c.id} className="hover:bg-custom-cream transition-colors">
                      <td className="p-3 font-mono font-bold text-custom-terra">{c.id}</td>
                      <td className="p-3 font-medium">
                        {c.location}
                        <span className="block text-[10px] text-custom-sage font-medium mt-0.5">{c.date}</span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          c.status?.includes('Duplicate') || c.status?.includes('Merged')
                            ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                            : c.status?.includes('Completed') || c.status === 'Resolved'
                            ? 'bg-custom-sage/10 text-custom-sage '
                            : 'bg-custom-taupe/10 text-custom-taupe border border-custom-taupe/20'
                        }`}>
                          {c.status || 'Reported'}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-custom-taupe font-bold">
                        {c.aiSimilarity ? `${c.aiSimilarity}%` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-48 rounded-xl bg-custom-cream  flex flex-col items-center justify-center space-y-2">
              <p className="text-xs text-custom-sage font-medium">No reported cases found on this ledger.</p>
              <button 
                onClick={() => navigate('/user/report')} 
                className="text-xs font-bold text-custom-terra hover:underline"
              >
                File your first complaint
              </button>
            </div>
          )}
        </div>

      </motion.div>

    </motion.div>
  );
}
