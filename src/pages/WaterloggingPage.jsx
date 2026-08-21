import React from 'react';
import { Droplets, CloudRain, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { WATERLOGGING_RAINFALL_DATA } from '../data/mockData';

export default function WaterloggingPage() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
          <Droplets className="w-7 h-7 text-cyan-400" /> Waterlogging & Hydro-Intelligence
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Correlating monsoon rainfall telemetry with subterranean drainage bottlenecks and asphalt erosion patterns.
        </p>
      </div>

      {/* Hotspot Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Hotspots</span>
          <h3 className="text-3xl font-extrabold text-cyan-400 mt-2">34</h3>
          <p className="text-[11px] text-slate-400 mt-1">Monitored across 6 zones</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">High Risk Slopes</span>
          <h3 className="text-3xl font-extrabold text-orange-400 mt-2">18</h3>
          <p className="text-[11px] text-slate-400 mt-1">Subgrade degradation alert</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Drainage Blocked</span>
          <h3 className="text-3xl font-extrabold text-amber-400 mt-2">11</h3>
          <p className="text-[11px] text-slate-400 mt-1">Culvert obstruction flagged</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Critical Submerged</span>
          <h3 className="text-3xl font-extrabold text-rose-400 mt-2">5</h3>
          <p className="text-[11px] text-slate-400 mt-1">Immediate pumping required</p>
        </div>
      </div>

      {/* Recharts Chart: Waterlogging Events vs Rainfall */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-blue-400" /> Waterlogging Events vs Rainfall (Monsoon Telemetry)
            </h3>
            <p className="text-xs text-slate-400">Monthly precipitation (mm) correlated with road pothole expansion</p>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={WATERLOGGING_RAINFALL_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" stroke="#38bdf8" tick={{ fontSize: 12 }} label={{ value: 'Rainfall (mm)', angle: -90, position: 'insideLeft', fill: '#38bdf8' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" tick={{ fontSize: 12 }} label={{ value: 'Defects / Hotspots', angle: 90, position: 'insideRight', fill: '#f43f5e' }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar yAxisId="left" dataKey="rainfall" name="Rainfall (mm)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="hotspots" name="Waterlogging Hotspots" stroke="#06b6d4" strokeWidth={3} dot={{ r: 5 }} />
              <Line yAxisId="right" type="monotone" dataKey="defects" name="Total Road Defects" stroke="#ef4444" strokeWidth={3} dot={{ r: 5 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Hydro Insight Callout */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-500/30 flex items-start gap-4 shadow-xl">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
          <Lightbulb className="w-6 h-6" />
        </div>
        <div className="space-y-1 text-xs">
          <h4 className="text-sm font-extrabold text-cyan-300 uppercase tracking-wider">AI Hydro-Infrastructure Insight</h4>
          <p className="text-slate-200 leading-relaxed font-medium">
            Main Road Sector 18 has experienced repeated waterlogging after rainfall exceeding 65mm. The nearby pothole cluster suggests a subterranean drainage-related road degradation pattern. Installing a 450mm storm overflow culvert will reduce pothole recurrence by 74%.
          </p>
        </div>
      </div>
    </div>
  );
}
