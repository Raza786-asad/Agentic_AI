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
  title, // support title passed by dashboards
  value,
  suffix = '',
  icon: Icon,
  accent, 
  colorTheme, // support colorTheme passed by dashboards
  trend,         // 'up' | 'down' | 'neutral' OR the text passed by dashboard
  trendValue,    // e.g. '+12%'
  trendUp,       // boolean passed by dashboards
  description,
  animate = true,
}) {
  const { count, ref } = useCounter(value);
  const displayValue = animate ? count : value;

  // Earthy color map + distinct red for alert
  const themeColors = {
    cyan: '#374151',    // Taupe (Grey)
    emerald: '#a3a093', // Sage
    violet: '#374151',  // Taupe (Grey)
    amber: '#e66240',   // Terra
    orange: '#e66240',  // Terra
    rose: '#d94a38',    // Strong Red Alert
  };

  const finalAccent = themeColors[colorTheme] || accent || '#374151';
  const displayLabel = title || label;

  // Reconcile trend props from Dashboards vs LandingPage
  let t = null;
  if (trend === 'up' || trend === 'down' || trend === 'neutral') {
    const trendConfig = {
      up:      { icon: TrendingUp,   color: '#10b981', label: trendValue },
      down:    { icon: TrendingDown, color: '#d94a38', label: trendValue }, // Strong red
      neutral: { icon: Minus,        color: '#a3a093', label: trendValue },
    };
    t = trendConfig[trend];
  } else if (trendUp !== undefined) {
    // Handling dashboard style props
    t = {
      icon: trendUp ? TrendingUp : TrendingDown,
      color: trendUp ? '#10b981' : '#d94a38',
      label: trend
    };
  }

  return (
    <div ref={ref} className="bg-white p-8 rounded-2xl  shadow-md shadow-custom-sage/10 relative overflow-hidden group hover:border-custom-sage/60 transition-colors">
      {/* Glow blob */}
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-15 pointer-events-none transition-opacity group-hover:opacity-25"
        style={{ background: finalAccent }} />

      <div className="relative z-10">
        {/* Top row */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md shadow-custom-sage/10"
            style={{ background: finalAccent + '15', border: `1px solid ${finalAccent}30` }}>
            <Icon size={18} style={{ color: finalAccent }} />
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
          <span className="font-display font-black text-3xl text-custom-taupe">{displayValue}</span>
          {suffix && <span className="font-display font-black text-xl ml-0.5" style={{ color: finalAccent }}>{suffix}</span>}
        </div>

        {/* Label */}
        <p className="text-[11px] font-bold text-custom-sage uppercase tracking-wide">{displayLabel}</p>

        {/* Description */}
        {description && (
          <p className="text-[10px] text-custom-sage mt-1.5 leading-relaxed font-medium">{description}</p>
        )}
      </div>
    </div>
  );
}
