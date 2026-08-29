import React, { useState } from 'react';
import { 
  Bot, Layers, Eye, MapPin, AlertTriangle, UserCheck, Shield, Send, 
  Play, RefreshCw, CheckCircle2, ArrowRight, Sparkles, Activity, Code, Cpu, Check
} from 'lucide-react';
import AgentActivityPanel from '../components/AgentActivityPanel';

export default function AgentControlCenterPage() {
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [pipelineData, setPipelineData] = useState(null);
  const [selectedAgentTab, setSelectedAgentTab] = useState('all');

  const [testPayload, setTestPayload] = useState({
    description: "Deep dangerous pothole near GT Road junction causing severe traffic slowdown and hydro hazard.",
    location: "GT Road Near Suddapalli Junction, Guntur",
    lat: 16.2220,
    lng: 80.4440,
    citizenName: "Rahul Sharma",
    citizenPhone: "9876543210",
    citizenEmail: "rahul.sharma@gov.in",
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500&auto=format&fit=crop&q=60"
  });

  const runFullPipeline = async () => {
    setIsOrchestrating(true);
    setPipelineData(null);
    try {
      const res = await fetch('/api/agents/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload)
      });
      const data = await res.json();
      if (data.success) {
        setPipelineData(data);
      } else {
        alert(data.error || 'Orchestrator pipeline error');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to Multi-Agent Orchestrator');
    } finally {
      setIsOrchestrating(false);
    }
  };

  const agentsList = [
    { id: 'orchestrator', name: 'Orchestrator Agent', role: 'Central Coordinator & DAG Execution Engine', icon: Layers, color: 'text-purple-400' },
    { id: 'analysis', name: 'Complaint Analysis Agent', role: 'NLP Keyword & Issue Intent Classifier', icon: Bot, color: 'text-cyan-400' },
    { id: 'vision', name: 'Image / Road Detection Agent', role: 'Neural Computer Vision Damage Classifier', icon: Eye, color: 'text-blue-400' },
    { id: 'location', name: 'Location Intelligence Agent', role: 'Spatial GIS Reverse Geocoder & Zone Mapper', icon: MapPin, color: 'text-emerald-400' },
    { id: 'priority', name: 'Priority & Risk Assessment Agent', role: 'Multi-Factor Urgent Risk Scoring Engine', icon: AlertTriangle, color: 'text-amber-400' },
    { id: 'verification', name: 'Citizen Verification Agent', role: 'JWT Profile Identity & Consent Inspector', icon: UserCheck, color: 'text-indigo-400' },
    { id: 'routing', name: 'Authority Routing Agent', role: 'Jurisdiction & Municipal Crew Router', icon: Shield, color: 'text-rose-400' },
    { id: 'notification', name: 'Notification Agent', role: 'Multi-Channel Alert Gateway Dispatcher', icon: Send, color: 'text-teal-400' }
  ];

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 p-6 md:p-8 space-y-8 animate-fade-in font-sans">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-cyan-500/20 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold uppercase rounded-full">
              8-Agent Autonomous Architecture
            </span>
            <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-mono font-bold uppercase rounded-full">
              Teacher Demo Mode Active
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mt-2 flex items-center gap-3">
            <Cpu className="w-8 h-8 text-cyan-400" /> AI Agent Control Center
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Visual orchestration dashboard managing the end-to-end lifecycle of road safety complaints through 8 specialized AI agents.
          </p>
        </div>

        {/* Action Button */}
        <button
          disabled={isOrchestrating}
          onClick={runFullPipeline}
          className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:opacity-95 text-slate-950 font-black text-xs rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
        >
          {isOrchestrating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
              <span>Orchestrating 8 AI Agents...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current text-slate-950" />
              <span>Run Teacher Demo Orchestration</span>
            </>
          )}
        </button>
      </div>

      {/* MULTI-AGENT ARCHITECTURE DIAGRAM */}
      <div className="p-6 bg-slate-900/60 border border-cyan-500/30 rounded-3xl backdrop-blur-xl space-y-6 shadow-2xl">
        <div className="flex justify-between items-center border-b border-cyan-500/20 pb-4">
          <div>
            <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-widest block">
              SYSTEM ARCHITECTURE DIAGRAM
            </span>
            <h2 className="text-lg font-black text-white">8-Stage Autonomous Pipeline Topology</h2>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
            <Activity className="w-3.5 h-3.5 animate-pulse" /> Direct Directed Acyclic Graph (DAG)
          </span>
        </div>

        {/* Visual Workflow Connections */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {agentsList.map((ag, idx) => (
            <div 
              key={ag.id}
              className={`p-4 bg-slate-950/80 border rounded-2xl transition-all space-y-2 relative overflow-hidden ${
                pipelineData ? 'border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-cyan-500/20 hover:border-cyan-500/40'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-cyan-400 font-bold">Stage 0{idx + 1}</span>
                <span className={`text-xs ${ag.color}`}><ag.icon className="w-4 h-4" /></span>
              </div>
              <h3 className="text-xs font-black text-white">{ag.name}</h3>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{ag.role}</p>

              <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 pt-1 font-bold uppercase">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Ready for Orchestration
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SAMPLE TEST PAYLOAD EDITOR & REAL-TIME OUTPUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Input Payload Settings */}
        <div className="p-6 bg-slate-900/60 border border-cyan-500/30 rounded-3xl backdrop-blur-xl space-y-4">
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Code className="w-4 h-4 text-cyan-400" /> Test Complaint Input Payload
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Description</label>
              <textarea 
                rows={3} 
                value={testPayload.description}
                onChange={(e) => setTestPayload({ ...testPayload, description: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-cyan-500/20 rounded-xl text-white font-medium text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Location Address</label>
              <input 
                type="text" 
                value={testPayload.location}
                onChange={(e) => setTestPayload({ ...testPayload, location: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-cyan-500/20 rounded-xl text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Latitude</label>
                <input 
                  type="number" 
                  value={testPayload.lat}
                  onChange={(e) => setTestPayload({ ...testPayload, lat: parseFloat(e.target.value) })}
                  className="w-full p-2 bg-slate-950 border border-cyan-500/20 rounded-xl text-white text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Longitude</label>
                <input 
                  type="number" 
                  value={testPayload.lng}
                  onChange={(e) => setTestPayload({ ...testPayload, lng: parseFloat(e.target.value) })}
                  className="w-full p-2 bg-slate-950 border border-cyan-500/20 rounded-xl text-white text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Agent Activity Panel & Execution Summary */}
        <div className="lg:col-span-2 space-y-4">
          <AgentActivityPanel pipelineData={pipelineData} isRunning={isOrchestrating} />

          {pipelineData && (
            <div className="p-6 bg-slate-950 border border-emerald-500/40 rounded-3xl space-y-4 shadow-2xl animate-fade-in">
              <div className="flex justify-between items-center border-b border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-black text-white">Orchestrator Execution Completed Successfully</h3>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                  Total Time: {pipelineData.totalDurationMs}ms
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Detected Issue</span>
                  <p className="font-extrabold text-cyan-300">{pipelineData.summaryResult.issue}</p>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Priority Risk</span>
                  <p className="font-extrabold text-rose-400">{pipelineData.summaryResult.priority} ({pipelineData.summaryResult.priorityScore}/100)</p>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Target SLA</span>
                  <p className="font-extrabold text-emerald-400">{pipelineData.summaryResult.targetSLA}</p>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Routed Authority</span>
                  <p className="font-extrabold text-white truncate">{pipelineData.summaryResult.assignedAuthority}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
