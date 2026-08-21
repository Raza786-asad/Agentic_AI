import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User, Lock, Mail, ArrowRight, CheckCircle2, ChevronLeft,
  Phone, Eye, EyeOff, Navigation, Zap, Shield, Camera, MapPin,
  AlertCircle
} from 'lucide-react';

/* ─── Password Strength ─── */
function PasswordStrength({ password }) {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 6)  score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const levels = [
      { label: '',         color: '#1e293b' },
      { label: 'Weak',     color: '#f43f5e' },
      { label: 'Fair',     color: '#f59e0b' },
      { label: 'Good',     color: '#06b6d4' },
      { label: 'Strong',   color: '#10b981' },
      { label: 'Very Strong', color: '#10b981' },
    ];
    return { score, ...levels[score] };
  }, [password]);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="flex-1 h-1 rounded-full transition-all duration-500"
            style={{ background: i <= strength.score ? strength.color : 'rgba(255,255,255,0.06)' }} />
        ))}
      </div>
      {strength.label && (
        <p className="text-[10px] font-bold" style={{ color: strength.color }}>
          Password strength: {strength.label}
        </p>
      )}
    </div>
  );
}

/* ─── Password Input ─── */
function PasswordInput({ label, value, onChange, placeholder, accentColor = '#10b981', showStrength = false, confirmOf }) {
  const [show, setShow] = useState(false);
  const mismatch = confirmOf !== undefined && value && confirmOf !== value;

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-300 block">{label}</label>
      <div className="relative">
        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: accentColor + '90' }} />
        <input
          type={show ? 'text' : 'password'}
          required
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="input-premium pr-10"
          style={{ paddingLeft: '40px', borderColor: mismatch ? 'rgba(244,63,94,0.5)' : undefined }}
        />
        <button type="button" tabIndex={-1} onClick={() => setShow(!show)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {showStrength && <PasswordStrength password={value} />}
      {mismatch && (
        <p className="text-[10px] flex items-center gap-1" style={{ color: '#f43f5e' }}>
          <AlertCircle size={10} /> Passwords don't match
        </p>
      )}
    </div>
  );
}

