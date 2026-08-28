import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Mail, Lock, ArrowRight, ChevronLeft, Eye, EyeOff,
  User, Phone, MapPin, Wrench, ShieldAlert
} from 'lucide-react';

function InputField({ label, type: initialType, value, onChange, placeholder, icon: Icon, required = true }) {
  const [showPass, setShowPass] = useState(false);
  const isPassword = initialType === 'password';
  const type = isPassword ? (showPass ? 'text' : 'password') : initialType;

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-custom-taupe">{label}</label>
      <div className="relative group">
        <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-custom-sage transition-colors duration-200" />
        <input
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-white/60 border border-custom-sage/30 rounded-xl pl-10 pr-10 py-2.5 text-xs text-custom-taupe focus:outline-none focus:border-custom-terra font-medium"
        />
        {isPassword && (
          <button type="button" onClick={() => setShowPass(!showPass)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-custom-sage hover:text-custom-taupe transition-colors cursor-pointer"
            tabIndex={-1}
          >
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function MunicipalRegisterPage({ onLogin }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          confirmPassword,
          role: 'municipal' // Crucial: register as municipal operator
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed.');

      onLogin(data.user, data.token);
      navigate('/municipal/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-custom-cream">
      {/* Background decoration */}
      <div className="absolute w-[600px] h-[600px] -top-32 -left-32 pointer-events-none rounded-full blur-[120px] opacity-25 bg-custom-sage" />
      <div className="absolute w-[500px] h-[500px] bottom-0 right-0 pointer-events-none rounded-full blur-[120px] opacity-15 bg-custom-terra" />
      <div className="bg-grid absolute inset-0 pointer-events-none opacity-20" />

      {/* LEFT PANEL - Onboarding Info */}
      <div className="hidden lg:flex lg:w-[46%] relative flex-col justify-between p-12 overflow-hidden border-r border-custom-sage/20 bg-white/40 backdrop-blur-md">
        <div className="relative z-10">
          <Link to="/" className="flex flex-col gap-1 w-fit">
            <img src="/logo.png" alt="ROADNEX" className="h-14 object-contain" />
            <p className="text-[10px] text-custom-sage font-semibold uppercase tracking-wider">Municipal Onboarding</p>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="font-display font-black text-4xl text-custom-taupe leading-tight">
            Register as a<br />
            <span className="text-custom-terra">Municipal Agency</span>
          </h2>
          <p className="text-custom-sage text-sm leading-relaxed font-medium">
            Join the automated dispatch loop. Setting up your contractor account allows you to receive and verify maintenance tickets directly in your assigned sectors.
          </p>

          <div className="flex items-center gap-3.5 p-4 bg-white/60 border border-custom-sage/20 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-custom-terra/10 border border-custom-terra/20 flex items-center justify-center shrink-0">
              <Wrench className="text-custom-terra w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-custom-taupe">Active Dispatch Integrations</h4>
              <p className="text-[10px] text-custom-sage font-semibold mt-0.5">Noida Development & Infrastructure Authorities</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-custom-sage font-medium">&copy; ROADNEX Smart City Systems v2.0</p>
        </div>
      </div>

      {/* RIGHT PANEL - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-[440px] space-y-6">
          <Link to="/municipal/login" className="inline-flex items-center gap-1.5 text-xs text-custom-sage hover:text-custom-taupe transition-colors font-bold">
            <ChevronLeft size={15} /> Back to Login
          </Link>

          <div className="bg-white border border-custom-sage/30 rounded-3xl p-8 space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-custom-terra/0 via-custom-terra to-custom-terra/0" />

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-custom-taupe">Onboarding Request</h3>
              <p className="text-xs text-custom-sage font-medium">Please enter your agency details to request contractor portal access.</p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold flex items-center gap-2">
                <ShieldAlert size={14} className="shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="AGENCY / OPERATOR FULL NAME"
                type="text"
                icon={User}
                placeholder="e.g. Noida Infra Ltd."
                value={name}
                onChange={e => setName(e.target.value)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="OFFICIAL EMAIL"
                  type="email"
                  icon={Mail}
                  placeholder="contact@agency.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <InputField
                  label="CONTACT PHONE"
                  type="text"
                  icon={Phone}
                  placeholder="9876543210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="PORTAL PASSWORD"
                  type="password"
                  icon={Lock}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <InputField
                  label="CONFIRM PASSWORD"
                  type="password"
                  icon={Lock}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-custom-taupe text-white text-xs font-extrabold rounded-xl hover:bg-custom-taupe/90 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Submitting Registration...' : 'Register Agency'}
                <ArrowRight size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
