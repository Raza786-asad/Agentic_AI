import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({ title, value, trend, trendUp, icon: Icon, colorTheme = 'cyan' }) {
  const themes = {
    cyan: {
      border: 'hover:border-cyan-500/50',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]',
      accentLine: 'bg-cyan-500',
      valueColor: 'text-white'
    },
    rose: {
      border: 'hover:border-rose-500/50',
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.15)]',
      accentLine: 'bg-rose-500',
      valueColor: 'text-rose-300'
    },
    orange: {
      border: 'hover:border-orange-500/50',
      iconBg: 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.15)]',
      accentLine: 'bg-orange-500',
      valueColor: 'text-orange-300'
    },
    amber: {
      border: 'hover:border-amber-500/50',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
      accentLine: 'bg-amber-500',
      valueColor: 'text-amber-300'
    },
    emerald: {
      border: 'hover:border-emerald-500/50',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
      accentLine: 'bg-emerald-500',
      valueColor: 'text-emerald-300'
    }
  };

  const currentTheme = themes[colorTheme] || themes.cyan;

  return (
    <div className={`glass-panel p-5 rounded-2xl border border-slate-800/80 transition-all duration-300 relative overflow-hidden group glass-card-hover ${currentTheme.border}`}>
      {/* Top Accent Line */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${currentTheme.accentLine} opacity-80 group-hover:opacity-100 transition-opacity`}></div>

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-110 duration-200 ${currentTheme.iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3.5 flex items-baseline justify-between">
        <h3 className={`text-2xl font-extrabold tracking-tight ${currentTheme.valueColor}`}>{value}</h3>
        {trend && (
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-0.5 ${
            trendUp 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            {trendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
