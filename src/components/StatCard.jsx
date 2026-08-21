import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

function useCounter(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const numeric = parseFloat(String(target).replace(/[^0-9.]/g, ''));
        const hasDecimal = String(target).includes('.');
        const timer = setInterval(() => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const val = eased * numeric;
          setCount(hasDecimal ? val.toFixed(1) : Math.floor(val));
          if (progress >= 1) clearInterval(timer);
        }, 16);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

export default function StatCard({
  label,
  value,
  suffix = '',
  icon: Icon,
  accent = '#06b6d4',
  trend,         // 'up' | 'down' | 'neutral'
  trendValue,    // e.g. '+12%'
  description,
  animate = true,
}) {
  const { count, ref } = useCounter(value);
  const displayValue = animate ? count : value;

  const trendConfig = {
    up:      { icon: TrendingUp,   color: '#10b981', label: trendValue },
    down:    { icon: TrendingDown, color: '#f43f5e', label: trendValue },
    neutral: { icon: Minus,        color: '#64748b', label: trendValue },
  };
  const t = trend ? trendConfig[trend] : null;

  return (
    <div ref={ref} className="stat-card" style={{ '--card-accent': accent }}>
      {/* Glow blob */}
      <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full blur-2xl opacity-10 pointer-events-none"
        style={{ background: accent }} />

      <div className="relative z-10">
        {/* Top row */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: accent + '18', border: `1px solid ${accent}30` }}>
            <Icon size={18} style={{ color: accent }} />
          </div>

          {t && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold"
              style={{ background: t.color + '12', color: t.color, border: `1px solid ${t.color}25` }}>
              <t.icon size={10} />
              {t.label}
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-1">
          <span className="font-display font-black text-3xl text-white">{displayValue}</span>
          {suffix && <span className="font-display font-black text-xl ml-0.5" style={{ color: accent }}>{suffix}</span>}
        </div>

        {/* Label */}
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>

        {/* Description */}
        {description && (
          <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
}
