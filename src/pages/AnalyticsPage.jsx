import React from 'react';
import { BarChart3, PieChart, TrendingUp, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  LineChart, 
  Line, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { DEFECTS_BY_TYPE_DATA, SEVERITY_DISTRIBUTION_DATA, WATERLOGGING_RAINFALL_DATA } from '../data/mockData';

export default function AnalyticsPage() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-custom-taupe tracking-tight flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-custom-terra" /> Infrastructure Telemetry & Performance Analytics
        </h1>
        <p className="text-xs text-custom-sage font-medium mt-1">
          Historical road degradation trends, severity distribution benchmarks, and municipal SLA metrics.
        </p>
      </div>

      {/* Resolution Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-sm border border-custom-sage/30 p-6 rounded-2xl border border-custom-sage/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-custom-terra/10 border border-custom-terra/20 text-custom-terra flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-custom-sage font-medium font-semibold uppercase tracking-wider">Avg Resolution Time</span>
            <h3 className="text-2xl font-extrabold text-custom-taupe mt-0.5">3.2 Days</h3>
            <span className="text-[11px] text-emerald-400 font-medium">↓ 1.4 days improvement</span>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-custom-sage/30 p-6 rounded-2xl border border-custom-sage/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-custom-sage font-medium font-semibold uppercase tracking-wider">Resolution Rate</span>
            <h3 className="text-2xl font-extrabold text-custom-taupe mt-0.5">82%</h3>
            <span className="text-[11px] text-emerald-400 font-medium">182 resolved this month</span>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-custom-sage/30 p-6 rounded-2xl border border-custom-sage/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-custom-sage font-medium font-semibold uppercase tracking-wider">AI Duplicate Reduction</span>
            <h3 className="text-2xl font-extrabold text-custom-taupe mt-0.5">27% Less Backlog</h3>
            <span className="text-[11px] text-amber-400 font-medium">Neural complaint merging</span>
          </div>
        </div>
      </div>

      {/* Charts Grid 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Donut Chart: Defects by Type */}
        <div className="bg-white shadow-sm border border-custom-sage/30 p-6 rounded-2xl border border-custom-sage/30 space-y-4">
          <h3 className="text-base font-bold text-custom-taupe flex items-center gap-2">
            <PieChart className="w-5 h-5 text-custom-terra" /> Defects by Infrastructure Type
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={DEFECTS_BY_TYPE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {DEFECTS_BY_TYPE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Severity Distribution */}
        <div className="bg-white shadow-sm border border-custom-sage/30 p-6 rounded-2xl border border-custom-sage/30 space-y-4">
          <h3 className="text-base font-bold text-custom-taupe flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-orange-400" /> Severity Level Breakdown
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SEVERITY_DISTRIBUTION_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="count" name="Total Defects" radius={[8, 8, 0, 0]}>
                  {SEVERITY_DISTRIBUTION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Line Chart: 6-Month Defect & Repair Trend */}
      <div className="bg-white shadow-sm border border-custom-sage/30 p-6 rounded-2xl border border-custom-sage/30 space-y-4">
        <h3 className="text-base font-bold text-custom-taupe flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" /> 6-Month Detected Defects vs Resolved Trend
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={WATERLOGGING_RAINFALL_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="defects" name="Detected Defects" stroke="#ef4444" strokeWidth={3} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="hotspots" name="Resolved Tickets" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
