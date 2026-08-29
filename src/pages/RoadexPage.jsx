import React, { useState } from 'react';
import { 
  Users, Award, Activity, TrendingUp, AlertTriangle, CheckCircle2, 
  Sparkles, ShieldCheck, Search, Bell, BookOpen, Layers, BarChart3, 
  Zap, ChevronRight, Play, ArrowRight, RefreshCw, Cpu, Compass, Building2,
  FileCheck, Shield, HelpCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area
} from 'recharts';
import RoadexHero3D from '../components/RoadexHero3D';
import SkillConstellation3D from '../components/SkillConstellation3D';
import RoadexAiCopilot from '../components/RoadexAiCopilot';

export default function RoadexPage() {
  const [activeTab, setActiveTab] = useState('hero'); // 'hero', 'overview', 'employees', 'gaps', 'assessment', 'learning', 'departments', 'analytics'
  const [hoveredStep, setHoveredStep] = useState(null);

  // Sample assessment generator state
  const [assessmentStep, setAssessmentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [assessmentDone, setAssessmentDone] = useState(false);

  // Employee Intelligence selection
  const [selectedEmployee, setSelectedEmployee] = useState({
    name: 'Rahul Sharma',
    designation: 'Senior Hydro Infrastructure Engineer',
    department: 'Emergency Response & Works',
    experience: '8 Years',
    qualifications: 'B.Tech Civil & Spatial GIS',
    certifications: ['NDRF Disaster Level-2', 'AI Hydro Analytics'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  });

  // Department data
  const departments = [
    { name: 'Administration', readiness: 88, count: 184, criticalGap: 'Digital Workflow', progress: 92, color: '#10B981' },
    { name: 'Engineering', readiness: 82, count: 412, criticalGap: 'AutoCAD GIS Telemetry', progress: 85, color: '#3B82F6' },
    { name: 'IT & AI Infrastructure', readiness: 91, count: 128, criticalGap: 'Cyber Hygiene', progress: 94, color: '#06B6D4' },
    { name: 'Emergency Response', readiness: 54, count: 240, criticalGap: 'Flood Data Analysis', progress: 61, color: '#EF4444' },
    { name: 'Public Services', readiness: 79, count: 160, criticalGap: 'Citizen Dispute Redressal', progress: 81, color: '#F59E0B' },
    { name: 'Operations & Works', readiness: 66, count: 124, criticalGap: 'Heavy Machinery Automation', progress: 70, color: '#8B5CF6' }
  ];

  // Assessment Questions
  const questions = [
    {
      q: "When a hydro-sensor signals a sudden 40% sub-base waterlogging spike, what is your initial triage protocol?",
      options: [
        "A. Immediately trigger automatic pump override and dispatch local hydro inspection crew.",
        "B. Wait 2 hours for secondary satellite confirmation before taking action.",
        "C. Route complaint to general administration queue without priority flag.",
        "D. Log issue in offline register and review during weekly meeting."
      ],
      correct: 0
    },
    {
      q: "Which GIS spatial overlay parameter determines emergency pothole repair priority score?",
      options: [
        "A. Only road width.",
        "B. Composite score of Severity (40%), Traffic Volume (35%), and Flood Hazard (25%).",
        "C. Citizen user's registration age.",
        "D. Time of day reported."
      ],
      correct: 1
    }
  ];

  const workflowSteps = [
    { num: "01", title: "Employee Data", desc: "Ingests qualifications, certifications, roles, and historical performance metrics into secure database." },
    { num: "02", title: "AI Profile Analysis", desc: "Neural NLP parses job descriptions and cross-references required vs actual capability baselines." },
    { num: "03", title: "Skill Assessment", desc: "Generates role-specific adaptive evaluations to test practical competency under pressure." },
    { num: "04", title: "Skill Gap Detection", desc: "Identifies precise skill delta percentages (e.g. 18% gap in Data Analysis) with priority flags." },
    { num: "05", title: "Personalized Learning", desc: "Constructs tailored micro-learning pathways with estimated improvement targets." },
    { num: "06", title: "Re-Assessment", desc: "Evaluates post-training mastery with practical scenario tasks and scenario simulation." },
    { num: "07", title: "Workforce Ready", desc: "Issues digital competency badge and updates national government readiness index." }
  ];

  // Recharts Data
  const radarData = [
    { subject: 'Communication', A: 94, fullMark: 100 },
    { subject: 'Leadership', A: 78, fullMark: 100 },
    { subject: 'Data Analysis', A: 72, fullMark: 100 },
    { subject: 'Tech Skills', A: 88, fullMark: 100 },
    { subject: 'Problem Solving', A: 91, fullMark: 100 },
    { subject: 'Emergency', A: 54, fullMark: 100 },
    { subject: 'Digital Tools', A: 65, fullMark: 100 },
  ];

  const trendData = [
    { month: 'Jan', readiness: 68, trained: 120 },
    { month: 'Feb', readiness: 72, trained: 180 },
    { month: 'Mar', readiness: 77, trained: 240 },
    { month: 'Apr', readiness: 81, trained: 310 },
    { month: 'May', readiness: 84, trained: 390 },
    { month: 'Jun', readiness: 87, trained: 460 },
  ];

  const pieData = [
    { name: 'Workforce Ready', value: 1086, color: '#06B6D4' },
    { name: 'Needs Training', value: 129, color: '#F59E0B' },
    { name: 'Critical Gap', value: 33, color: '#EF4444' },
  ];

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Background Lighting & Particles Glow */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-1/3 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* FLOATING TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-slate-950/70 border-b border-cyan-500/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px] shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center font-black text-cyan-400 text-base">
              R
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-wider text-white">ROADEX</h1>
              <span className="text-[9px] font-black uppercase bg-cyan-500/15 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/30">
                Govt AI Readiness
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Workforce Competency & Intelligence Platform</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-slate-900/80 border border-cyan-500/20 rounded-2xl">
          {[
            { id: 'hero', label: 'Home' },
            { id: 'overview', label: 'Command Center' },
            { id: 'employees', label: 'Employee 3D' },
            { id: 'gaps', label: 'Skill Gap Matrix' },
            { id: 'assessment', label: 'AI Assessment' },
            { id: 'learning', label: 'Learning Paths' },
            { id: 'departments', label: 'Departments' },
            { id: 'analytics', label: 'Analytics' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search workforce..." 
              className="w-full bg-slate-900/60 border border-cyan-500/20 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
            />
          </div>

          <button 
            onClick={() => setActiveTab('overview')}
            className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          >
            <span>Enter Command Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER CONTENT BASED ON ACTIVE TAB */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-16">

        {/* =================================================================== */}
        {/* SECTION 2: HERO LANDING PAGE WITH INTERACTIVE 3D CORE NETWORK */}
        {/* =================================================================== */}
        {(activeTab === 'hero' || activeTab === 'all') && (
          <section className="space-y-12 animate-fade-in pt-4">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wider uppercase backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                Smart India Hackathon Govt AI Workforce Intelligence
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                Know Your Workforce. <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Build Their Future.
                </span>
              </h1>

              <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed">
                AI-powered workforce intelligence that identifies skill gaps, evaluates employee readiness, 
                and creates personalized development pathways across government departments.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Explore ROADEX Command Center</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button 
                  onClick={() => {
                    const el = document.getElementById('workflow-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 text-white font-bold text-sm transition-all cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current text-cyan-400" />
                  <span>See How It Works</span>
                </button>
              </div>
            </div>

            {/* 3D WORKFORCE NETWORK CORE VISUALIZATION */}
            <div className="relative">
              <RoadexHero3D />

              {/* Floating Metric Counters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {[
                  { label: "Workforce Readiness", value: "87%", icon: Activity, color: "text-cyan-400", border: "border-cyan-500/30" },
                  { label: "Employees Analysed", value: "1,248", icon: Users, color: "text-blue-400", border: "border-blue-500/30" },
                  { label: "Skill Gaps Identified", value: "126", icon: AlertTriangle, color: "text-amber-400", border: "border-amber-500/30" },
                  { label: "Learning Paths Generated", value: "342", icon: BookOpen, color: "text-emerald-400", border: "border-emerald-500/30" },
                ].map((m, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 bg-slate-900/60 border ${m.border} rounded-2xl backdrop-blur-xl flex items-center gap-3.5 hover:border-cyan-400/50 transition-all shadow-lg`}
                  >
                    <div className={`p-2.5 rounded-xl bg-slate-800/80 ${m.color}`}>
                      <m.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className={`text-2xl font-black ${m.color} font-mono tracking-tight`}>{m.value}</div>
                      <div className="text-[11px] text-slate-400 font-medium">{m.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* =================================================================== */}
        {/* SECTION 3: ROADEX 7-STAGE WORKFLOW PIPELINE */}
        {/* =================================================================== */}
        <section id="workflow-section" className="space-y-6 pt-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[10px] font-mono font-extrabold uppercase text-cyan-400 tracking-widest block">
              7-STAGE END-TO-END WORKFORCE PIPELINE
            </span>
            <h2 className="text-2xl font-black text-white mt-1">Autonomous Competency Lifecycle</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {workflowSteps.map((step, idx) => {
              const isHovered = hoveredStep === idx;
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredStep(idx)}
                  onMouseLeave={() => setHoveredStep(null)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-44 ${
                    isHovered
                      ? 'bg-gradient-to-b from-cyan-950/60 to-slate-900 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] -translate-y-1'
                      : 'bg-slate-900/50 border-cyan-500/20 hover:border-cyan-500/40 backdrop-blur-md'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-black text-cyan-400">{step.num}</span>
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-white leading-tight mb-1">{step.title}</h4>
                    <p className="text-[10px] text-slate-400 font-medium line-clamp-3 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="text-[9px] font-mono text-cyan-300 font-bold tracking-wider uppercase flex items-center gap-1">
                    <span>Stage Active</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =================================================================== */}
        {/* SECTION 4: GOVERNMENT / ADMIN COMMAND CENTER DASHBOARD */}
        {/* =================================================================== */}
        {(activeTab === 'overview' || activeTab === 'all') && (
          <section className="space-y-6 pt-4 animate-fade-in">
            <div className="flex justify-between items-end border-b border-cyan-500/20 pb-4">
              <div>
                <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-widest block">
                  COMMAND CENTER VIEW
                </span>
                <h2 className="text-2xl font-black text-white">Workforce Readiness & Skill Intelligence</h2>
              </div>

              <div className="flex gap-2">
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 87% Target Readiness Reached
                </span>
              </div>
            </div>

            {/* Circular Gauge & Status Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Central Readiness Gauge Card */}
              <div className="p-8 bg-slate-900/60 border border-cyan-500/30 rounded-3xl backdrop-blur-xl flex flex-col items-center justify-center text-center relative overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.1)]">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="rgba(15, 23, 42, 0.8)" strokeWidth="8" fill="none" />
                    <circle 
                      cx="50" cy="50" r="40" 
                      stroke="url(#cyanGrad)" 
                      strokeWidth="8" 
                      fill="none" 
                      strokeDasharray="251.2" 
                      strokeDashoffset="32.6" 
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06B6D4" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-white font-mono tracking-tight">87%</span>
                    <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">Readiness</span>
                  </div>
                </div>

                <h3 className="text-sm font-extrabold text-white mt-4">Overall Workforce Readiness Index</h3>
                <p className="text-xs text-slate-400 font-medium mt-1 max-w-xs">
                  Evaluated across 1,248 municipal employees and 6 operational government departments.
                </p>
              </div>

              {/* Status Breakdown Cards */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-slate-900/50 border border-emerald-500/30 rounded-3xl backdrop-blur-xl space-y-3 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">Ready</span>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-white font-mono">1,086</div>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">Employees fully qualified for assigned roles.</p>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-400 h-full w-[87%]" />
                  </div>
                </div>

                <div className="p-6 bg-slate-900/50 border border-amber-500/30 rounded-3xl backdrop-blur-xl space-y-3 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Needs Training</span>
                    <Activity className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-white font-mono">129</div>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">Minor skill gaps requiring micro-learning pathway.</p>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-amber-400 h-full w-[10.3%]" />
                  </div>
                </div>

                <div className="p-6 bg-slate-900/50 border border-rose-500/30 rounded-3xl backdrop-blur-xl space-y-3 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-extrabold text-rose-400 uppercase tracking-wider">Critical Gap</span>
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-white font-mono">33</div>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">High priority skill deficits in emergency flood triage.</p>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-rose-400 h-full w-[2.7%]" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =================================================================== */}
        {/* SECTION 5: EMPLOYEE INTELLIGENCE & 3D SKILL CONSTELLATION */}
        {/* =================================================================== */}
        {(activeTab === 'employees' || activeTab === 'all') && (
          <section className="space-y-6 pt-4 animate-fade-in">
            <div className="border-b border-cyan-500/20 pb-4">
              <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-widest block">
                EMPLOYEE INTELLIGENCE PROFILE
              </span>
              <h2 className="text-2xl font-black text-white">Competency & 3D Skill Constellation</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Employee Bio Profile Card */}
              <div className="p-6 bg-slate-900/60 border border-cyan-500/30 rounded-3xl backdrop-blur-xl space-y-5">
                <div className="flex items-center gap-4">
                  <img 
                    src={selectedEmployee.avatar} 
                    alt="Employee" 
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-500/50 shadow-lg" 
                  />
                  <div>
                    <h3 className="text-base font-black text-white">{selectedEmployee.name}</h3>
                    <p className="text-xs text-cyan-300 font-semibold">{selectedEmployee.designation}</p>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">{selectedEmployee.department}</span>
                  </div>
                </div>

                <div className="space-y-2.5 border-t border-cyan-500/15 pt-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Experience</span>
                    <span className="font-bold text-white">{selectedEmployee.experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Qualifications</span>
                    <span className="font-bold text-white">{selectedEmployee.qualifications}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-400 font-medium">Certifications</span>
                    <div className="text-right space-y-1">
                      {selectedEmployee.certifications.map((c, i) => (
                        <span key={i} className="inline-block text-[10px] font-mono bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30 ml-1">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Skill Level Bars */}
                <div className="space-y-3 border-t border-cyan-500/15 pt-4">
                  <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
                    Skill Gap Breakdown Example:
                  </span>
                  
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-200">Data Analysis</span>
                      <span className="text-rose-400">72% / 90% (18% Gap)</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-rose-500 h-full w-[72%]" />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-200">Emergency Response</span>
                      <span className="text-rose-400">54% / 88% (34% Gap)</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-rose-500 h-full w-[54%]" />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-200">Communication</span>
                      <span className="text-emerald-400">94% / 90% (Ready)</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[94%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Central 3D Skill Constellation */}
              <div className="lg:col-span-2">
                <SkillConstellation3D employee={selectedEmployee} />
              </div>
            </div>
          </section>
        )}

        {/* =================================================================== */}
        {/* SECTION 6: AI SKILL ASSESSMENT GENERATOR & REPORT */}
        {/* =================================================================== */}
        {(activeTab === 'assessment' || activeTab === 'all') && (
          <section className="space-y-6 pt-4 animate-fade-in">
            <div className="border-b border-cyan-500/20 pb-4">
              <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-widest block">
                AI ASSESSMENT GENERATOR
              </span>
              <h2 className="text-2xl font-black text-white">Role-Specific Competency Evaluation</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Question Evaluation Interface */}
              <div className="p-6 bg-slate-900/60 border border-cyan-500/30 rounded-3xl backdrop-blur-xl space-y-4">
                <div className="flex justify-between items-center text-xs font-mono text-cyan-400 border-b border-cyan-500/20 pb-3">
                  <span>Adaptive Assessment Mode</span>
                  <span>Question {assessmentStep + 1} of {questions.length}</span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white leading-relaxed">
                    {questions[assessmentStep].q}
                  </h3>

                  <div className="space-y-2 pt-2">
                    {questions[assessmentStep].options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => setSelectedAnswers(prev => ({ ...prev, [assessmentStep]: oIdx }))}
                        className={`w-full p-3 text-left text-xs rounded-xl border transition-all cursor-pointer ${
                          selectedAnswers[assessmentStep] === oIdx
                            ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold'
                            : 'bg-slate-800/60 border-cyan-500/10 text-slate-300 hover:border-cyan-500/30'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    disabled={assessmentStep === 0}
                    onClick={() => setAssessmentStep(prev => prev - 1)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl disabled:opacity-30 cursor-pointer"
                  >
                    Previous
                  </button>

                  <button
                    onClick={() => {
                      if (assessmentStep < questions.length - 1) {
                        setAssessmentStep(prev => prev + 1);
                      } else {
                        setAssessmentDone(true);
                      }
                    }}
                    className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black rounded-xl cursor-pointer"
                  >
                    {assessmentStep < questions.length - 1 ? 'Next Question' : 'Generate AI Assessment Report'}
                  </button>
                </div>
              </div>

              {/* AI Assessment Report Card */}
              <div className="p-6 bg-slate-900/60 border border-cyan-500/30 rounded-3xl backdrop-blur-xl space-y-4">
                <div className="flex justify-between items-center border-b border-cyan-500/20 pb-3">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-cyan-400" /> AI Assessment Report
                  </h3>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    Calculated Score: 82 / 100
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1">
                    <span className="font-extrabold text-emerald-400 block uppercase">Key Strengths:</span>
                    <p className="text-slate-200 font-medium">&bull; Communication &amp; Team Management (94%)</p>
                    <p className="text-slate-200 font-medium">&bull; Technical Civil Engineering Basics (88%)</p>
                  </div>

                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-1">
                    <span className="font-extrabold text-rose-400 block uppercase">Identified Weaknesses:</span>
                    <p className="text-slate-200 font-medium">&bull; Data Analysis &amp; Sub-Base Telemetry (72%)</p>
                    <p className="text-slate-200 font-medium">&bull; Digital Tool Automation (65%)</p>
                  </div>

                  <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl space-y-1">
                    <span className="font-extrabold text-cyan-300 block uppercase">Recommended AI Learning Pathway:</span>
                    <p className="text-cyan-200 font-bold">Data Analytics Level-2 &amp; Flood Response Telemetry Module</p>
                    <p className="text-slate-400 text-[11px]">Expected Improvement: +18% Competency Increase</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('learning')}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Start Recommended Pathway</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* =================================================================== */}
        {/* SECTION 8: AI PERSONALIZED LEARNING PATHWAYS */}
        {/* =================================================================== */}
        {(activeTab === 'learning' || activeTab === 'all') && (
          <section className="space-y-6 pt-4 animate-fade-in">
            <div className="border-b border-cyan-500/20 pb-4">
              <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-widest block">
                AI PERSONALIZED LEARNING PATHWAYS
              </span>
              <h2 className="text-2xl font-black text-white">Targeted Skill Development Roadmap</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Data Analytics Fundamentals", difficulty: "Intermediate", duration: "4 Hours", boost: "+12%", desc: "Master sub-base telemetry reading, rainfall correlation graphs, and GIS anomaly analysis." },
                { title: "Emergency Incident Command", difficulty: "Advanced", duration: "6 Hours", boost: "+18%", desc: "Disaster triage protocols, rapid evacuation routing, and inter-departmental dispatch." },
                { title: "Digital Automation Tools", difficulty: "Beginner", duration: "3 Hours", boost: "+15%", desc: "Automated work order creation, digital signature verification, and field photo proof uploads." }
              ].map((module, mIdx) => (
                <div key={mIdx} className="p-6 bg-slate-900/60 border border-cyan-500/30 rounded-3xl backdrop-blur-xl space-y-4 flex flex-col justify-between hover:border-cyan-400/60 transition-all">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono uppercase bg-cyan-500/10 text-cyan-300 px-2.5 py-0.5 rounded border border-cyan-500/30 font-bold">
                        {module.difficulty}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400">{module.boost} Competency</span>
                    </div>

                    <h3 className="text-base font-black text-white">{module.title}</h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">{module.desc}</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between text-xs text-slate-300 font-mono">
                      <span>Duration: {module.duration}</span>
                      <span>Target: High Priority</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => alert(`Starting ${module.title}...`)}
                      className="w-full py-2.5 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-white text-xs font-black rounded-xl transition-all border border-cyan-500/30 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Learning Module</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =================================================================== */}
        {/* SECTION 10: DEPARTMENT INTELLIGENCE */}
        {/* =================================================================== */}
        {(activeTab === 'departments' || activeTab === 'all') && (
          <section className="space-y-6 pt-4 animate-fade-in">
            <div className="border-b border-cyan-500/20 pb-4">
              <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-widest block">
                DEPARTMENT INTELLIGENCE
              </span>
              <h2 className="text-2xl font-black text-white">Cross-Department Readiness Breakdown</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {departments.map((dept, idx) => (
                <div key={idx} className="p-6 bg-slate-900/60 border border-cyan-500/30 rounded-3xl backdrop-blur-xl space-y-4 hover:border-cyan-400 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-black text-white">{dept.name}</h3>
                      <span className="text-[11px] text-slate-400 font-mono">{dept.count} Employees Active</span>
                    </div>
                    <span className="text-xl font-black font-mono" style={{ color: dept.color }}>
                      {dept.readiness}%
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <span className="text-slate-400 font-medium">Critical Skill Deficit:</span>
                    <p className="font-bold text-slate-200">{dept.criticalGap}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Training Completion</span>
                      <span className="text-white font-bold">{dept.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full" style={{ width: `${dept.progress}%`, backgroundColor: dept.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =================================================================== */}
        {/* SECTION 11: ANALYTICS DATA CENTER */}
        {/* =================================================================== */}
        {(activeTab === 'analytics' || activeTab === 'all') && (
          <section className="space-y-6 pt-4 animate-fade-in">
            <div className="border-b border-cyan-500/20 pb-4">
              <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-widest block">
                ANALYTICS &amp; DATA CENTER
              </span>
              <h2 className="text-2xl font-black text-white">Workforce Performance Visualizations</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Skill Matrix Chart */}
              <div className="p-6 bg-slate-900/60 border border-cyan-500/30 rounded-3xl backdrop-blur-xl space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Organization Skill Radar Matrix
                </h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="rgba(6, 182, 212, 0.2)" />
                      <PolarAngleAxis dataKey="subject" stroke="#94A3B8" fontSize={10} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(6, 182, 212, 0.2)" />
                      <Radar name="Readiness Score" dataKey="A" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Readiness Trend Line Chart */}
              <div className="p-6 bg-slate-900/60 border border-cyan-500/30 rounded-3xl backdrop-blur-xl space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  6-Month Readiness Acceleration Trend
                </h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.5}/>
                          <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                      <YAxis stroke="#94A3B8" fontSize={11} domain={[50, 100]} />
                      <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#06B6D4', borderRadius: '12px', fontSize: '12px' }} />
                      <Area type="monotone" dataKey="readiness" stroke="#06B6D4" strokeWidth={3} fillOpacity={1} fill="url(#areaGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* FLOATING ROADEX AI COPILOT ASSISTANT */}
      <RoadexAiCopilot />
    </div>
  );
}
