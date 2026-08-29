import React, { useState } from 'react';
import { Bot, Sparkles, X, MessageSquare, ArrowRight, CheckCircle2, AlertTriangle, ChevronRight, Zap } from 'lucide-react';

export default function RoadexAiCopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeQuery, setActiveQuery] = useState(null);

  const sampleQueries = [
    {
      q: "Which employees have critical skill gaps?",
      a: {
        title: "Critical Skill Gap Warning",
        dept: "Emergency Response & Hydro Infrastructure",
        text: "33 employees in Emergency Response & Hydro Repair lack required Level-2 data analytics and GIS mapping readiness.",
        action: "Prioritize Emergency Incident & Data Analytics Pathway for 33 employees with adjacent skill vectors."
      }
    },
    {
      q: "Which department needs the most training?",
      a: {
        title: "Department Skill Audit",
        dept: "Emergency Response (54% Readiness)",
        text: "Emergency Response has the highest gap delta (34% gap in flood response telemetry). Administration is highest (88%).",
        action: "Deploy Emergency Response Level-1 Cohort training immediately."
      }
    },
    {
      q: "Who is ready for senior architect role?",
      a: {
        title: "Role Readiness Identification",
        dept: "Engineering & IT Division",
        text: "Priya Sharma (92% readiness) and Vikram Singh (89% readiness) meet all qualification and skill benchmarks.",
        action: "Issue Senior Competency Certification & Upgrade Track."
      }
    },
    {
      q: "What skills are missing across the organization?",
      a: {
        title: "Organizational Skill Gap Inventory",
        dept: "Cross-Departmental Telemetry",
        text: "Data Analysis (18% gap), Digital Tools (20% gap), and Flood Hazard Simulation (34% gap) are the top 3 deficits.",
        action: "Launch Organization-Wide Data & Digital Competency Bootcamps."
      }
    }
  ];

  return (
    <>
      {/* Floating Glowing AI Orb Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-3 px-5 py-3 rounded-full bg-slate-900 border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] transition-all cursor-pointer backdrop-blur-xl"
        >
          {/* Animated Glowing Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 opacity-30 group-hover:opacity-60 blur-md transition-opacity" />

          <div className="relative w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
          </div>

          <span className="relative text-xs font-black text-white tracking-wider uppercase font-sans">
            Ask ROADEX AI
          </span>
        </button>
      </div>

      {/* Glass Panel Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex justify-between items-center pb-4 border-b border-cyan-500/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/40">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider">ROADEX AI Copilot</h3>
                <p className="text-[10px] text-cyan-300 font-mono">Workforce Intelligence Engine</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Queries */}
          <div className="py-4 space-y-2">
            <span className="text-[9px] font-mono uppercase text-slate-400 font-bold block">
              Suggested Intelligence Queries:
            </span>
            <div className="space-y-1.5">
              {sampleQueries.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveQuery(item)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-800/60 border border-cyan-500/10 hover:border-cyan-500/40 text-[11px] text-slate-300 font-medium hover:text-white transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span className="truncate pr-2">"{item.q}"</span>
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* AI Response Panel */}
          {activeQuery && (
            <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl space-y-2.5 animate-fade-in">
              <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-bold">
                <Zap className="w-3.5 h-3.5 fill-current text-cyan-400" />
                <span>{activeQuery.a.title}</span>
              </div>

              <div className="text-[11px] text-slate-200 font-medium leading-relaxed">
                <span className="text-cyan-400 font-bold block">{activeQuery.a.dept}</span>
                <p className="mt-1 text-slate-300">{activeQuery.a.text}</p>
              </div>

              <div className="p-2.5 bg-slate-900/80 rounded-xl border border-cyan-500/20 text-[10px] font-mono text-cyan-200">
                <span className="font-extrabold text-cyan-400 block uppercase">Recommended Action:</span>
                {activeQuery.a.action}
              </div>

              <button
                type="button"
                onClick={() => alert('Navigating to specific target employee cohort...')}
                className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Employees & Pathways</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
