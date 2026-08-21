import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock, ArrowRight, ChevronLeft, Eye, EyeOff,
  Shield, Navigation, BarChart3, Wrench, Map, Cpu, AlertCircle
} from 'lucide-react';

export default function AdminLoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState('admin@roadguard.gov.in');
  const [password, setPassword] = useState('admin123');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Admin authentication failed.');
      onLogin(data.user, data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const adminCapabilities = [
    { icon: BarChart3, text: 'City-wide analytics and AI priority queue', color: '#06b6d4' },
    { icon: Wrench,    text: 'Automated work order dispatch and tracking', color: '#8b5cf6' },
    { icon: Map,       text: 'Interactive GIS defect heatmap',             color: '#10b981' },
    { icon: Cpu,       text: 'AI model telemetry and inference logs',      color: '#f59e0b' },
  ];

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ backgroundColor: '#0a0e1a', color: '#e2e8f0' }}>

      {/* BG */}
      <div className="orb-cyan   absolute w-[600px] h-[600px] -top-32 -right-32 pointer-events-none" />
      <div className="orb-violet absolute w-[500px] h-[500px] bottom-0 -left-32   pointer-events-none" />
      <div className="bg-grid absolute inset-0 opacity-40 pointer-events-none" />

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[46%] relative flex-col justify-between p-12 overflow-hidden" style={{ background: 'linear-gradient(160deg, #0d1117, #0a0e1a, #0f1729)' }}>
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)' }} />

        <div className="relative z-10 animate-fade-down">
          <Link to="/" className="flex items-center gap-3 w-fit">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Navigation size={18} className="text-white rotate-45" />
            </div>
            <div>
              <h1 className="font-display font-black text-lg text-white leading-none">ROADNEX</h1>
              <p className="text-[10px] text-slate-400">Smart Infrastructure AI</p>
            </div>
          </Link>
        </div>

        <div className="relative z-10 space-y-8 animate-fade-up delay-200">
          <div>
            <div className="badge badge-cyan mb-4 inline-flex">Restricted Access</div>
            <h2 className="font-display font-black text-4xl text-white leading-tight mb-3">
              Municipal<br />
              <span className="gradient-text-cyan">Command</span><br />
              Center.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Authorized municipal personnel only. This admin portal provides complete oversight of all city road infrastructure operations.
            </p>
          </div>

          <div className="space-y-4">
            {adminCapabilities.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: c.color + '15', border: `1px solid ${c.color}30` }}>
                    <Icon size={15} style={{ color: c.color }} />
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">{c.text}</p>
                </div>
              );
            })}
          </div>

          {/* Security notice */}
          <div className="p-4 rounded-xl space-y-2" style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.15)' }}>
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-rose-400 shrink-0" />
              <p className="text-xs font-bold text-rose-300">Restricted Access Zone</p>
            </div>
            <p className="text-[10px] text-slate-500">All admin actions are logged and audited. Unauthorized access attempts are recorded and reported.</p>
          </div>
        </div>

        <div className="relative z-10 animate-fade-up delay-400">
          <p className="text-xs text-slate-500 italic">"ROADNEX Admin Panel has reduced our dispatch overhead by 80%."</p>
          <p className="text-[10px] text-slate-600 mt-1">— Smart City Operations Director</p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-[420px] space-y-5 animate-scale-in">

          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors font-semibold">
            <ChevronLeft size={15} /> Back to Home
          </Link>

          <div className="glass-card rounded-2xl p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0" />

            <div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(99,102,241,0.2))', border: '1px solid rgba(6,182,212,0.3)' }}>
                <Shield size={22} className="text-cyan-400" />
              </div>
              <h2 className="font-display font-black text-2xl text-white">Admin Authentication</h2>
              <p className="text-xs text-slate-400 mt-1">Municipal authority credential verification required.</p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl flex items-center gap-2 text-xs font-bold animate-fade-down"
                style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)', color: '#fb7185' }}>
                <AlertCircle size={14} className="shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Admin ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Government Admin ID</label>
                <div className="relative">
                  <Shield size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/60" />
                  <input
                    type="text"
                    required
                    placeholder="admin@roadguard.gov.in"
                    value={adminId}
                    onChange={e => setAdminId(e.target.value)}
                    className="input-premium"
                    style={{ paddingLeft: '40px', borderColor: 'rgba(6,182,212,0.2)' }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(6,182,212,0.6)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(6,182,212,0.1)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(6,182,212,0.2)'; e.currentTarget.style.boxShadow = ''; }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Secure Passphrase</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/60" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input-premium pr-10"
                    style={{ paddingLeft: '40px', borderColor: 'rgba(6,182,212,0.2)' }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(6,182,212,0.6)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(6,182,212,0.1)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(6,182,212,0.2)'; e.currentTarget.style.boxShadow = ''; }}
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 text-white mt-2 cursor-pointer disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6, #6366f1)', boxShadow: loading ? 'none' : '0 8px 24px rgba(6,182,212,0.3)' }}
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Authenticating...</>
                ) : (
                  <>Access Command Center <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-white/5 space-y-3">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Admin Access Includes:</p>
              {['City-wide GIS heatmap and defect analytics', 'Work order dispatch and contractor management', 'Complaint deduplication and priority queue'].map(f => (
                <div key={f} className="flex items-center gap-2 text-[11px] text-slate-400">
                  <div className="w-1 h-1 rounded-full bg-cyan-400/60 shrink-0" />
                  {f}
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-slate-500">
              Not an admin?{' '}
              <Link to="/login" className="font-bold hover:opacity-80 transition-opacity" style={{ color: '#10b981' }}>
                Citizen portal →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
