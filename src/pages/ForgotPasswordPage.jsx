import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API request delay
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full glass-panel border border-slate-900 rounded-3xl p-8 space-y-6 shadow-2xl relative z-10 bg-slate-900/20">
        
        {/* Navigation back */}
        <Link to="/login" className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 text-xs font-semibold transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Login
        </Link>

        {!submitted ? (
          <>
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-600 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                <Mail className="w-6 h-6 text-slate-100" />
              </div>
              <h1 className="text-xl font-extrabold text-slate-100 tracking-tight">
                Reset Citizen Password
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                Enter your email address to receive a secure password reset link.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="rahul@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-extrabold text-xs bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-slate-100 shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Sending Request...' : 'Send Recovery Link'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          /* SUCCESS STATE */
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-extrabold text-slate-100 tracking-tight">Recovery Email Sent</h1>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              If an account is associated with <span className="text-slate-200 font-bold">{email}</span>, you will receive an email shortly with instructions on how to reset your password.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="px-6 py-2.5 bg-slate-900 border border-slate-800 text-slate-200 rounded-xl text-xs font-bold inline-block hover:border-slate-700 transition-colors"
              >
                Return to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
