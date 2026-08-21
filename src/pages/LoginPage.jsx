import React, { useState } from 'react';
import { Shield, User, Lock, Mail, ArrowRight, Sparkles, CheckCircle2, AlertOctagon, Building2 } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [activeRole, setActiveRole] = useState('admin'); // 'admin' or 'user'
  const [email, setEmail] = useState('admin@roadguard.gov.in');
  const [password, setPassword] = useState('admin123');

  const handleRoleSwitch = (role) => {
    setActiveRole(role);
    if (role === 'admin') {
      setEmail('admin@roadguard.gov.in');
      setPassword('admin123');
    } else {
      setEmail('citizen@roadguard.org');
      setPassword('citizen123');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeRole === 'admin') {
      onLogin({
        name: 'Cmdr. A. Mehta',
        title: 'Chief Urban Engineer',
        email,
        role: 'admin'
      });
    } else {
      onLogin({
        name: 'Rahul Sharma',
        title: 'Verified Citizen User',
        email,
        role: 'user'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glow Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full glass-panel border border-slate-800/90 rounded-3xl p-8 space-y-6 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            RoadGuard <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-xs font-mono border border-cyan-500/30">AI 2.0</span>
          </h1>
          <p className="text-xs text-slate-400">
            Smart City Infrastructure Monitoring & Citizen Portal
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 gap-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => handleRoleSwitch('admin')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeRole === 'admin'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" /> Municipal Admin
          </button>

          <button
            type="button"
            onClick={() => handleRoleSwitch('user')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeRole === 'user'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" /> Citizen User
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              {activeRole === 'admin' ? 'Municipal Officer Email' : 'Citizen Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          {/* Quick Demo Sign-in Button */}
          <button
            type="submit"
            className={`w-full py-3.5 rounded-xl font-extrabold text-xs shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeRole === 'admin'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/25'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-500/25'
            }`}
          >
            <span>
              {activeRole === 'admin' ? '🛡️ Sign In as Municipal Admin' : '👤 Sign In as Citizen User'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Feature Badges for Active Role */}
        <div className="pt-4 border-t border-slate-800 space-y-2 text-[11px]">
          <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
            {activeRole === 'admin' ? 'Admin Access Capabilities:' : 'Citizen Access Capabilities:'}
          </span>
          {activeRole === 'admin' ? (
            <div className="space-y-1.5 text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Full GIS Operations Dashboard & Google Maps</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Review & Count Daily Citizen Complaints Raised</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Kanban Contractor Dispatch & Settings</span>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Real Device Camera Pothole Capture</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Lock Real GPS Pin on Google Maps</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>File Citizen Complaints & Track Status</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