export default function RegisterPage({ onLogin }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (!/^\+?[0-9]{10,15}$/.test(phone)) { setError('Please enter a valid phone number (10–15 digits).'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, password, confirmPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed.');
      onLogin(data.user, data.token);
      navigate('/user/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = name && phone && email && password && password === confirmPassword && password.length >= 6;

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ backgroundColor: '#0a0e1a', color: '#e2e8f0' }}>

      {/* ── BG ── */}
      <div className="orb-emerald absolute w-[600px] h-[600px] -top-32 -left-32 pointer-events-none" />
      <div className="orb-violet  absolute w-[400px] h-[400px] bottom-0 right-0  pointer-events-none" />
      <div className="bg-grid absolute inset-0 pointer-events-none opacity-40" />

      {/* ═══════════ LEFT PANEL ═══════════ */}
      <div className="hidden lg:flex lg:w-[46%] relative flex-col justify-between p-12 overflow-hidden" style={{ background: 'linear-gradient(160deg, #0d1117, #0a0e1a, #0f1729)' }}>
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)' }} />

        {/* Brand */}
        <div className="relative z-10 animate-fade-down">
          <Link to="/" className="flex items-center gap-3 w-fit">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Navigation size={18} className="text-white rotate-45" />
            </div>
            <div>
              <h1 className="font-display font-black text-lg text-white leading-none">ROADNEX</h1>
              <p className="text-[10px] text-slate-400">Smart Infrastructure AI</p>
            </div>
          </Link>
        </div>

        {/* Center */}
        <div className="relative z-10 space-y-8 animate-fade-up delay-200">
          <div>
            <h2 className="font-display font-black text-4xl text-white leading-tight mb-3">
              Join the<br />
              <span className="gradient-text-emerald">Smart City</span><br />
              Movement.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Become a citizen reporter and help your city identify road hazards before they cause accidents. Your reports matter.
            </p>
          </div>

          {/* Steps preview */}
          <div className="space-y-4">
            {[
              { step: '1', text: 'Create your free citizen account', color: '#10b981' },
              { step: '2', text: 'Snap & upload road defect photos', color: '#06b6d4' },
              { step: '3', text: 'AI analyzes and creates a priority report', color: '#8b5cf6' },
              { step: '4', text: 'Municipal team dispatches repair crew', color: '#f59e0b' },
            ].map(s => (
              <div key={s.step} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 font-mono font-black text-[10px]"
                  style={{ background: s.color + '20', border: `1px solid ${s.color}40`, color: s.color }}>
                  {s.step}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mt-0.5">{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 animate-fade-up delay-400">
          <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <Shield size={18} className="text-emerald-400 shrink-0" />
            <p className="text-xs text-slate-400">Your data is encrypted and compliant with Smart City data protection regulations.</p>
          </div>
        </div>
      </div>

      {/* ═══════════ RIGHT PANEL ═══════════ */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10 overflow-y-auto">
        <div className="w-full max-w-[440px] space-y-5 animate-scale-in my-8">

          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors font-semibold">
            <ChevronLeft size={15} /> Back to Login
          </Link>

          <div className="glass-card rounded-2xl p-8 space-y-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0" />

            {/* Header */}
            <div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.2))', border: '1px solid rgba(16,185,129,0.3)' }}>
                <User size={22} className="text-emerald-400" />
              </div>
              <h2 className="font-display font-black text-2xl text-white">Create Citizen Account</h2>
              <p className="text-xs text-slate-400 mt-1">Join ROADNEX to report potholes and monitor smart infrastructure.</p>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3.5 rounded-xl flex items-center gap-2 text-xs font-bold animate-fade-down"
                style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)', color: '#fb7185' }}>
                <AlertCircle size={14} className="shrink-0" /> {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/60" />
                  <input type="text" required placeholder="Rahul Sharma" value={name} onChange={e => setName(e.target.value)}
                    className="input-premium input-premium-emerald" style={{ paddingLeft: '40px' }} />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Phone Number</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/60" />
                  <input type="tel" required placeholder="9876543210" value={phone} onChange={e => setPhone(e.target.value)}
                    className="input-premium input-premium-emerald" style={{ paddingLeft: '40px' }} />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/60" />
                  <input type="email" required placeholder="rahul@example.com" value={email} onChange={e => setEmail(e.target.value)}
                    className="input-premium input-premium-emerald" style={{ paddingLeft: '40px' }} />
                </div>
              </div>

              {/* Password */}
              <PasswordInput
                label="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                showStrength
              />

              {/* Confirm Password */}
              <PasswordInput
                label="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                confirmOf={password}
              />

              {/* Submit */}
              <button type="submit" disabled={loading || !isFormValid}
                className="w-full py-3.5 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 text-white mt-2 cursor-pointer disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #10b981, #0891b2)',
                  boxShadow: isFormValid && !loading ? '0 8px 24px rgba(16,185,129,0.3)' : 'none'
                }}
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating Account...</>
                ) : (
                  <>Create Citizen Account <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            {/* Validation checklist */}
            <div className="space-y-1.5 pt-1">
              {[
                { ok: name.length > 1,   text: 'Full name provided' },
                { ok: /^\+?[0-9]{10,15}$/.test(phone), text: 'Valid phone number (10–15 digits)' },
                { ok: email.includes('@'), text: 'Valid email address' },
                { ok: password.length >= 6, text: 'Password minimum 6 characters' },
                { ok: password === confirmPassword && !!confirmPassword, text: 'Passwords match' },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px]"
                  style={{ color: c.ok ? '#34d399' : '#475569' }}>
                  <CheckCircle2 size={10} className={c.ok ? 'text-emerald-400' : 'text-slate-600'} />
                  {c.text}
                </div>
              ))}
            </div>

            {/* Login link */}
            <p className="text-center text-xs text-slate-400 pt-2 border-t border-white/5">
              Already have an account?{' '}
              <Link to="/login" className="font-bold hover:opacity-80 transition-opacity" style={{ color: '#10b981' }}>
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
