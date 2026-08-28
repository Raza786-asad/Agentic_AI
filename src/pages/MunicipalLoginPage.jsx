import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Mail, Lock, ArrowRight, ChevronLeft, Eye, EyeOff,
  Wrench, ShieldAlert, CheckCircle, ClipboardList, MapPin
} from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

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

function Bullet({ icon: Icon, text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-custom-terra/10 border border-custom-terra/20">
        <Icon size={14} className="text-custom-terra" />
      </div>
      <p className="text-xs text-custom-taupe/80 leading-relaxed font-medium">{text}</p>
    </div>
  );
}

export default function MunicipalLoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      
      if (data.user.role !== 'municipal') {
        throw new Error('This portal is reserved for Municipal Corporation Staff.');
      }

      onLogin(data.user, data.token);
      navigate('/municipal/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const res = await fetch('/api/auth/google-municipal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Google login failed.');
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

      {/* LEFT PANEL - Portal Details */}
      <div className="hidden lg:flex lg:w-[48%] relative flex-col justify-start gap-16 p-12 overflow-hidden border-r border-custom-sage/20 bg-white/40 backdrop-blur-md">
        <div className="relative z-10">
          <Link to="/" className="flex flex-col gap-1 w-fit">
            <img src="/logo.png" alt="ROADNEX" className="h-14 object-contain" />
            <p className="text-[10px] text-custom-sage font-semibold uppercase tracking-wider">Municipal Operations Portal</p>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="font-display font-black text-4xl text-custom-taupe leading-tight mb-3">
              Municipal Staff<br />
              <span className="text-custom-terra">Operations Control</span>
            </h2>
            <p className="text-custom-sage text-sm leading-relaxed max-w-sm font-medium">
              Access assigned road maintenance tickets, submit real-time photographic resolution logs, and verify work orders.
            </p>
          </div>

          <div className="space-y-4">
            <Bullet icon={ClipboardList} text="Real-time access to assigned pothole maintenance tickets" />
            <Bullet icon={MapPin} text="GIS coordinate pins mapping exact defect sites" />
            <Bullet icon={Wrench} text="Upload post-repair photos with integrated GPS verification" />
            <Bullet icon={CheckCircle} text="Immediate sync with admin verification queues for fast approval" />
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-[420px] space-y-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-custom-sage hover:text-custom-taupe transition-colors font-bold">
            <ChevronLeft size={15} /> Back to Home
          </Link>

          <div className="bg-white border border-custom-sage/30 rounded-3xl p-8 space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-custom-terra/0 via-custom-terra to-custom-terra/0" />
            
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-custom-taupe">Staff Login</h3>
              <p className="text-xs text-custom-sage font-medium">Enter your credentials to access the municipal dashboard.</p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold flex items-center gap-2">
                <ShieldAlert size={14} className="shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="MUNICIPAL EMAIL"
                type="email"
                icon={Mail}
                placeholder="staff@roadguard.gov.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />

              <InputField
                label="PASSWORD"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-custom-taupe text-white text-xs font-extrabold rounded-xl hover:bg-custom-taupe/90 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Authenticating...' : 'Sign In to Portal'}
                <ArrowRight size={14} />
              </button>
            </form>



            <div className="border-t border-custom-sage/20 pt-4 text-center">
              <p className="text-xs text-custom-sage font-medium">
                New municipal contractor?{' '}
                <Link to="/municipal/register" className="text-custom-terra font-bold hover:underline">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
