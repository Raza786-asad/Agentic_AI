import React, { useState, useEffect } from 'react';
import { 
  Bot, Sparkles, Zap, CheckCircle2, Play, RefreshCw, X, Shield, 
  Cpu, Activity, Layers, ArrowRight, Copy, Check, Eye
} from 'lucide-react';

export default function AgentOrchestratorModal({ isOpen, onClose }) {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('vision');
  const [prompt, setPrompt] = useState('Pothole report at Suddapalli, Guntur with 12.5cm depth and active waterlogging');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isPipeline, setIsPipeline] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [pipelineResult, setPipelineResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Load agents from backend API
  useEffect(() => {
    if (isOpen) {
      fetch('/api/agents')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.agents) {
            setAgents(data.agents);
          }
        })
        .catch(err => console.error('[Agents Load Error]', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRunSingleAgent = async () => {
    if (!prompt.trim()) return;
    setIsExecuting(true);
    setIsPipeline(false);
    setExecutionResult(null);
    setPipelineResult(null);

    try {
      const res = await fetch('/api/run-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: selectedAgent, prompt: prompt.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setExecutionResult(data);
      } else {
        alert(data.error || 'Agent execution failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to AI Agent service.');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleRunMultiAgentPipeline = async () => {
    if (!prompt.trim()) return;
    setIsExecuting(true);
    setIsPipeline(true);
    setExecutionResult(null);
    setPipelineResult(null);

    try {
      const res = await fetch('/api/run-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setPipelineResult(data);
      } else {
        alert(data.error || 'Pipeline execution failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Error running multi-agent pipeline.');
    } finally {
      setIsExecuting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presets = [
    { label: "📷 Neural Vision Triage", prompt: "Pothole report at Suddapalli, Guntur with 12.5cm depth and active waterlogging", agent: "vision" },
    { label: "🧩 Spatial Deduplication", prompt: "Check duplicate complaints within 50m radius of Lat: 16.2220, Lng: 80.4440", agent: "dedup" },
    { label: "⚡ Priority Dispatch SLA", prompt: "Calculate priority score & assign registered municipal staff for high severity road damage", agent: "dispatch" },
    { label: "✅ Repair Quality Audit", prompt: "Verify post-repair photo proof and GPS distance delta < 100m for ticket WO-4921", agent: "audit" }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white dark:bg-slate-900 border border-custom-sage/30 rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-custom-sage/20 bg-custom-cream/40 dark:bg-slate-800/40 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-custom-terra/10 border border-custom-terra/30 text-custom-terra flex items-center justify-center font-bold">
              <Bot className="w-6 h-6 text-custom-terra" />
            </div>
            <div>
              <h2 className="text-lg font-black text-custom-taupe dark:text-white flex items-center gap-2">
                ROADNEX Multi-Agent AI Studio <Sparkles className="w-4 h-4 text-amber-400" />
              </h2>
              <p className="text-xs text-custom-sage font-medium">
                Orchestrate specialized AI Agents with step-by-step thought reasoning streams and live API payloads.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-700/10 text-custom-taupe transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Agent Selector Grid */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase text-custom-sage tracking-wider block">
              1. Select AI Agent Capability ({agents.length} Agents Available)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {agents.map((ag) => {
                const isSelected = selectedAgent === ag.id;
                return (
                  <button
                    key={ag.id}
                    type="button"
                    onClick={() => setSelectedAgent(ag.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-custom-terra bg-custom-terra/10 text-custom-taupe dark:text-white shadow-sm' 
                        : 'border-custom-sage/20 bg-white/40 dark:bg-slate-800/40 hover:border-custom-sage/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg">{ag.icon}</span>
                      <span className="text-[9px] font-black uppercase bg-custom-taupe/10 text-custom-taupe dark:text-custom-sage px-2 py-0.5 rounded-full">
                        {ag.badge}
                      </span>
                    </div>
                    <h4 className="text-xs font-extrabold truncate">{ag.name}</h4>
                    <p className="text-[10px] text-custom-sage font-medium truncate mt-0.5">{ag.role}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prompt Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-black uppercase text-custom-sage tracking-wider block">
                2. Enter Prompt or Select Demo Preset
              </label>
              <div className="flex gap-2">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedAgent(p.agent);
                      setPrompt(p.prompt);
                    }}
                    className="text-[10px] px-2.5 py-1 bg-custom-cream dark:bg-slate-800 border border-custom-sage/30 rounded-lg text-custom-taupe dark:text-slate-300 font-bold hover:border-custom-terra transition-all cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe defect, report ID, or query for the AI Agent..."
              className="w-full p-3 bg-white/60 dark:bg-slate-800/60 border border-custom-sage/30 rounded-2xl text-xs font-medium text-custom-taupe dark:text-white focus:outline-none focus:border-custom-terra transition-all"
            />
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              disabled={isExecuting || !prompt.trim()}
              onClick={handleRunSingleAgent}
              className="flex-1 py-3 bg-custom-taupe text-white rounded-xl text-xs font-black shadow-md hover:bg-custom-taupe/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isExecuting && !isPipeline ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Executing {selectedAgent.toUpperCase()} Agent...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  Run Single Agent ({selectedAgent})
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isExecuting || !prompt.trim()}
              onClick={handleRunMultiAgentPipeline}
              className="flex-1 py-3 bg-custom-terra text-white rounded-xl text-xs font-black shadow-md hover:bg-custom-terra/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isExecuting && isPipeline ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Orchestrating 4-Agent Pipeline...
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  Run 4-Stage Multi-Agent Orchestrator
                </>
              )}
            </button>
          </div>

          {/* RESULTS DISPLAY */}
          {executionResult && (
            <div className="space-y-4 border-t border-custom-sage/20 pt-4 animate-fade-in">
              <div className="flex items-center justify-between bg-custom-cream/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-custom-sage/20">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{executionResult.agent.icon}</span>
                  <div>
                    <h3 className="text-xs font-black uppercase text-custom-taupe dark:text-white">
                      {executionResult.agent.name} Result
                    </h3>
                    <p className="text-[10px] text-custom-sage font-mono mt-0.5">
                      Execution Time: {executionResult.durationMs}ms &bull; Status: 200 OK
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(executionResult.output)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-700 border border-custom-sage/30 rounded-lg text-xs font-bold text-custom-taupe dark:text-white hover:border-custom-terra transition-all flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Markdown'}
                </button>
              </div>

              {/* Step-by-Step Reasoning Logs */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase text-custom-sage tracking-wider">
                  🧠 Step-by-Step Agent Thought Stream
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {executionResult.steps.map((st, idx) => (
                    <div key={idx} className="p-3 bg-white/40 dark:bg-slate-800/40 rounded-xl border border-custom-sage/20 text-xs">
                      <div className="flex items-center gap-2 text-emerald-500 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="text-custom-taupe dark:text-white font-extrabold">{st.title}</span>
                      </div>
                      <p className="text-[10px] text-custom-sage font-mono mt-1">{st.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Markdown Output */}
              <div className="p-4 bg-slate-950 text-slate-200 font-mono text-xs rounded-2xl overflow-x-auto whitespace-pre-wrap border border-slate-800 leading-relaxed max-h-72">
                {executionResult.output}
              </div>
            </div>
          )}

          {/* MULTI-AGENT PIPELINE RESULTS */}
          {pipelineResult && (
            <div className="space-y-4 border-t border-custom-sage/20 pt-4 animate-fade-in">
              <div className="bg-gradient-to-r from-custom-taupe to-slate-900 text-white p-4 rounded-2xl shadow-lg flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" /> {pipelineResult.pipelineName}
                  </h3>
                  <p className="text-[10px] text-slate-300 font-mono mt-0.5">
                    Executed {pipelineResult.totalAgents} Autonomous Agents Sequentially
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                  Pipeline Passed
                </span>
              </div>

              <div className="space-y-4">
                {pipelineResult.stages.map((stg, sIdx) => (
                  <div key={sIdx} className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-2xl border border-custom-sage/20 space-y-3">
                    <div className="flex items-center justify-between border-b border-custom-sage/15 pb-2">
                      <div className="flex items-center gap-2 font-black text-xs text-custom-taupe dark:text-white">
                        <span>{stg.agent.icon}</span>
                        <span>Stage {sIdx + 1}: {stg.agent.name} ({stg.agent.badge})</span>
                      </div>
                      <span className="text-[10px] font-mono text-custom-sage font-bold">{stg.durationMs}ms</span>
                    </div>

                    <div className="p-3 bg-slate-950 text-slate-200 font-mono text-[11px] rounded-xl overflow-x-auto whitespace-pre-wrap">
                      {stg.output}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
