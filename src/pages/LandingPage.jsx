import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, ArrowRight, ShieldCheck, MapPin, Activity, Camera,
  AlertOctagon, Sparkles, Layers, Cpu, GitCommit, CheckCircle2,
  Droplets, Navigation, ExternalLink, ChevronRight, Zap,
  BarChart3, Shield, TrendingUp, Clock, Users, Star, Menu, X, Loader2
} from 'lucide-react';

/* ─── Unique Orbital Lidar Scan Animation ─── */
function SplashScreen({ onComplete }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage 0: 0s - Global radar spinning, searching
    // Stage 1: 2.5s - Anomaly detected, radar locks, screen zooms in
    // Stage 2: 5s - Drone dispatched, repairing
    // Stage 3: 7.5s - Resolved, system online
    const t1 = setTimeout(() => setStage(1), 2500); 
    const t2 = setTimeout(() => setStage(2), 5000); 
    const t3 = setTimeout(() => setStage(3), 7500); 
    const t4 = setTimeout(() => onComplete(), 9000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#020617] overflow-hidden flex flex-col items-center justify-center font-mono">
      <style>{`
        @keyframes radar-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.8); }
        }
        @keyframes orbital-zoom {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(6) translate(15%, -15%); }
        }
        .city-grid {
          position: absolute;
          inset: -50%;
          background-image: 
            linear-gradient(rgba(14, 165, 233, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14, 165, 233, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
          border-radius: 50%;
          opacity: 0.5;
        }
        .radar-sweep {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: conic-gradient(from 0deg, transparent 70%, rgba(14, 165, 233, 0.1) 80%, rgba(14, 165, 233, 0.8) 100%);
          animation: radar-spin 2s linear infinite;
        }
        .anomaly {
          position: absolute;
          width: 8px;
          height: 8px;
          background: #f43f5e;
          border-radius: 50%;
          box-shadow: 0 0 15px 4px rgba(244,63,94,0.8);
          animation: blink 1s infinite;
        }
        .anomaly.resolved {
          background: #10b981;
          box-shadow: 0 0 15px 4px rgba(16,185,129,0.8);
          animation: none;
        }
        .zoom-container {
          position: absolute;
          inset: 0;
          transition: transform 2.5s cubic-bezier(0.87, 0, 0.13, 1);
        }
        .zoom-container.zoomed {
          transform: scale(6) translate(15%, -15%);
        }
      `}</style>

      {/* The Global View Container */}
      <div className={`zoom-container ${stage >= 1 ? 'zoomed' : ''}`}>
        
        {/* Radar Map Base */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-sky-500/20 rounded-full">
          <div className="city-grid"></div>
          
          {/* Radar Sweep (Stops spinning when locked) */}
          <div className="radar-sweep" style={{ animationPlayState: stage >= 1 ? 'paused' : 'running', opacity: stage >= 1 ? 0.2 : 1 }}></div>
          
          {/* Concentric Rings */}
          <div className="absolute inset-10 border border-sky-500/10 rounded-full"></div>
          <div className="absolute inset-32 border border-sky-500/20 rounded-full"></div>
          <div className="absolute inset-56 border border-sky-500/10 rounded-full"></div>
          
          {/* Crosshairs */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-sky-500/30"></div>
          <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-sky-500/30"></div>

          {/* Map Nodes / Anomalies */}
          <div className={`anomaly ${stage >= 3 ? 'resolved' : ''}`} style={{ top: '35%', left: '35%' }}></div>
          <div className="anomaly resolved" style={{ top: '65%', left: '70%', opacity: 0.5 }}></div>
          <div className="anomaly resolved" style={{ top: '20%', left: '50%', opacity: 0.3 }}></div>
        </div>
      </div>

      {/* Static Overlays (HUD) */}
      <div className="absolute inset-0 z-30 pointer-events-none p-6">
        
        {/* Top Left Title */}
        <div className="absolute top-6 left-6">
          <h1 className="text-sky-400 font-display font-black tracking-widest text-xl">ORBITAL // LIDAR</h1>
          <p className="text-sky-500/70 text-xs">SATELLITE DOWNLINK ACTIVE</p>
        </div>

        {/* Top Right Status */}
        <div className="absolute top-6 right-6 text-right">
          <div className="text-xs text-sky-400">ALTITUDE: <span className="text-white">400 KM</span></div>
          <div className="text-xs text-sky-400">LAT: <span className="text-white">28.7041° N</span></div>
          <div className="text-xs text-sky-400">LON: <span className="text-white">77.1025° E</span></div>
        </div>

        {/* Dynamic Center Lock-On Box (Appears at Stage 1) */}
        {stage >= 1 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-rose-500/50 bg-rose-500/5 transition-colors duration-1000 flex items-center justify-center animate-fade-in" style={{ borderColor: stage >= 3 ? 'rgba(16,185,129,0.5)' : 'rgba(244,63,94,0.5)' }}>
            
            {/* Corner Brackets */}
            <div className={`absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 transition-colors duration-1000 ${stage >= 3 ? 'border-emerald-500' : 'border-rose-500'}`}></div>
            <div className={`absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 transition-colors duration-1000 ${stage >= 3 ? 'border-emerald-500' : 'border-rose-500'}`}></div>
            <div className={`absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 transition-colors duration-1000 ${stage >= 3 ? 'border-emerald-500' : 'border-rose-500'}`}></div>
            <div className={`absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 transition-colors duration-1000 ${stage >= 3 ? 'border-emerald-500' : 'border-rose-500'}`}></div>

            {/* Target Label */}
            <div className={`absolute -top-8 left-0 text-xs font-bold px-2 py-1 transition-colors duration-1000 ${stage >= 3 ? 'bg-emerald-500 text-emerald-950' : 'bg-rose-500 text-rose-950'}`}>
              {stage === 1 ? 'TARGET LOCKED' : stage === 2 ? 'DISPATCHING DRONE...' : 'REPAIR CONFIRMED'}
            </div>

            {/* Drone Repair Laser (Stage 2) */}
            {stage === 2 && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[200px] h-[2px] bg-emerald-400 shadow-[0_0_20px_5px_rgba(16,185,129,0.8)] animate-[spin_1s_linear_infinite] origin-left"></div>
            )}
          </div>
        )}

        {/* Bottom Left Logs */}
        <div className="absolute bottom-6 left-6 w-80">
          <div className="text-[10px] text-sky-400/80 mb-2 border-b border-sky-900/50 pb-1">TERMINAL LOGS</div>
          <div className="space-y-1 text-[10px]">
            <div className="text-sky-300"> {'>'} INITIALIZING GLOBAL SCAN... OK</div>
            <div className="text-sky-300"> {'>'} CALIBRATING SENSORS... OK</div>
            {stage >= 1 && <div className="text-rose-400"> {'>'} CRITICAL INFRASTRUCTURE BREACH DETECTED.</div>}
            {stage >= 1 && <div className="text-rose-400"> {'>'} ISOLATING COORDINATES...</div>}
            {stage >= 2 && <div className="text-amber-400"> {'>'} DISPATCHING AUTOMATED REPAIR UNIT.</div>}
            {stage >= 3 && <div className="text-emerald-400 font-bold"> {'>'} STRUCTURAL INTEGRITY RESTORED.</div>}
          </div>
        </div>

        {/* Bottom Right Progress Bar */}
        <div className="absolute bottom-6 right-6 w-64 text-right">
          <div className="text-[10px] text-sky-400 mb-2">
            OVERALL NETWORK STATUS: {stage >= 3 ? <span className="text-emerald-400">SECURE</span> : <span className="text-rose-400">COMPROMISED</span>}
          </div>
          <div className="w-full h-1 bg-sky-950 rounded overflow-hidden">
            <div className="h-full bg-sky-500 transition-all duration-[7500ms] ease-linear" style={{ width: stage >= 3 ? '100%' : '10%' }}></div>
          </div>
        </div>

      </div>
    </div>
  );
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
    cyan:    { bg: 'rgba(6,182,212,0.1)',  border: 'rgba(6,182,212,0.25)',  text: '#22d3ee' },
    emerald: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', text: '#34d399' },
    violet:  { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.25)', text: '#a78bfa' },
    amber:   { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', text: '#fbbf24' },
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
      <h3 className="font-display font-bold text-sm text-slate-100 mb-2">{title}</h3>
      <p className="text-[12px] text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

/* ─── Step Card ─── */
function StepCard({ num, title, desc, isLast, delay = 0 }) {
  return (
    <div className="animate-fade-up flex flex-col items-center text-center relative" style={{ animationDelay: `${delay}ms` }}>
      <div className="relative mb-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-600/20 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10">
          <span className="font-mono font-black text-lg text-cyan-400">{num}</span>
        </div>
        <div className="absolute -inset-1 bg-cyan-400 rounded-2xl blur opacity-10 group-hover:opacity-25 transition" />
      </div>
      {!isLast && (
        <div className="hidden lg:block absolute left-full top-7 w-full h-0.5 bg-gradient-to-r from-cyan-500/30 to-transparent -translate-y-1/2 z-0" style={{ width: 'calc(100% - 56px)', left: '50%' }} />
      )}
      <h4 className="font-display font-bold text-sm text-slate-100 mb-1">{title}</h4>
      <p className="text-[11px] text-slate-400 leading-relaxed max-w-[140px]">{desc}</p>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('roadnex_splash_seen');
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

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

  if (showSplash) {
    return (
      <SplashScreen onComplete={() => {
        sessionStorage.setItem('roadnex_splash_seen', 'true');
        setShowSplash(false);
      }} />
    );
  }

  return (
    <div className="min-h-screen text-slate-100 flex flex-col relative overflow-hidden" style={{ backgroundColor: '#0a0e1a' }}>

      {/* ── BACKGROUND ORBS ── */}
      <div className="orb-cyan absolute w-[700px] h-[700px] -top-48 -left-48 pointer-events-none" />
      <div className="orb-violet absolute w-[600px] h-[600px] top-1/2 -right-48 pointer-events-none" />
      <div className="orb-emerald absolute w-[500px] h-[500px] bottom-0 left-1/3 pointer-events-none" />
      <div className="bg-grid absolute inset-0 pointer-events-none opacity-60" />

      {/* ══════════════ HEADER ══════════════ */}
      <header className={`h-18 px-6 lg:px-12 flex items-center justify-between sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-white/5 shadow-xl shadow-black/30' : 'bg-transparent'
      }`} style={{ height: '72px' }}>

        {/* Brand */}
        <div className="flex items-center gap-3 animate-fade-down">
          <div className="relative w-10 h-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Navigation size={18} className="text-white rotate-45" />
            </div>
            <div className="absolute -inset-0.5 bg-cyan-400 rounded-xl blur opacity-20 animate-pulse-glow" />
          </div>
          <div>
            <h1 className="font-display font-black text-lg tracking-tight text-white leading-none flex items-center gap-2">
              ROADNEX
              <span className="badge badge-cyan text-[9px]">v2.0</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">Smart Infrastructure AI</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 animate-fade-down delay-100">
          {[['Home', null], ['About', 'about'], ['How It Works', 'how-it-works'], ['Features', 'features'], ['Portals', 'portals']].map(([label, id]) => (
            <button
              key={label}
              onClick={() => id ? scrollTo(id) : window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-xs font-semibold text-slate-400 hover:text-white transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.5)] cursor-pointer"
            >
              {label}
            </button>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3 animate-fade-down delay-200">
          <button
            onClick={() => navigate('/login')}
            className="btn-ghost text-xs py-2 px-4 rounded-xl"
          >
            Citizen Sign In
          </button>
          <button
            onClick={() => navigate('/admin/login')}
            className="btn-primary text-xs py-2 px-4 rounded-xl"
            style={{ animationDuration: '0s' }}
          >
            Admin Panel <ArrowRight size={14} />
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button className="md:hidden text-slate-300" onClick={() => setMenuOpen(!menuOpen)}>
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
                <span className="badge badge-cyan text-[10px] px-3 py-1.5 mb-6 inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
                  Smart Infrastructure Operations — Live
                </span>

                <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight mt-4">
                  <span className="text-white">Smarter</span>{' '}
                  <span className="text-white">Roads.</span>
                  <br />
                  <span className="gradient-text-hero">Faster Response.</span>
                  <br />
                  <span className="text-white">Safer Cities.</span>
                </h1>
              </div>

              <p className="animate-fade-up delay-200 text-slate-400 text-base leading-relaxed max-w-xl font-medium">
                ROADNEX leverages <span className="text-cyan-400 font-semibold">computer vision AI</span>, GIS mapping, and predictive prioritization to monitor road degradation, flag waterlogging hazards, and automate municipal maintenance dispatch loops.
              </p>

              <div className="animate-fade-up delay-300 flex flex-wrap gap-4">
                <button onClick={() => navigate('/login')} className="btn-primary btn-emerald">
                  <Camera size={16} /> Report a Road Issue
                </button>
                <button onClick={() => scrollTo('features')} className="btn-ghost">
                  Explore ROADNEX <ChevronRight size={16} />
                </button>
              </div>

              {/* Metrics Row */}
              <div className="animate-fade-up delay-400 grid grid-cols-4 gap-4 pt-8 border-t border-white/5">
                {stats.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Icon size={12} style={{ color: s.accent }} />
                        <p className="font-display font-black text-2xl text-white">
                          <AnimatedCounter target={s.value} suffix={s.suffix} />
                        </p>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-tight">{s.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Live Telemetry Card */}
            <div className="lg:col-span-5 animate-fade-right delay-300">
              <div className="glass-card rounded-3xl p-6 relative overflow-hidden animate-float">
                {/* Glow accent */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <p className="text-xs font-mono font-bold text-slate-300">TELEMETRY MONITOR: ACTIVE</p>
                  </div>
                  <span className="badge badge-cyan text-[9px]">GPS LOCKED</span>
                </div>

                {/* Animated Map */}
                <div className="h-60 rounded-2xl bg-slate-950 border border-slate-800/80 relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-fine opacity-50" />
                  {/* Road lines */}
                  <div className="absolute w-[3px] h-full bg-slate-800/60 left-1/3" />
                  <div className="absolute w-[3px] h-full bg-slate-800/60 left-2/3" />
                  <div className="absolute h-[3px] w-full bg-slate-800/60 top-1/2" />
                  <div className="absolute h-[3px] w-full bg-slate-800/60 top-1/4" />
                  {/* Scanner */}
                  <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/3 animate-scanline" />
                  {/* Pins */}
                  {[
                    { top: '32%', left: '24%', color: 'rose',   label: 'Pothole (98%)' },
                    { top: '65%', left: '50%', color: 'orange', label: 'Road Crack' },
                    { top: '22%', right: '22%', color: 'cyan',  label: 'Flood Hotspot', ping: true },
                    { top: '50%', left: '15%', color: 'violet', label: 'Structural Risk' },
                  ].map((pin, i) => {
                    const colorMap = {
                      rose:   { border: '#f43f5e', bg: 'rgba(244,63,94,0.15)',   text: '#fca5a5', dot: '#f43f5e' },
                      orange: { border: '#f97316', bg: 'rgba(249,115,22,0.15)',  text: '#fdba74', dot: '#f97316' },
                      cyan:   { border: '#06b6d4', bg: 'rgba(6,182,212,0.15)',   text: '#67e8f9', dot: '#06b6d4' },
                      violet: { border: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', text: '#c4b5fd', dot: '#8b5cf6' },
                    };
                    const c = colorMap[pin.color];
                    return (
                      <div key={i} className="absolute flex flex-col items-center" style={{ top: pin.top, left: pin.left, right: pin.right }}>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ring-4 ${pin.ping ? 'animate-ping' : ''}`}
                          style={{ background: c.bg, border: `1px solid ${c.border}`, ringColor: c.bg }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
                        </div>
                        <span className="text-[8px] px-1.5 py-0.5 mt-1 rounded font-mono whitespace-nowrap"
                          style={{ background: 'rgba(2,6,23,0.9)', border: `1px solid rgba(255,255,255,0.08)`, color: c.text }}>
                          {pin.label}
                        </span>
                      </div>
                    );
                  })}
                  <p className="text-[9px] text-slate-600 font-mono absolute bottom-2.5 right-3 select-none">AI Vector Layer v2.0</p>
                </div>

                {/* Mini Stats */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    { label: 'AI Queue', value: '12 Active', accent: '#06b6d4' },
                    { label: 'Risk Level', value: 'High Alert', accent: '#f43f5e' },
                    { label: 'Dispatch ETA', value: '38 min', accent: '#10b981' },
                  ].map((s, i) => (
                    <div key={i} className="bg-slate-950/80 p-3 rounded-xl border border-white/5">
                      <p className="text-[9px] text-slate-500 uppercase tracking-wide font-bold">{s.label}</p>
                      <p className="font-mono font-bold text-xs mt-0.5" style={{ color: s.accent }}>{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════ PORTALS ══════════════ */}
        <section id="portals" className="relative px-6 lg:px-12 py-20 border-y border-white/5">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 to-transparent pointer-events-none" />
          <div className="max-w-5xl mx-auto relative">
            <div className="text-center mb-14">
              <p className="badge badge-violet mb-4 mx-auto">Platform Access</p>
              <h2 className="font-display font-black text-4xl sm:text-5xl text-white mb-3">
                Choose Your Portal
              </h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Connect as a reporting citizen or city management supervisor. Each portal is tailored with role-specific tools.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Citizen Portal */}
              <div className="animate-fade-left card-premium p-8 group relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0 opacity-60" />
                <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors duration-500" />
                <div className="relative z-10 space-y-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}>
                    <Camera size={24} className="text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display font-bold text-xl text-white">Citizen Portal</h3>
                      <span className="badge badge-emerald">Public</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Snap road issues, record GPS pin logs, file official infrastructure complaints, and monitor repair status in real-time.
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {['AI-powered road defect analysis', 'GPS-tagged complaint filing', 'Live repair status tracking'].map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => navigate('/login')}
                    className="w-full py-3.5 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 text-white"
                    style={{ background: 'linear-gradient(135deg, #10b981, #0d9488)', boxShadow: '0 8px 24px rgba(16,185,129,0.25)' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 32px rgba(16,185,129,0.4)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(16,185,129,0.25)'}
                  >
                    Enter Citizen Portal <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Admin Portal */}
              <div className="animate-fade-right delay-100 card-premium p-8 group relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0 opacity-60" />
                <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors duration-500" />
                <div className="relative z-10 space-y-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)' }}>
                    <Shield size={24} className="text-cyan-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display font-bold text-xl text-white">Municipal Command</h3>
                      <span className="badge badge-rose">Admin Only</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Analyze city-wide heatmaps, inspect automated dispatch work orders, monitor contractor SLAs, and view active priority queues.
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {['City-wide defect heatmap & GIS', 'Automated work order management', 'Contractor SLA monitoring'].map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 size={13} className="text-cyan-400 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => navigate('/admin/login')}
                    className="w-full py-3.5 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 text-white"
                    style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', boxShadow: '0 8px 24px rgba(6,182,212,0.25)' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 32px rgba(6,182,212,0.4)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(6,182,212,0.25)'}
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
            <span className="badge badge-amber mb-4 inline-flex">The Process</span>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white mb-3">
              Municipal Maintenance Loop
            </h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
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
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-16">
              <span className="badge badge-cyan mb-4 inline-flex">Capabilities</span>
              <h2 className="font-display font-black text-4xl sm:text-5xl text-white mb-3">
                Core Infrastructure <span className="gradient-text-cyan">Intelligence</span>
              </h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
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
        <section id="about" className="px-6 lg:px-12 py-24 border-t border-white/5">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 animate-fade-left">
              <span className="badge badge-emerald">About ROADNEX</span>
              <h2 className="font-display font-black text-4xl sm:text-5xl text-white leading-tight">
                Built for the <span className="gradient-text-emerald">Cities of Tomorrow</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Traditional municipal road inspection takes weeks and operates on slow complaint registers. ROADNEX automates the full lifecycle — from citizens' mobile snap uploads through AI validation, prioritization, contractor dispatching, and repair verification.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                By fusing GIS telemetry mapping and rainfall data forecasting, municipal operations officers get actionable risk indicators before potholes morph into severe roadway failures.
              </p>
              <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <ShieldCheck size={20} className="text-emerald-400 shrink-0" />
                <span className="text-sm font-semibold text-slate-200">ISO 9001 Smart City Operations Standards Compliant</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 animate-fade-right delay-200">
              {[
                { value: '80', suffix: '%',   label: 'Faster Dispatching',     accent: '#06b6d4' },
                { value: '10', suffix: 'k+',  label: 'Reports Ingested',       accent: '#6366f1' },
                { value: '92', suffix: '%',   label: 'Deduplication Rate',     accent: '#8b5cf6' },
                { value: '100', suffix: '%',  label: 'Verifiable Auditing',    accent: '#10b981' },
              ].map((s, i) => (
                <div key={i} className="stat-card text-center" style={{ '--card-accent': s.accent }}>
                  <h4 className="font-display font-black text-4xl mb-1" style={{ color: s.accent }}>
                    <AnimatedCounter target={s.value} suffix={s.suffix} />
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ TRUST STRIP ══════════════ */}
        <section className="px-6 lg:px-12 py-12 border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Trusted Infrastructure Technology</p>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              {['Smart City Initiative', 'ISO 9001 Certified', 'GIS-Powered', 'ML Model v2.0', 'Real-time Telemetry'].map(t => (
                <div key={t} className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <Star size={12} className="text-amber-400" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="border-t border-white/5 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center">
                  <Navigation size={16} className="text-white rotate-45" />
                </div>
                <span className="font-display font-black text-lg text-white">ROADNEX</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                AI-powered smart city platform for road defect detection, municipal dispatch automation, and urban infrastructure intelligence.
              </p>
            </div>
            <div className="space-y-3">
              <h5 className="font-display font-bold text-sm text-slate-200">Platform</h5>
              <ul className="space-y-2 text-xs text-slate-400">
                {['Citizen Portal', 'Admin Dashboard', 'GIS Mapping', 'Analytics'].map(l => (
                  <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h5 className="font-display font-bold text-sm text-slate-200">Legal</h5>
              <ul className="space-y-2 text-xs text-slate-400">
                {['Privacy Policy', 'Terms of Service', 'API Console', 'Documentation'].map(l => (
                  <li key={l}><a href="#" className="hover:text-white transition-colors flex items-center gap-1">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">© {new Date().getFullYear()} ROADNEX Inc. Intelligent Urban Infrastructure Solutions.</p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                All Systems Operational
              </span>
              <span>v2.0.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
