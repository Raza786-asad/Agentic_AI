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
    <div className="min-h-screen flex relative overflow-hidden" style={{ backgroundColor: '#f9f6ef', color: '#374151' }}>

      {/* BG */}
      <div className="absolute w-[600px] h-[600px] -top-32 -right-32 pointer-events-none rounded-full blur-[120px] opacity-15" style={{ background: '#a3a093' }} />
      <div className="absolute w-[500px] h-[500px] bottom-0 -left-32 pointer-events-none rounded-full blur-[120px] opacity-15" style={{ background: '#e66240' }} />
      <div className="bg-grid absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundSize: '40px 40px', backgroundImage: 'radial-gradient(circle, #a3a093 1px, transparent 1px)' }} />

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[46%] relative flex-col justify-start gap-16 p-12 overflow-hidden" style={{ background: 'linear-gradient(160deg, #f9f6ef, #ffffff, #f4f0e6)' }}>
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(163,160,147,0.1) 0%, transparent 70%)' }} />

        <div className="relative z-10 animate-fade-down">
          <Link to="/" className="flex flex-col gap-1 w-fit">
            <img src="/logo.png" alt="ROADNEX" className="h-14 object-contain" />
            <p className="text-[10px] text-custom-sage font-medium">Smart Infrastructure AI</p>
          </Link>
        </div>

        <div className="relative z-10 space-y-8 animate-fade-up delay-200">
          <div>
            <div className="px-2 py-1 bg-custom-terra/10 border border-custom-terra/30 text-custom-terra text-[10px] font-bold uppercase tracking-wider rounded-md mb-4 inline-flex">Restricted Access</div>
            <h2 className="font-display font-black text-4xl text-custom-taupe leading-tight mb-3">
              Municipal<br />
              <span className="text-custom-terra">Command</span><br />
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

        </div>


      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-[420px] space-y-5 animate-scale-in">

          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors font-semibold">
            <ChevronLeft size={15} /> Back to Home
          </Link>

          <div className="glass-card rounded-2xl p-8 space-y-6 relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.8)', borderColor: '#a3a09333' }}>
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-custom-taupe/0 via-custom-taupe to-custom-taupe/0" />

            <div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(55,65,81,0.1)', border: '1px solid rgba(55,65,81,0.2)' }}>
                <Shield size={22} className="text-custom-taupe" />
              </div>
              <h2 className="font-display font-black text-2xl text-custom-taupe">Admin Authentication</h2>
              <p className="text-xs text-custom-sage mt-1">Municipal authority credential verification required.</p>
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
                <label className="text-xs font-bold text-custom-sage">Government Admin ID</label>
                <div className="relative">
                  <Shield size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-custom-taupe/60" />
                  <input
                    type="text"
                    required
                    placeholder="admin@roadguard.gov.in"
                    value={adminId}
                    onChange={e => setAdminId(e.target.value)}
                    className="w-full bg-white/50 border border-custom-sage/30 rounded-xl pr-4 py-3 text-sm text-custom-taupe focus:outline-none focus:border-custom-taupe font-medium transition-all"
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-custom-sage">Secure Passphrase</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-custom-taupe/60" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-white/50 border border-custom-sage/30 rounded-xl pr-10 py-3 text-sm text-custom-taupe focus:outline-none focus:border-custom-taupe font-medium transition-all"
                    style={{ paddingLeft: '40px' }}
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 text-white mt-2 cursor-pointer disabled:opacity-50"
                style={{ background: '#374151', boxShadow: loading ? 'none' : '0 8px 24px rgba(55,65,81,0.3)' }}
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
