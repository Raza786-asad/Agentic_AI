import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({ title, value, trend, trendUp, icon: Icon, colorTheme = 'cyan' }) {
  const themes = {
    cyan: {
      cardBg: 'from-cyan-950/30 via-slate-900/90 to-slate-950/90 border-cyan-500/30 hover:border-cyan-400/80',
      iconBg: 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400/40',
      accentBar: 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500',
      valueColor: 'text-white'
    },
    rose: {
      cardBg: 'from-rose-950/30 via-slate-900/90 to-slate-950/90 border-rose-500/30 hover:border-rose-400/80',
      iconBg: 'bg-gradient-to-tr from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30 ring-2 ring-rose-400/40',
      accentBar: 'bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500',
      valueColor: 'text-rose-300'
    },
    orange: {
      cardBg: 'from-orange-950/30 via-slate-900/90 to-slate-950/90 border-orange-500/30 hover:border-orange-400/80',
      iconBg: 'bg-gradient-to-tr from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/30 ring-2 ring-orange-400/40',
      accentBar: 'bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500',
      valueColor: 'text-orange-300'
    },
    amber: {
      cardBg: 'from-amber-950/30 via-slate-900/90 to-slate-950/90 border-amber-500/30 hover:border-amber-400/80',
      iconBg: 'bg-gradient-to-tr from-amber-500 to-yellow-600 text-white shadow-lg shadow-amber-500/30 ring-2 ring-amber-400/40',
      accentBar: 'bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500',
      valueColor: 'text-amber-300'
    },
    emerald: {
      cardBg: 'from-emerald-950/30 via-slate-900/90 to-slate-950/90 border-emerald-500/30 hover:border-emerald-400/80',
      iconBg: 'bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400/40',
      accentBar: 'bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500',
      valueColor: 'text-emerald-300'
    }
  };

  const currentTheme = themes[colorTheme] || themes.cyan;

  return (
    <div className={`p-5 rounded-2xl border bg-gradient-to-br transition-all duration-300 relative overflow-hidden group glass-card-hover ${currentTheme.cardBg}`}>
      {/* Top Accent Neon Gradient Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${currentTheme.accentBar}`}></div>

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-extrabold text-slate-300 uppercase tracking-wider">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-200 ${currentTheme.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <h3 className={`text-2xl font-extrabold tracking-tight ${currentTheme.valueColor}`}>{value}</h3>
        {trend && (
          <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border flex items-center gap-0.5 ${
            trendUp 
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm' 
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
          }`}>
            {trendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
