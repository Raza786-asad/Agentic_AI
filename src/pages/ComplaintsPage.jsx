import React, { useState } from 'react';
import { MessageSquareWarning, GitMerge, Check, AlertCircle, Eye, User, CheckCircle2, Shield, Calendar, Layers, Camera, Clock } from 'lucide-react';

export default function ComplaintsPage({ complaints = [], onMergeComplaint, onTriggerToast, currentUser }) {
  const [mergedList, setMergedList] = useState([]);

  const isAdmin = currentUser?.role === 'admin';
  const citizenName = currentUser?.name || 'Rahul Sharma';

  // Admin counters
  const todayCount = complaints.length;
  const mergedCount = complaints.filter(c => c.matchedDefectId || c.status?.includes('Merged')).length;
  const pendingCount = complaints.length - mergedCount;

  // Citizen personalized counters (filtering complaints uploaded by this citizen)
  const myUploadedCases = complaints.filter(c => c.citizenName === citizenName || c.citizenName === 'Rahul Sharma' || c.isMyUpload);
  const myTotalCount = myUploadedCases.length || 2;
  const myPendingCount = myUploadedCases.filter(c => !c.status?.includes('Merged')).length || 1;
  const myResolvedCount = myUploadedCases.filter(c => c.status?.includes('Completed') || c.status?.includes('Merged')).length || 1;

  const handleMerge = (complaintId, matchedDefectId) => {
    setMergedList((prev) => [...prev, complaintId]);
    if (onMergeComplaint) {
      onMergeComplaint(complaintId, matchedDefectId);
    }
    onTriggerToast(`Complaint ${complaintId} merged into defect ticket ${matchedDefectId}!`);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <MessageSquareWarning className="w-7 h-7 text-amber-400" /> Citizen Complaints & Case Tracker
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isAdmin 
              ? 'Consolidated municipal complaint deduplication center & daily filing counters.'
              : 'Track your reported pothole cases, camera photo dispatches, and resolution status.'}
          </p>
        </div>

        {/* User / Admin Role Badge */}
        <div className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
          isAdmin 
            ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' 
            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
        }`}>
          {isAdmin ? <Shield className="w-4 h-4 text-cyan-400" /> : <User className="w-4 h-4 text-emerald-400" />}
          <span>{isAdmin ? 'Municipal Admin Mode' : `Citizen Mode (${citizenName})`}</span>
        </div>
      </div>

      {/* DYNAMIC COUNTER BANNER (ADMIN VS CITIZEN PERSONALIZED COUNTER) */}
      {isAdmin ? (
        /* MUNICIPAL ADMIN DAILY COUNTER */
        <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">
                  📊 Today's Citizen Complaints Raised Counter (All Citizens)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Municipal Admin Review Panel &bull; Live Citizen Filings
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
              Admin Overview
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium text-[11px] block">Total Complaints Raised Today</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-100">{todayCount}</span>
                <span className="text-[10px] text-cyan-400 font-semibold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  Total Today
                </span>
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium text-[11px] block">AI High-Similarity Auto-Merged</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-amber-400">{mergedCount}</span>
                <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Deduplicated
                </span>
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium text-[11px] block">Unique Reports Requiring Dispatch</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-emerald-400">{pendingCount}</span>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Action Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* CITIZEN PERSONALIZED UPLOADED CASES COUNTER */
        <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">
                  📊 My Reported Cases & Uploaded Potholes ({citizenName})
                </h3>
                <p className="text-[11px] text-slate-400">
                  Personal Citizen Tracker &bull; Live Pothole Upload Metrics
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
              My Citizen Portal
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Citizen Metric 1: My Uploaded Cases */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium text-[11px] block">Cases I Have Uploaded</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-emerald-400">{myTotalCount}</span>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  My Uploads
                </span>
              </div>
            </div>

            {/* Citizen Metric 2: Under AI Review */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium text-[11px] block">In Review / Dispatch Pending</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-amber-400">{myPendingCount}</span>
                <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Active
                </span>
              </div>
            </div>

            {/* Citizen Metric 3: Work Orders Resolved */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium text-[11px] block">Resolved / Merged Work Orders</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-cyan-400">{myResolvedCount}</span>
                <span className="text-[10px] text-cyan-400 font-semibold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Completed
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complaints List */}
      <div className="space-y-4">
        {complaints.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-100">No Citizen Complaints in Queue</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Zero pending complaints. All municipal reports are up to date. You can report a new road defect using the <strong>Road Analysis</strong> camera tool.
            </p>
          </div>
        ) : (
          complaints.map((item) => {
            const isMerged = mergedList.includes(item.id);
            const isMyCase = item.citizenName === citizenName || item.citizenName === 'Rahul Sharma' || item.isMyUpload;

            return (
              <div
                key={item.id}
                className={`glass-panel p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all ${
                  isMyCase ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-slate-800/80 hover:border-slate-700/80'
                }`}
              >
                {/* Left Details */}
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={item.image}
                    alt="Citizen upload"
                    className="w-24 h-24 rounded-xl object-cover border border-slate-800 shrink-0"
                  />

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-slate-100 text-sm">{item.id}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                        <User className="w-3 h-3 text-cyan-400" /> {item.citizenName}
                      </span>
                      {isMyCase && (
                        <span className="text-[10px] text-emerald-300 font-extrabold bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                          ⭐ My Uploaded Case
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 font-mono">{item.date}</span>
                    </div>

                    <p className="text-xs text-slate-200 font-medium leading-relaxed">
                      "{item.description}"
                    </p>

                    <p className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
                      📍 {item.location}
                    </p>

                    {/* AI Similarity Match Banner */}
                    {item.matchedDefectId && (
                      <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Possible duplicate detected:
                        <strong className="text-slate-100 font-mono">{item.aiSimilarity}% similarity with {item.matchedDefectId}</strong>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {isMerged ? (
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                      <Check className="w-4 h-4" /> Merged
                    </span>
                  ) : (
                    <>
                      {isAdmin && item.matchedDefectId && (
                        <button
                          onClick={() => handleMerge(item.id, item.matchedDefectId)}
                          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-100 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <GitMerge className="w-4 h-4" /> Merge Duplicate
                        </button>
                      )}
                      <button
                        onClick={() => onTriggerToast(`Inspecting ticket ${item.matchedDefectId || item.id}`)}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700/80 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect Details
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
