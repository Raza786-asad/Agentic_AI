import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, ArrowRight, ShieldCheck, MapPin, Activity, Camera,
  AlertOctagon, Sparkles, Layers, Cpu, GitCommit, CheckCircle2,
  Droplets, Navigation, ExternalLink, ChevronRight, Zap,
  BarChart3, Shield, TrendingUp, Clock, Users, Star, Menu, X, Loader2, Wrench
} from 'lucide-react';
/* ─── Haversine Distance Utility ─── */
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

/* ─── Animated Counter ─── */
function AnimatedCounter({ target, suffix = '', duration = 1800 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const isDecimal = String(target).includes('.');
        const numericTarget = parseFloat(target);
        const timer = setInterval(() => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = eased * numericTarget;
          setCount(isDecimal ? current.toFixed(1) : Math.floor(current));
          if (progress >= 1) clearInterval(timer);
        }, 16);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Feature Card ─── */
function FeatureCard({ icon: Icon, title, desc, accent = 'cyan', delay = 0 }) {
  const colors = {
    cyan:    { bg: 'rgba(230,98,64,0.1)',   border: 'rgba(230,98,64,0.25)',  text: '#e66240' },
    emerald: { bg: 'rgba(163,160,147,0.1)', border: 'rgba(163,160,147,0.25)', text: '#a3a093' },
    violet:  { bg: 'rgba(55,65,81,0.1)',    border: 'rgba(55,65,81,0.25)',    text: '#374151' },
    amber:   { bg: 'rgba(249,246,239,0.5)', border: 'rgba(163,160,147,0.25)', text: '#e66240' },
  };
  const c = colors[accent] || colors.cyan;

  return (
    <div
      className="animate-fade-up card-premium p-6 group cursor-default"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
        style={{ background: c.bg, border: `1px solid ${c.border}` }}
      >
        <Icon size={20} style={{ color: c.text }} />
      </div>
      <h3 className="font-display font-bold text-sm text-custom-taupe mb-2">{title}</h3>
      <p className="text-[12px] text-custom-sage leading-relaxed">{desc}</p>
    </div>
  );
}

/* ─── Step Card ─── */
function StepCard({ num, title, desc, isLast, delay = 0 }) {
  return (
    <div className="animate-fade-up flex flex-col items-center text-center relative" style={{ animationDelay: `${delay}ms` }}>
      <div className="relative mb-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'rgba(230,98,64,0.1)', border: '1px solid rgba(230,98,64,0.3)', boxShadow: '0 8px 24px rgba(230,98,64,0.15)' }}>
          <span className="font-mono font-black text-lg text-custom-terra">{num}</span>
        </div>
      </div>
      {!isLast && (
        <div className="hidden lg:block absolute left-full top-7 w-full h-0.5 bg-gradient-to-r from-custom-terra/30 to-transparent -translate-y-1/2 z-0" style={{ width: 'calc(100% - 56px)', left: '50%' }} />
      )}
      <h4 className="font-display font-bold text-sm text-custom-taupe mb-1">{title}</h4>
      <p className="text-[11px] text-custom-sage leading-relaxed max-w-[140px]">{desc}</p>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userLoc, setUserLoc] = useState(null);
  const [liveReports, setLiveReports] = useState([]);
  const [liveStats, setLiveStats] = useState({ queue: 0, highestRisk: 'Low', majorAlert: null });

  useEffect(() => {
    // 1. Get User Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log('Geolocation denied/failed', err)
      );
    }

    // 2. Fetch Live Telemetry Data
    const fetchLive = async () => {
      try {
        const res = await fetch('/api/reports/public-live');
        const data = await res.json();
        if (data.success) {
          setLiveReports(data.reports);
          
          const queue = data.reports.length;
          let highestScore = 0;
          let major = null;

          data.reports.forEach(r => {
            if (r.priority_score > highestScore) {
              highestScore = r.priority_score;
              major = r;
            }
          });

          setLiveStats({
            queue,
            highestRisk: highestScore >= 80 ? 'High Alert' : highestScore >= 50 ? 'Moderate' : 'Low',
            majorAlert: major
          });
        }
      } catch (err) {
        console.error('Failed to fetch live telemetry', err);
      }
    };

    fetchLive();
    const interval = setInterval(fetchLive, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const livePins = React.useMemo(() => {
    if (!liveReports || liveReports.length === 0) {
      return [
        { top: '32%', left: '24%', color: 'rose',   label: 'Pothole (98%)' },
        { top: '65%', left: '50%', color: 'orange', label: 'Road Crack' },
        { top: '22%', right: '22%', color: 'cyan',  label: 'Flood Hotspot', ping: true },
        { top: '50%', left: '15%', color: 'violet', label: 'Structural Risk' },
      ];
    }
    const topReports = [...liveReports].slice(0, 4);
    return topReports.map((r, i) => {
      let top = '50%';
      let left = '50%';
      let distance = '';
      
      if (userLoc && r.lat && r.lng) {
        const distKm = getDistance(userLoc.lat, userLoc.lng, r.lat, r.lng);
        distance = distKm < 1 ? '<1km' : distKm.toFixed(1) + 'km';
        const scale = 5; 
        const dLat = r.lat - userLoc.lat;
        const dLng = r.lng - userLoc.lng;
        top = `${50 - (dLat * 111 * scale)}%`;
        left = `${50 + (dLng * 111 * Math.cos(userLoc.lat * Math.PI/180) * scale)}%`;
        
        top = `${Math.max(10, Math.min(85, parseFloat(top)))}%`;
        left = `${Math.max(10, Math.min(85, parseFloat(left)))}%`;
      } else {
         const staticPos = [{top:'32%', left:'24%'}, {top:'65%', left:'50%'}, {top:'22%', left:'78%'}, {top:'50%', left:'15%'}];
         top = staticPos[i % 4].top;
         left = staticPos[i % 4].left;
      }
  
      let color = 'cyan';
      if (r.severity === 'High' || r.priority_score > 70) color = 'rose';
      else if (r.severity === 'Medium') color = 'orange';
  
      return {
        top, left, color,
        label: `${r.defect_type}${distance ? ' ('+distance+')' : ''}`,
        ping: r.id === liveStats.majorAlert?.id
      }
    });
  }, [liveReports, userLoc, liveStats.majorAlert]);

  const features = [
    { title: 'AI Road Defect Detection',     desc: 'Real-time classification of potholes, cracks, and structural wear using computer vision.',      icon: Cpu,              accent: 'cyan' },
    { title: 'Pothole & Structural Analysis', desc: 'Automatically calculates area, depth, and volume from citizen snapshots.',                       icon: AlertOctagon,     accent: 'violet' },
    { title: 'Severity Estimation',           desc: 'Estimates structural risks and flags high-impact anomalies to civil engineers.',                  icon: Activity,         accent: 'amber' },
    { title: 'GIS-Based Mapping',             desc: 'Pins location coordinates dynamically over interactive Google Maps layers.',                       icon: MapPin,           accent: 'emerald' },
    { title: 'Waterlogging Correlation',      desc: 'Combines rainfall metrics and defect maps to identify flooding hotspots in real-time.',           icon: Droplets,         accent: 'cyan' },
    { title: 'Duplicate Complaint Filter',    desc: 'Uses AI clustering with 90%+ similarity to automatically group duplicate citizen reports.',       icon: Layers,           accent: 'violet' },
    { title: 'Priority Scoring Queue',        desc: 'Algorithms auto-rank issues 0–100 based on severity, traffic volume, and risk impact.',           icon: Sparkles,         accent: 'amber' },
    { title: 'Automated Work Orders',         desc: 'Generates dispatch orders instantly for city engineering departments upon ticket validation.',     icon: GitCommit,        accent: 'emerald' },
    { title: 'Contractor Workflows',          desc: 'Track maintenance status transparently across all external repair contractors.',                   icon: Navigation,       accent: 'cyan' },
    { title: 'Repair Verification',           desc: 'Post-repair photographic AI analysis to close tickets with full validation checks.',              icon: CheckCircle2,     accent: 'violet' },
  ];

  const steps = [
    { num: '01', title: 'Citizen Report',   desc: 'Upload defect photo & lock GPS location' },
    { num: '02', title: 'AI Scanning',      desc: 'Image classified for defect type & size' },
    { num: '03', title: 'Priority Score',   desc: 'Risk computed based on traffic & flooding' },
    { num: '04', title: 'Work Order',       desc: 'Admin validates & dispatches repair team' },
    { num: '05', title: 'Contractor Fix',   desc: 'Assigned contractor completes field repair' },
    { num: '06', title: 'AI Verification',  desc: 'System confirms restoration & closes ticket' },
  ];

  const stats = [
    { label: 'AI Detection Precision', value: '96.4', suffix: '%', icon: Cpu,       accent: '#06b6d4' },
    { label: 'Avg Dispatch Time',      value: '42',   suffix: 'min', icon: Clock,   accent: '#8b5cf6' },
    { label: 'Issues Resolved',        value: '8400', suffix: '+',  icon: TrendingUp, accent: '#10b981' },
    { label: 'Active Cities',          value: '12',   suffix: '',   icon: Building2,  accent: '#f59e0b' },
  ];



  return (
    <div className="min-h-screen text-custom-taupe flex flex-col relative overflow-hidden" style={{ backgroundColor: '#f9f6ef' }}>

      {/* ── BACKGROUND ORBS ── */}
      <div className="absolute w-[700px] h-[700px] -top-48 -left-48 pointer-events-none rounded-full blur-[120px] opacity-20" style={{ background: '#a3a093' }} />
      <div className="absolute w-[600px] h-[600px] top-1/2 -right-48 pointer-events-none rounded-full blur-[120px] opacity-10" style={{ background: '#e66240' }} />
      <div className="absolute w-[500px] h-[500px] bottom-0 left-1/3 pointer-events-none rounded-full blur-[120px] opacity-15" style={{ background: '#374151' }} />
      <div className="bg-grid absolute inset-0 pointer-events-none opacity-40" />

      {/* ══════════════ HEADER ══════════════ */}
      <header className={`h-18 px-6 lg:px-12 flex items-center justify-between sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-custom-sage/30 shadow-xl shadow-custom-taupe/5' : 'bg-transparent'
      }`} style={{ height: '72px' }}>

        {/* Brand */}
        <div className="flex flex-col gap-0.5 animate-fade-down pt-2">
          <img src="/logo.png" alt="ROADNEX" className="h-12 object-contain" />
          <p className="text-[10px] text-custom-sage font-medium">Smart Infrastructure AI</p>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 animate-fade-down delay-100">
          {[['Home', null], ['About', 'about'], ['How It Works', 'how-it-works'], ['Features', 'features'], ['Portals', 'portals']].map(([label, id]) => (
            <button
              key={label}
              onClick={() => {
                if (id) {
                  scrollTo(id);
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="text-xs font-semibold text-custom-sage hover:text-custom-terra transition-all duration-200 cursor-pointer"
            >
              {label}
            </button>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3 animate-fade-down delay-200">
          <button
            onClick={() => navigate('/login')}
            className="text-xs py-2 px-4 rounded-xl text-custom-taupe hover:bg-black/5 transition-all font-bold"
          >
            Citizen Sign In
          </button>
          <button
            onClick={() => navigate('/admin/login')}
            className="text-xs py-2 px-4 rounded-xl text-white font-bold flex items-center gap-1.5 transition-all"
            style={{ background: '#374151' }}
          >
            Admin Panel <ArrowRight size={14} />
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button className="md:hidden text-custom-taupe" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden glass border-b border-white/5 px-6 py-4 space-y-2 sticky top-[72px] z-40 animate-fade-down">
          {['About', 'How It Works', 'Features', 'Portals'].map(label => (
            <button key={label} onClick={() => scrollTo(label.toLowerCase().replace(/ /g, '-'))}
              className="block w-full text-left text-sm font-semibold text-slate-300 py-2 hover:text-white">
              {label}
            </button>
          ))}
          <div className="flex gap-3 pt-2">
            <button onClick={() => navigate('/login')} className="btn-ghost text-xs py-2 px-4 rounded-xl flex-1">Sign In</button>
            <button onClick={() => navigate('/admin/login')} className="btn-primary text-xs py-2 px-4 rounded-xl flex-1" style={{animationDuration:'0s'}}>Admin</button>
          </div>
        </div>
      )}

      <main className="flex-1">

        {/* ══════════════ HERO ══════════════ */}
        <section className="relative px-6 lg:px-12 pt-16 pb-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left: Headline */}
            <div className="lg:col-span-7 space-y-8">
              <div className="animate-fade-up">

                <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight mt-4">
                  <span className="text-custom-taupe">Smarter</span>{' '}
                  <span className="text-custom-taupe">Roads.</span>
                  <br />
                  <span className="text-custom-terra">Faster Response.</span>
                  <br />
                  <span className="text-custom-taupe">Safer Cities.</span>
                </h1>
              </div>

              <p className="animate-fade-up delay-200 text-custom-sage text-base leading-relaxed max-w-xl font-medium">
                ROADNEX leverages <span className="text-custom-terra font-bold">computer vision AI</span>, GIS mapping, and predictive prioritization to monitor road degradation, flag waterlogging hazards, and automate municipal maintenance dispatch loops.
              </p>

              <div className="animate-fade-up delay-300 flex flex-wrap gap-4">
                <button onClick={() => navigate('/login')} className="text-sm py-3 px-6 rounded-xl text-white font-bold flex items-center gap-2 transition-all hover:-translate-y-0.5" style={{ background: '#e66240', boxShadow: '0 8px 24px rgba(230,98,64,0.3)' }}>
                  <Camera size={16} /> Report a Road Issue
                </button>
                <button onClick={() => scrollTo('features')} className="text-sm py-3 px-6 rounded-xl text-custom-taupe font-bold flex items-center gap-2 transition-all hover:bg-black/5 border border-custom-sage/30">
                  Explore ROADNEX <ChevronRight size={16} />
                </button>
              </div>


            </div>

            {/* Right: Live Telemetry Card */}
            <div className="lg:col-span-5 animate-fade-right delay-300">
              <div className="glass-card rounded-3xl p-6 relative overflow-hidden animate-float" style={{ background: 'rgba(255,255,255,0.8)', borderColor: 'rgba(163,160,147,0.3)' }}>
                {/* Glow accent */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-custom-terra to-transparent" />

                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-custom-terra animate-pulse" />
                    <p className="text-xs font-mono font-bold text-custom-taupe">TELEMETRY MONITOR: ACTIVE</p>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider" style={{ background: 'rgba(163,160,147,0.1)', color: '#a3a093', border: '1px solid rgba(163,160,147,0.3)' }}>GPS LOCKED</span>
                </div>

                {/* Animated Map */}
                <div className="h-60 rounded-2xl bg-white border border-custom-sage/30 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #a3a093 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                  {/* Road lines */}
                  <div className="absolute w-[3px] h-full bg-custom-sage/20 left-1/3" />
                  <div className="absolute w-[3px] h-full bg-custom-sage/20 left-2/3" />
                  <div className="absolute h-[3px] w-full bg-custom-sage/20 top-1/2" />
                  <div className="absolute h-[3px] w-full bg-custom-sage/20 top-1/4" />
                  {/* Scanner Area */}
                  <div className="absolute left-0 right-0 h-32 animate-scanline pointer-events-none" style={{
                    background: 'linear-gradient(to bottom, transparent, rgba(230,98,64,0.02) 40%, rgba(230,98,64,0.1) 80%, rgba(230,98,64,0.3) 100%)',
                    borderBottom: '2px solid rgba(230,98,64,0.6)',
                    boxShadow: '0 4px 16px rgba(230,98,64,0.1)'
                  }} />
                  {/* Pins */}
                  {livePins.map((pin, i) => {
                    const colorMap = {
                      rose:   { border: '#e66240', bg: 'rgba(230,98,64,0.15)',   text: '#e66240', dot: '#e66240' },
                      orange: { border: '#e66240', bg: 'rgba(230,98,64,0.15)',  text: '#e66240', dot: '#e66240' },
                      cyan:   { border: '#a3a093', bg: 'rgba(163,160,147,0.15)',   text: '#a3a093', dot: '#a3a093' },
                      violet: { border: '#374151', bg: 'rgba(55,65,81,0.15)', text: '#374151', dot: '#374151' },
                    };
                    const c = colorMap[pin.color];
                    return (
                      <div key={i} className="absolute flex flex-col items-center hover:scale-110 transition-transform duration-300 cursor-default" style={{ top: pin.top, left: pin.left, right: pin.right, zIndex: 10 }}>
                        <div className="w-5 h-5 rounded-full flex items-center justify-center relative shadow-sm"
                          style={{ background: c.bg, border: `2px solid ${c.border}`, boxShadow: `0 0 0 4px ${c.bg}` }}>
                          <span className="w-2 h-2 rounded-full" style={{ background: c.dot }} />
                          {pin.ping && (
                            <span className="absolute inset-0 rounded-full animate-radar-ping" style={{ border: `2px solid ${c.dot}` }} />
                          )}
                        </div>
                        <span className="text-[8px] px-2 py-1 mt-2.5 rounded font-mono whitespace-nowrap font-bold shadow-sm"
                          style={{ background: 'rgba(249,246,239,0.95)', border: `1px solid ${c.border}`, color: c.text, boxShadow: `0 2px 8px ${c.bg}` }}>
                          {pin.label}
                        </span>
                      </div>
                    );
                  })}
                  <p className="text-[9px] text-custom-sage font-mono absolute bottom-2.5 right-3 select-none z-10">AI Vector Layer</p>
                </div>

                {/* Major Alert Section */}
                {liveStats.majorAlert && userLoc && (
                  <div className="mt-4 p-3 rounded-xl flex flex-col gap-1 border animate-fade-in" style={{ backgroundColor: 'rgba(230,98,64,0.05)', borderColor: 'rgba(230,98,64,0.2)' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <AlertOctagon size={14} className="text-custom-terra animate-pulse" />
                        <span className="text-xs font-bold text-custom-taupe">MAJOR HAZARD NEARBY</span>
                      </div>
                      <span className="text-[10px] font-mono text-custom-terra font-bold border border-custom-terra/30 px-2 py-0.5 rounded bg-custom-terra/10">
                        {liveStats.majorAlert.priority_score > 80 ? 'CRITICAL RISK' : 'HIGH RISK'}
                      </span>
                    </div>
                    <p className="text-[11px] text-custom-sage mt-1 font-medium">
                      {liveStats.majorAlert.defect_type} detected 
                      <strong className="text-custom-terra ml-1">
                        {getDistance(userLoc.lat, userLoc.lng, liveStats.majorAlert.lat, liveStats.majorAlert.lng).toFixed(1)} km
                      </strong> away.
                    </p>
                  </div>
                )}

                {/* Mini Stats */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    { label: 'AI Queue', value: `${liveStats.queue} Active`, accent: '#e66240' },
                    { label: 'Risk Level', value: liveStats.highestRisk, accent: liveStats.highestRisk === 'High Alert' ? '#e66240' : '#a3a093' },
                    { label: 'Dispatch ETA', value: liveStats.queue > 0 ? '38 min' : '0 min', accent: '#a3a093' },
                  ].map((s, i) => (
                    <div key={i} className="bg-white p-3 rounded-xl border border-custom-sage/30">
                      <p className="text-[9px] text-custom-sage uppercase tracking-wide font-bold">{s.label}</p>
                      <p className="font-mono font-bold text-xs mt-0.5" style={{ color: s.accent }}>{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════ PORTALS ══════════════ */}
        <section id="portals" className="relative px-6 lg:px-12 py-20 border-y border-custom-sage/30">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(249,246,239,0) 0%, rgba(163,160,147,0.1) 100%)' }} />
          <div className="max-w-5xl mx-auto relative">
            <div className="text-center mb-14">
              <p className="text-[10px] px-3 py-1.5 mb-4 mx-auto inline-flex items-center gap-2 rounded-full font-bold uppercase tracking-wider" style={{ background: 'rgba(163,160,147,0.1)', color: '#374151', border: '1px solid rgba(163,160,147,0.3)' }}>Platform Access</p>
              <h2 className="font-display font-black text-4xl sm:text-5xl text-custom-taupe mb-3">
                Choose Your Portal
              </h2>
              <p className="text-custom-sage text-sm max-w-md mx-auto font-medium">
                Connect as a reporting citizen or city management supervisor. Each portal is tailored with role-specific tools.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Citizen Portal */}
              <div className="animate-fade-left card-premium p-8 group relative overflow-hidden flex flex-col justify-between" style={{ background: 'rgba(255,255,255,0.7)', borderColor: 'rgba(163,160,147,0.3)' }}>
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-custom-terra to-transparent opacity-60" />
                <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full transition-colors duration-500" style={{ background: 'rgba(230,98,64,0.05)' }} />
                <div className="relative z-10 space-y-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ background: 'rgba(230,98,64,0.1)', border: '1px solid rgba(230,98,64,0.2)' }}>
                    <Camera size={24} className="text-custom-terra" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display font-bold text-xl text-custom-taupe">Citizen Portal</h3>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider" style={{ background: 'rgba(230,98,64,0.1)', color: '#e66240', border: '1px solid rgba(230,98,64,0.3)' }}>Public</span>
                    </div>
                    <p className="text-sm text-custom-sage leading-relaxed font-medium">
                      Snap road issues, record GPS pin logs, file official infrastructure complaints, and monitor repair status in real-time.
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {['AI-powered road defect analysis', 'GPS-tagged complaint filing', 'Live repair status tracking'].map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-xs text-custom-taupe font-medium">
                        <CheckCircle2 size={13} className="text-custom-terra shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => navigate('/login')}
                    className="w-full py-3.5 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 text-white hover:-translate-y-1 cursor-pointer"
                    style={{ background: '#e66240', boxShadow: '0 8px 24px rgba(230,98,64,0.25)' }}
                  >
                    Enter Citizen Portal <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Municipal Staff Portal */}
              <div className="animate-fade-up delay-75 card-premium p-8 group relative overflow-hidden flex flex-col justify-between" style={{ background: 'rgba(255,255,255,0.7)', borderColor: 'rgba(163,160,147,0.3)' }}>
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-custom-terra to-transparent opacity-60" />
                <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full transition-colors duration-500" style={{ background: 'rgba(230,98,64,0.05)' }} />
                <div className="relative z-10 space-y-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ background: 'rgba(230,98,64,0.1)', border: '1px solid rgba(230,98,64,0.2)' }}>
                    <Wrench size={24} className="text-custom-terra" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display font-bold text-xl text-custom-taupe">Municipal Staff</h3>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider" style={{ background: 'rgba(230,98,64,0.1)', color: '#e66240', border: '1px solid rgba(230,98,64,0.3)' }}>Agency</span>
                    </div>
                    <p className="text-sm text-custom-sage leading-relaxed font-medium">
                      Claim dispatched maintenance orders, upload photographic resolution proof, and verify physical repair coordinates.
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {['Assigned ticket operation maps', 'Integrated GPS verification checks', 'Photo resolution upload logs'].map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-xs text-custom-taupe font-medium">
                        <CheckCircle2 size={13} className="text-custom-terra shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => navigate('/municipal/login')}
                    className="w-full py-3.5 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 text-white hover:-translate-y-1 cursor-pointer"
                    style={{ background: '#e66240', boxShadow: '0 8px 24px rgba(230,98,64,0.25)' }}
                  >
                    Enter Contractor Portal <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Admin Portal */}
              <div className="animate-fade-right delay-150 card-premium p-8 group relative overflow-hidden flex flex-col justify-between" style={{ background: 'rgba(255,255,255,0.7)', borderColor: 'rgba(163,160,147,0.3)' }}>
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-custom-taupe to-transparent opacity-60" />
                <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full transition-colors duration-500" style={{ background: 'rgba(55,65,81,0.05)' }} />
                <div className="relative z-10 space-y-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ background: 'rgba(55,65,81,0.1)', border: '1px solid rgba(55,65,81,0.2)' }}>
                    <Shield size={24} className="text-custom-taupe" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display font-bold text-xl text-custom-taupe">Command Center</h3>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider" style={{ background: 'rgba(55,65,81,0.1)', color: '#374151', border: '1px solid rgba(55,65,81,0.3)' }}>Admin Only</span>
                    </div>
                    <p className="text-sm text-custom-sage leading-relaxed font-medium">
                      Analyze city-wide heatmaps, inspect automated dispatch work orders, monitor contractor SLAs, and verify resolved issues.
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {['City-wide defect heatmap & GIS', 'Verify municipal repair logs', 'Manage active contractor queues'].map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-xs text-custom-taupe font-medium">
                        <CheckCircle2 size={13} className="text-custom-taupe shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => navigate('/admin/login')}
                    className="w-full py-3.5 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 text-white hover:-translate-y-1 cursor-pointer"
                    style={{ background: '#374151', boxShadow: '0 8px 24px rgba(55,65,81,0.25)' }}
                  >
                    Enter Command Center <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════ HOW IT WORKS ══════════════ */}
        <section id="how-it-works" className="px-6 lg:px-12 py-24 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] px-3 py-1.5 mb-4 mx-auto inline-flex items-center gap-2 rounded-full font-bold uppercase tracking-wider" style={{ background: 'rgba(230,98,64,0.1)', color: '#e66240', border: '1px solid rgba(230,98,64,0.3)' }}>The Process</span>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-custom-taupe mb-3">
              Municipal Maintenance Loop
            </h2>
            <p className="text-custom-sage text-sm max-w-md mx-auto font-medium">
              Our automated system bridges the gap between citizen detection and verified engineer closure — fully tracked at every step.
            </p>
          </div>

          <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-7 left-[calc(100%/12)] right-[calc(100%/12)] h-0.5"
              style={{ background: 'linear-gradient(90deg, rgba(6,182,212,0.05), rgba(6,182,212,0.3), rgba(6,182,212,0.05))' }} />
            {steps.map((s, i) => (
              <StepCard key={i} {...s} isLast={i === steps.length - 1} delay={i * 100} />
            ))}
          </div>
        </section>

        {/* ══════════════ FEATURES ══════════════ */}
        <section id="features" className="px-6 lg:px-12 py-24 relative">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(249,246,239,0) 0%, rgba(163,160,147,0.1) 100%)' }} />
          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-16">
              <span className="text-[10px] px-3 py-1.5 mb-4 mx-auto inline-flex items-center gap-2 rounded-full font-bold uppercase tracking-wider" style={{ background: 'rgba(163,160,147,0.1)', color: '#374151', border: '1px solid rgba(163,160,147,0.3)' }}>Capabilities</span>
              <h2 className="font-display font-black text-4xl sm:text-5xl text-custom-taupe mb-3">
                Core Infrastructure <span className="text-custom-terra">Intelligence</span>
              </h2>
              <p className="text-custom-sage text-sm max-w-md mx-auto font-medium">
                Designed with state-of-the-art tools to support modern civil engineering automation at scale.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {features.map((f, i) => (
                <FeatureCard key={i} {...f} delay={i * 60} />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ ABOUT / STATS ══════════════ */}
        <section id="about" className="px-6 lg:px-12 py-24 border-t border-custom-sage/30">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 animate-fade-left">
              <span className="text-[10px] px-3 py-1.5 inline-flex items-center gap-2 rounded-full font-bold uppercase tracking-wider" style={{ background: 'rgba(163,160,147,0.1)', color: '#374151', border: '1px solid rgba(163,160,147,0.3)' }}>About ROADNEX</span>
              <h2 className="font-display font-black text-4xl sm:text-5xl text-custom-taupe leading-tight">
                Built for the <span className="text-custom-terra">Cities of Tomorrow</span>
              </h2>
              <p className="text-custom-sage text-sm leading-relaxed font-medium">
                Traditional municipal road inspection takes weeks and operates on slow complaint registers. ROADNEX automates the full lifecycle — from citizens' mobile snap uploads through AI validation, prioritization, contractor dispatching, and repair verification.
              </p>
              <p className="text-custom-sage text-sm leading-relaxed font-medium">
                By fusing GIS telemetry mapping and rainfall data forecasting, municipal operations officers get actionable risk indicators before potholes morph into severe roadway failures.
              </p>

            </div>

            <div className="w-full h-full min-h-[300px] md:min-h-[380px] rounded-3xl border border-custom-sage/30 overflow-hidden shadow-2xl animate-fade-right delay-200 bg-slate-950/20 relative group">
              <video 
                src="/videos/promo.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover rounded-3xl"
              />
              {/* Premium dark glow border */}
              <div className="absolute inset-0 border-2 border-custom-terra/20 rounded-3xl pointer-events-none group-hover:border-custom-terra/40 transition-colors duration-300" />
            </div>
          </div>
        </section>


      </main>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="border-t border-custom-sage/30 bg-[#f4f0e6]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2 space-y-4">
              <img src="/logo.png" alt="ROADNEX" className="h-14 object-contain" />
              <p className="text-sm text-custom-sage font-medium leading-relaxed max-w-xs">
                AI-powered smart city platform for road defect detection, municipal dispatch automation, and urban infrastructure intelligence.
              </p>
            </div>
            <div className="space-y-3">
              <h5 className="font-display font-bold text-sm text-custom-taupe">Platform</h5>
              <ul className="space-y-2 text-xs text-custom-sage font-medium">
                {['Citizen Portal', 'Admin Dashboard', 'GIS Mapping', 'Analytics'].map(l => (
                  <li key={l}><a href="#" className="hover:text-custom-terra transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h5 className="font-display font-bold text-sm text-custom-taupe">Legal</h5>
              <ul className="space-y-2 text-xs text-custom-sage font-medium">
                {['Privacy Policy', 'Terms of Service', 'API Console', 'Documentation'].map(l => (
                  <li key={l}><a href="#" className="hover:text-custom-terra transition-colors flex items-center gap-1">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
