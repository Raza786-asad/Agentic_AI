import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Scan, 
  Map, 
  MessageSquareWarning, 
  Droplets, 
  Wrench, 
  BarChart3, 
  Settings, 
  Shield, 
  Navigation,
  Sparkles,
  Activity,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ currentUser }) {
  const isAdmin = currentUser?.role === 'admin';

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/analysis', label: 'Road Analysis', icon: Scan },
    { path: '/gis-map', label: 'Google GIS Map', icon: Map },
    { path: '/complaints', label: 'Complaints', icon: MessageSquareWarning },
    { path: '/waterlogging', label: 'Waterlogging', icon: Droplets },
    { path: '/maintenance', label: 'Maintenance', icon: Wrench },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#070b14]/95 backdrop-blur-2xl border-r border-slate-800/80 flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-[0_0_25px_rgba(6,182,212,0.35)] ring-1 ring-white/20">
            <Navigation className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white tracking-tight leading-none flex items-center gap-1.5">
              RoadGuard <span className="text-cyan-400 text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 font-mono font-bold">2.0</span>
            </h1>
            <p className="text-[11px] font-medium text-slate-400 mt-1">Smart Infrastructure AI</p>
          </div>
        </div>

        {/* Role Badge */}
        <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs backdrop-blur-md ${
          isAdmin 
            ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300' 
            : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
        }`}>
          <span className="font-bold flex items-center gap-1.5 text-[11px]">
            {isAdmin ? <Shield className="w-3.5 h-3.5 text-cyan-400" /> : <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
            {isAdmin ? 'Municipal Admin' : 'Citizen User'}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3.5 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center justify-between">
          <span>Operations Command</span>
          <Activity className="w-3 h-3 text-cyan-400" />
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 via-blue-600/15 to-transparent text-white border border-cyan-500/40 shadow-[0_4px_20px_rgba(6,182,212,0.15)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 transition-transform group-hover:scale-110 text-cyan-400" />
                <span>{item.label}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
            </NavLink>
          );
        })}
      </nav>

      {/* Telemetry Status Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <div>
              <p className="font-extrabold text-slate-200 text-xs">AI Neural Engine</p>
              <p className="text-[10px] text-emerald-400 font-mono font-bold">Active (2 ms)</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
