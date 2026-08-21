import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Mail, Lock, ArrowRight, CheckCircle2, ChevronLeft,
  Eye, EyeOff, Phone, Navigation, Zap, Shield, Camera, MapPin
} from 'lucide-react';

/* ─── Input Field ─── */
function InputField({ label, type: initialType, value, onChange, placeholder, icon: Icon, hint, extra, required = true, accentColor = '#10b981' }) {
  const [showPass, setShowPass] = useState(false);
  const isPassword = initialType === 'password';
  const type = isPassword ? (showPass ? 'text' : 'password') : initialType;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300">{label}</label>
        {hint}
      </div>
      <div className="relative group">
        <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200"
          style={{ color: accentColor + '90' }} />
        <input
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="input-premium input-premium-emerald pr-10"
          style={{ paddingLeft: '40px' }}
        />
        {isPassword && (
          <button type="button" onClick={() => setShowPass(!showPass)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            tabIndex={-1}
          >
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {extra}
    </div>
  );
}

/* ─── Feature Bullet ─── */
function Bullet({ icon: Icon, text, color = '#06b6d4' }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: color + '15', border: `1px solid ${color}30` }}>
        <Icon size={14} style={{ color }} />
      </div>
      <p className="text-xs text-slate-300 leading-relaxed">{text}</p>
    </div>
  );
}

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('citizen@roadguard.org');
  const [password, setPassword] = useState('citizen123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Google Onboarding states
  const [googleOnboarding, setGoogleOnboarding] = useState(false);
  const [onboardingUserId, setOnboardingUserId] = useState('');
  const [onboardingPhone, setOnboardingPhone] = useState('');
  const [onboardingEmail, setOnboardingEmail] = useState('');
  const [onboardingName, setOnboardingName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed.');
      onLogin(data.user, data.token);
      navigate('/user/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (mockEmail, mockName) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: mockEmail, name: mockName, googleId: 'g_' + Math.random().toString(36).slice(2, 9) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Google login failed.');
      if (data.onboardingRequired) {
        setGoogleOnboarding(true);
        setOnboardingUserId(data.user.id);
        setOnboardingEmail(data.user.email);
        setOnboardingName(data.user.name);
      } else {
        onLogin(data.user, data.token);
        navigate('/user/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/google-onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: onboardingUserId, phone: onboardingPhone })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Onboarding failed.');
      onLogin(data.user, data.token);
      navigate('/user/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ backgroundColor: '#0a0e1a', color: '#e2e8f0' }}>

      {/* ── BG Orbs ── */}
      <div className="orb-emerald absolute w-[600px] h-[600px] -top-32 -left-32 pointer-events-none" />
      <div className="orb-cyan    absolute w-[500px] h-[500px] bottom-0   right-0    pointer-events-none" />
      <div className="bg-grid absolute inset-0 pointer-events-none opacity-40" />

      {/* ═══════════ LEFT PANEL — Brand Visual ═══════════ */}
      <div className="hidden lg:flex lg:w-[48%] relative flex-col justify-between p-12 overflow-hidden" style={{ background: 'linear-gradient(160deg, #0d1117, #0a0e1a, #0f1729)' }}>
        {/* Subtle accent glow */}
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)' }} />

        {/* Top brand */}
        <div className="relative z-10 animate-fade-down">
          <Link to="/" className="flex items-center gap-3 group w-fit">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Navigation size={18} className="text-white rotate-45" />
            </div>
            <div>
              <h1 className="font-display font-black text-lg text-white leading-none">ROADNEX</h1>
              <p className="text-[10px] text-slate-400">Smart Infrastructure AI</p>
            </div>
          </Link>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8 animate-fade-up delay-200">
          <div>
            <h2 className="font-display font-black text-4xl text-white leading-tight mb-3">
              Report. Track.<br />
              <span className="gradient-text-emerald">Resolve.</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Join thousands of citizens helping build safer roads. Your reports directly trigger municipal action within minutes.
            </p>
          </div>

          <div className="space-y-4">
            <Bullet icon={Camera}  color="#10b981" text="AI-powered road defect detection from your phone camera" />
            <Bullet icon={MapPin}  color="#06b6d4" text="GPS-pinned reports on interactive city maps" />
            <Bullet icon={Shield}  color="#8b5cf6" text="Real-time repair status tracking and notifications" />
            <Bullet icon={Zap}     color="#f59e0b" text="Average municipal response time under 42 minutes" />
          </div>

          {/* Demo stats */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { value: '8.4k', label: 'Issues Fixed' },
              { value: '96%', label: 'AI Accuracy' },
              { value: '42m', label: 'Avg Response' },
            ].map(s => (
              <div key={s.label} className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="font-display font-black text-xl text-emerald-400">{s.value}</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wide mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 animate-fade-up delay-400">
          <p className="text-xs text-slate-500 italic">"ROADNEX has transformed how our city handles infrastructure complaints."</p>
          <p className="text-[10px] text-slate-600 mt-1">— Municipal Commissioner, Smart City Division</p>
        </div>
      </div>

      {/* ═══════════ RIGHT PANEL — Form ═══════════ */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-[420px] space-y-6 animate-scale-in">

          {/* Back link */}
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors font-semibold">
            <ChevronLeft size={15} /> Back to Home
          </Link>

          <div className="glass-card rounded-2xl p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0" />

            {!googleOnboarding ? (
              <>
                {/* Header */}
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.2))', border: '1px solid rgba(16,185,129,0.3)' }}>
                    <Camera size={22} className="text-emerald-400" />
                  </div>
                  <h2 className="font-display font-black text-2xl text-white">Citizen Sign In</h2>
                  <p className="text-xs text-slate-400">Submit road photos, log GPS pins, and track complaint statuses.</p>
                </div>

                {/* Error */}
                {error && (
                  <div className="p-3.5 rounded-xl flex items-center gap-2 text-xs font-bold animate-fade-down"
                    style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)', color: '#fb7185' }}>
                    ⚠️ {error}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <InputField
                    label="Citizen Email Address"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    icon={Mail}
                    accentColor="#10b981"
                  />
                  <InputField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    icon={Lock}
                    accentColor="#10b981"
                    hint={
                      <Link to="/forgot-password" className="text-[11px] font-bold hover:opacity-80 transition-opacity" style={{ color: '#10b981' }}>
                        Forgot Password?
                      </Link>
                    }
                  />

                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 text-white mt-2 cursor-pointer disabled:opacity-50"
                    style={{
                      background: loading ? 'rgba(16,185,129,0.5)' : 'linear-gradient(135deg, #10b981, #0891b2)',
                      boxShadow: loading ? 'none' : '0 8px 24px rgba(16,185,129,0.3)'
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      <>Sign In as Citizen <ArrowRight size={16} /></>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative flex items-center">
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">or continue with</span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>

                {/* Google Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { email: 'rahul.sharma@gmail.com', name: 'Rahul Sharma',  label: 'Google (Rahul)' },
                    { email: 'guest.citizen@gmail.com', name: 'Guest Citizen', label: 'Google (Guest)' },
                  ].map(g => (
                    <button key={g.label} type="button" onClick={() => handleGoogleLogin(g.email, g.name)}
                      className="py-3 rounded-xl font-bold text-[11px] flex items-center justify-center gap-2 transition-all duration-200 text-slate-300 cursor-pointer"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                    >
                      <span className="font-black text-emerald-400 text-sm">G</span> {g.label}
                    </button>
                  ))}
                </div>

                {/* Register Link */}
                <p className="text-center text-xs text-slate-400">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-bold hover:opacity-80 transition-opacity" style={{ color: '#10b981' }}>
                    Register here
                  </Link>
                </p>

                {/* Feature bullets */}
                <div className="pt-3 border-t border-white/5 space-y-2">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Citizen Access Includes:</p>
                  {['AI Camera Pothole Detection & Analysis', 'GPS-Pinned Interactive Google Maps Reporting'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-[11px] text-slate-400">
                      <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* ── Google Onboarding ── */
              <>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)' }}>
                    <Phone size={22} className="text-cyan-400" />
                  </div>
                  <h2 className="font-display font-black text-2xl text-white">Complete Registration</h2>
                  <p className="text-xs text-slate-400">
                    Welcome <span className="text-white font-bold">{onboardingName}</span>! Please add your phone number to complete setup.
                  </p>
                </div>

                {error && (
                  <div className="p-3.5 rounded-xl text-xs font-bold"
                    style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)', color: '#fb7185' }}>
                    ⚠️ {error}
                  </div>
                )}

                <form onSubmit={handleOnboardingSubmit} className="space-y-4">
                  <InputField
                    label="Phone Number"
                    type="tel"
                    value={onboardingPhone}
                    onChange={e => setOnboardingPhone(e.target.value)}
                    placeholder="9876543210"
                    icon={Phone}
                    accentColor="#06b6d4"
                  />
                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 text-white cursor-pointer disabled:opacity-50 transition-all"
                    style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', boxShadow: '0 8px 24px rgba(6,182,212,0.25)' }}
                  >
                    {loading ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Completing...</>
                    ) : (
                      <>Complete Profile & Sign In <ArrowRight size={16} /></>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
