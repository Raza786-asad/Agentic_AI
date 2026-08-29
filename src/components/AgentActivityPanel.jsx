import React from 'react';
import { 
  Bot, CheckCircle2, Loader2, Sparkles, AlertCircle, Shield, 
  MapPin, AlertTriangle, UserCheck, Send, Layers, Eye
} from 'lucide-react';

export default function AgentActivityPanel({ pipelineData, isRunning = false }) {
  if (!pipelineData && !isRunning) return null;

  const defaultAgents = [
    { id: 'orchestrator', name: 'Orchestrator Agent', role: 'Central Coordinator', icon: Layers, status: isRunning ? 'running' : 'completed' },
    { id: 'analysis', name: 'Complaint Analysis Agent', role: 'NLP Keyword & Intent Classifier', icon: Bot, status: 'completed' },
    { id: 'vision', name: 'Image / Road Detection Agent', role: 'Neural Computer Vision Classifier', icon: Eye, status: 'completed' },
    { id: 'location', name: 'Location Intelligence Agent', role: 'Spatial GIS & Zone Mapper', icon: MapPin, status: 'completed' },
    { id: 'priority', name: 'Priority & Risk Agent', role: 'Multi-Factor Risk Scoring', icon: AlertTriangle, status: 'completed' },
    { id: 'verification', name: 'Citizen Verification Agent', role: 'JWT Profile Identity Verification', icon: UserCheck, status: 'completed' },
    { id: 'routing', name: 'Authority Routing Agent', role: 'Jurisdiction & Crew Selector', icon: Shield, status: 'completed' },
    { id: 'notification', name: 'Notification Agent', role: 'Multi-Channel Alert Dispatch', icon: Send, status: 'completed' }
  ];

  const agentLogs = pipelineData?.agentPipeline || defaultAgents;

  return (
    <div className="p-5 bg-slate-950/80 border border-cyan-500/30 rounded-2xl space-y-4 font-sans text-xs shadow-2xl">
      <div className="flex justify-between items-center border-b border-cyan-500/20 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <h3 className="font-black text-white text-xs tracking-wider uppercase">
            Multi-Agent AI Reasoning Activity Stream
          </h3>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold">
          8 Autonomous Agents Orchestrated
        </span>
      </div>

      {/* Agents Stepper Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {agentLogs.map((ag, idx) => {
          const isDone = ag.status === 'completed';
          return (
            <div 
              key={idx} 
              className={`p-3 rounded-xl border transition-all ${
                isDone 
                  ? 'bg-slate-900/80 border-emerald-500/30 text-slate-200' 
                  : 'bg-slate-900/40 border-cyan-500/20 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-white font-extrabold">{ag.agentName || ag.name}</span>
                </div>
                <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  {ag.durationMs ? `${ag.durationMs}ms` : 'OK'}
                </span>
              </div>

              {ag.output && (
                <div className="mt-2 space-y-1 text-[10px] font-mono text-slate-300 border-t border-slate-800 pt-1.5 leading-relaxed">
                  {ag.output.reasoning && (
                    <p className="italic text-cyan-300">"{ag.output.reasoning}"</p>
                  )}
                  {ag.output.issue && (
                    <p className="text-slate-400">&bull; Identified Issue: <span className="text-white font-bold">{ag.output.issue} ({ag.output.confidence}%)</span></p>
                  )}
                  {ag.output.priority && (
                    <p className="text-slate-400">&bull; Calculated Priority: <span className="text-rose-400 font-bold">{ag.output.priority} ({ag.output.priorityScore}/100)</span></p>
                  )}
                  {ag.output.assignedAuthority && (
                    <p className="text-slate-400">&bull; Routed Authority: <span className="text-cyan-300 font-bold">{ag.output.assignedAuthority}</span></p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
