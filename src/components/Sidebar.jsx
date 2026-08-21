import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Scan, Map, MessageSquareWarning, Wrench,
  BarChart3, Settings, Shield, Navigation, Sparkles, Activity,
  LogOut, ChevronRight, Cpu, Droplets
} from 'lucide-react';

export default function Sidebar({ currentUser, onLogout }) {
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === 'admin';
  const [loggingOut, setLoggingOut] = useState(false);

  const navItems = isAdmin
    ? [
        { path: '/admin/dashboard',   label: 'Command Center',    icon: LayoutDashboard, badge: null },
        { path: '/admin/reports',     label: 'Citizen Complaints', icon: MessageSquareWarning, badge: 'new' },
        { path: '/admin/map',         label: 'GIS Heatmap',       icon: Map,            badge: null },
        { path: '/admin/work-orders', label: 'Work Orders',       icon: Wrench,         badge: null },
        { path: '/admin/analytics',   label: 'Analytics & Risk',  icon: BarChart3,      badge: null },
        { path: '/admin/settings',    label: 'Settings',          icon: Settings,       badge: null },
      ]
    : [
        { path: '/user/dashboard',    label: 'Citizen Hub',        icon: LayoutDashboard, badge: null },
        { path: '/user/report',       label: 'Report Road Issue',  icon: Scan,           badge: null },
        { path: '/user/my-reports',   label: 'My Complaints',      icon: MessageSquareWarning, badge: null },
        { path: '/user/map',          label: 'Smart GIS Map',      icon: Map,            badge: null },
        { path: '/user/settings',     label: 'Settings',           icon: Settings,       badge: null },
      ];

  const accent       = isAdmin ? '#06b6d4' : '#10b981';
  const accentLight  = isAdmin ? 'rgba(6,182,212,0.12)'  : 'rgba(16,185,129,0.12)';
  const accentBorder = isAdmin ? 'rgba(6,182,212,0.25)'  : 'rgba(16,185,129,0.25)';
  const accentText   = isAdmin ? '#22d3ee' : '#34d399';

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      if (onLogout) onLogout();
      navigate('/');
    }, 600);
  };

  // Get first letter + last letter of name for avatar
  const userInitials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <aside className="w-64 flex flex-col h-screen sticky top-0 z-30 select-none"
      style={{ background: 'linear-gradient(180deg, #050d1f 0%, #020617 100%)', borderRight: '1px solid rgba(255,255,255,0.04)' }}>

      {/* ══ Brand ══ */}
      <div className="p-5 space-y-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 shrink-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #6366f1)', boxShadow: `0 4px 16px ${accent}30` }}>
              <Navigation size={18} className="text-white rotate-45" />
            </div>
            <div className="absolute -inset-0.5 rounded-xl blur opacity-20 animate-pulse-glow"
              style={{ background: accent }} />
          </div>
          <div className="min-w-0">
            <h1 className="font-display font-black text-base text-white leading-none flex items-center gap-2">
              ROADNEX
              <span className="text-[8px] px-1.5 py-0.5 rounded-full font-mono font-bold"
                style={{ background: accentLight, color: accentText, border: `1px solid ${accentBorder}` }}>
                v2.0
              </span>
            </h1>
            <p className="text-[9px] text-slate-500 font-medium mt-0.5 truncate">Smart Infrastructure AI</p>
          </div>
        </div>

        {/* Role pill */}
        <div className="flex items-center justify-between px-3 py-2.5 rounded-xl"
          style={{ background: accentLight, border: `1px solid ${accentBorder}` }}>
          <div className="flex items-center gap-2">
            {isAdmin
              ? <Shield size={13} style={{ color: accentText }} />
              : <Sparkles size={13} style={{ color: accentText }} />
            }
            <span className="text-[11px] font-bold" style={{ color: accentText }}>
              {isAdmin ? 'Municipal Admin' : 'Citizen Portal'}
            </span>
          </div>
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute w-2.5 h-2.5 rounded-full opacity-50"
              style={{ background: accentText }} />
            <span className="relative w-2 h-2 rounded-full" style={{ background: accentText }} />
          </div>
        </div>
      </div>

      {/* ══ Nav ══ */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 pb-3 text-[9px] font-bold text-slate-600 uppercase tracking-widest flex items-center justify-between">
          <span>Operations</span>
          <Activity size={10} className="text-slate-700" />
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[12.5px] font-semibold
                transition-all duration-200 group relative overflow-hidden
                ${isActive
                  ? isAdmin
                    ? 'text-cyan-300'
                    : 'text-emerald-300'
                  : 'text-slate-500 hover:text-slate-200'
                }
              `}
              style={({ isActive }) => isActive ? {
                background: accentLight,
                borderLeft: `2.5px solid ${accent}`,
                paddingLeft: '12px',
                boxShadow: `inset 0 0 24px ${accent}08, 0 2px 8px rgba(0,0,0,0.3)`,
              } : {}}
            >
              {({ isActive }) => (
                <>
                  {/* Subtle hover bg */}
                  {!isActive && (
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ background: 'rgba(255,255,255,0.03)' }} />
                  )}
                  <div className="flex items-center gap-3 relative z-10">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 ${isActive ? 'scale-100' : 'scale-95 group-hover:scale-100'}`}
                      style={isActive
                        ? { background: accentLight, border: `1px solid ${accentBorder}` }
                        : { background: 'rgba(255,255,255,0.04)' }
                      }>
                      <Icon size={14} style={{ color: isActive ? accent : undefined }} />
                    </div>
                    <span>{item.label}</span>
                  </div>
                  <div className="relative z-10 flex items-center gap-1.5">
                    {item.badge === 'new' && (
                      <span className="text-[8px] px-1.5 py-0.5 rounded-full font-bold"
                        style={{ background: 'rgba(244,63,94,0.15)', color: '#fb7185', border: '1px solid rgba(244,63,94,0.3)' }}>
                        NEW
                      </span>
                    )}
                    <ChevronRight size={12}
                      className={`transition-all duration-200 ${isActive ? 'opacity-60' : 'opacity-0 group-hover:opacity-40'}`}
                      style={{ color: accent }} />
                  </div>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ══ User + Logout ══ */}
      <div className="p-3 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        {/* User info */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-black text-xs shrink-0"
            style={{ background: `linear-gradient(135deg, ${accent}, ${accent}80)`, color: 'white' }}>
            {userInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold text-slate-200 truncate">{currentUser?.name || 'User'}</p>
            <p className="text-[9px] text-slate-500 truncate">{currentUser?.email || ''}</p>
          </div>
        </div>

        {/* Logout */}
        <button onClick={handleLogout} disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[12px] font-semibold transition-all duration-200 cursor-pointer group"
          style={{ color: '#64748b' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.08)'; e.currentTarget.style.color = '#fb7185'; }}
          onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = '#64748b'; }}
        >
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {loggingOut
              ? <span className="w-3 h-3 border-2 border-rose-400/30 border-t-rose-400 rounded-full animate-spin" />
              : <LogOut size={13} />
            }
          </div>
          {loggingOut ? 'Signing out...' : 'Sign Out'}
        </button>

        {/* System Status */}
        <div className="flex items-center gap-2.5 px-3 py-2">
          <div className="relative">
            <span className="animate-ping absolute w-2.5 h-2.5 rounded-full bg-emerald-400 opacity-40" />
            <span className="relative w-2 h-2 rounded-full bg-emerald-500 block" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-400">AI Vision Model 2.0</p>
            <p className="text-[8px] text-emerald-500 font-mono">Active Monitoring</p>
          </div>
          <div className="ml-auto">
            <Cpu size={11} className="text-slate-600" />
          </div>
        </div>
      </div>
    </aside>
  );
}
