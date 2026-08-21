import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({ title, value, trend, trendUp, icon: Icon, colorTheme }) {
  const themes = {
    cyan: {
      border: 'hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      glow: 'shadow-cyan-500/5'
    },
    rose: {
      border: 'hover:border-rose-500/40',
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      glow: 'shadow-rose-500/5'
    },
    orange: {
      border: 'hover:border-orange-500/40',
      iconBg: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      glow: 'shadow-orange-500/5'
    },
    amber: {
      border: 'hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      glow: 'shadow-amber-500/5'
    },
    emerald: {
      border: 'hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      glow: 'shadow-emerald-500/5'
    }
  };

  const currentTheme = themes[colorTheme] || themes.cyan;

  return (
    <div className={`glass-panel p-5 rounded-2xl border border-slate-800/80 transition-all duration-200 ${currentTheme.border} ${currentTheme.glow}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${currentTheme.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <h3 className="text-2xl font-extrabold text-white tracking-tight">{value}</h3>
        {trend && (
          <span className={`text-xs font-semibold flex items-center gap-0.5 ${trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
