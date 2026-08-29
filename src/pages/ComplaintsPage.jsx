import React, { useState, useEffect } from 'react';
import { 
  MessageSquareWarning, GitMerge, Check, AlertCircle, Eye, User, 
  CheckCircle2, Shield, Calendar, Camera, Clock, Trash2, 
  Phone, PhoneCall, PhoneOff, Send, MessageSquare, Landmark, 
  MapPin, Loader2, Sparkles, X, ChevronRight, MessageCircle
} from 'lucide-react';

export default function ComplaintsPage({ 
  complaints = [], 
  onMergeComplaint, 
  onDeleteComplaint, 
  onUpdateComplaint, 
  onCreateWorkOrder, 
  onTriggerToast, 
  currentUser 
}) {
  const [mergedList, setMergedList] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Calling Simulation States
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState('Disconnected'); // 'Disconnected', 'Connecting', 'Ringing', 'Connected'
  const [callTimer, setCallTimer] = useState(0);
  const [callSubtitles, setCallSubtitles] = useState('');
  const [callLogs, setCallLogs] = useState([]);

  // Call Verification State
  const [callVerified, setCallVerified] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);

  // Municipal Staff States
  const [municipalStaffList, setMunicipalStaffList] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [loadingStaff, setLoadingStaff] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      setLoadingStaff(true);
      try {
        const token = localStorage.getItem('roadnex_token');
        const res = await fetch('/api/auth/municipal-staff', {
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        });
        const data = await res.json();
        if (data.success && data.staff) {
          setMunicipalStaffList(data.staff);
          if (data.staff.length > 0) {
            setSelectedStaffId(data.staff[0].id);
          }
        }
      } catch (err) {
        console.error('[Municipal Staff Load Error]', err);
      } finally {
        setLoadingStaff(false);
      }
    };
    fetchStaff();
  }, []);

  const activeStaff = municipalStaffList.find(s => s.id === selectedStaffId) || municipalStaffList[0];
  const assignedStaffName = activeStaff ? activeStaff.name : 'Municipal Staff';

  const isAdmin = currentUser?.role === 'admin';
  const citizenName = currentUser?.name || 'Rahul Sharma';

  // Admin counters
  const todayCount = complaints.length;
  const mergedCount = complaints.filter(c => c.matchedDefectId || c.status?.includes('Merged')).length;
  const pendingCount = complaints.length - mergedCount;

  // Citizen counters
  const myUploadedCases = complaints.filter(c => c.citizenName === citizenName || c.citizenName === 'Rahul Sharma' || c.isMyUpload);
  const myTotalCount = myUploadedCases.length;
  const myPendingCount = myUploadedCases.filter(c => !c.status?.includes('Merged')).length;
  const myResolvedCount = myUploadedCases.filter(c => c.status?.includes('Completed') || c.status?.includes('Merged')).length;

  const displayedComplaints = isAdmin ? complaints : myUploadedCases;

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.05; // Slightly clear tone
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('SpeechSynthesis error:', err);
      }
    }
  };

  // Calling Dialogues Effect
  useEffect(() => {
    let durationInterval;
    let dialogueTimeouts = [];

    if (callStatus === 'Connected') {
      durationInterval = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);

      const firstName = (selectedComplaint?.citizenName || 'Rahul').split(' ')[0];
      const defect = selectedComplaint?.defectType?.toLowerCase() || 'pothole';
      const locArea = (selectedComplaint?.location || 'Suddapalli').split(',')[0];

      const script = [
        { time: 0, speaker: 'Admin', text: `Hello, is this ${selectedComplaint?.citizenName || 'Rahul Sharma'}? I am calling from RoadGuard Municipal Admin regarding the ${defect} report.` },
        { time: 5, speaker: selectedComplaint?.citizenName || 'Rahul Sharma', text: `Yes, I am ${firstName}. I reported a very dangerous ${defect} near ${locArea}. It's causing massive traffic.` },
        { time: 11, speaker: 'Admin', text: 'Thank you for confirming. We have verified your GPS location and coordinates. We will dispatch the repair queue shortly.' },
        { time: 16, speaker: selectedComplaint?.citizenName || 'Rahul Sharma', text: 'Thank you so much! Please get it repaired quickly.' },
        { time: 20, speaker: 'System', text: 'Verification call complete. Line secure.' }
      ];

      script.forEach((line) => {
        const t = setTimeout(() => {
          setCallSubtitles(`${line.speaker}: "${line.text}"`);
          if (line.speaker !== 'Admin' && line.speaker !== 'System') {
            speakText(line.text);
          }
          if (line.speaker === 'System') {
            setTimeout(() => {
              hangUpCall();
              setCallLogs((prev) => [...prev, `Simulated Call: Verified citizen identity and coordinates.`]);
            }, 2555);
          }
        }, line.time * 1000);
        dialogueTimeouts.push(t);
      });
    }

    return () => {
      clearInterval(durationInterval);
      dialogueTimeouts.forEach(clearTimeout);
    };
  }, [callStatus]);

  const handleMerge = (complaintId, matchedDefectId) => {
    setMergedList((prev) => [...prev, complaintId]);
    if (onMergeComplaint) {
      onMergeComplaint(complaintId, matchedDefectId);
    }
    onTriggerToast(`Complaint ${complaintId} merged into defect ticket ${matchedDefectId}!`);
  };

  // Dialing Handler for Citizen or Staff
  const startSimulatedCallTarget = (targetPhone, targetName, targetRole = 'Citizen') => {
    let phone = targetPhone;
    if (phone !== null && phone !== undefined) {
      phone = String(phone);
    }

    if (!phone || phone.trim() === '') {
      if (onTriggerToast) onTriggerToast(`No phone number available for ${targetName}.`, 'warning');
      setCallVerified(true);
      return;
    }

    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }

    setIsCalling(true);
    setCallStatus('Connected');
    setCallTimer(0);
    setCallSubtitles(`Calling ${targetRole} (${targetName} +${cleanPhone})...`);

    window.location.href = `tel:${cleanPhone}`;
    setCallLogs((prev) => [...prev, `Outgoing call to ${targetName} (+${cleanPhone}).`]);
    setCallVerified(true);
  };

  const startSimulatedCall = () => {
    startSimulatedCallTarget(selectedComplaint?.citizenPhone, selectedComplaint?.citizenName || 'Citizen', 'Citizen');
  };

  const hangUpCall = () => {
    setIsCalling(false);
    setCallStatus('Disconnected');
    setCallTimer(0);
    setCallSubtitles('');
    setCallVerified(true);
  };

  // Accepting & Dispatching Handler
  const handleAcceptAndDispatch = async () => {
    setIsDispatching(true);
    try {
      if (onCreateWorkOrder) {
        // Create Work Order
        const wo = await onCreateWorkOrder({
          reportId: selectedComplaint.reportId,
          defectId: selectedComplaint.matchedDefectId || selectedComplaint.id,
          defectType: selectedComplaint.defectType,
          location: selectedComplaint.location,
          lat: selectedComplaint.lat,
          lng: selectedComplaint.lng,
          severity: selectedComplaint.severity,
          priority: 'High',
          priorityScore: selectedComplaint.priorityScore || 85,
          contractor: assignedStaffName,
          estimatedCost: '₹0'
        });

        if (wo) {
          // Update Complaint Status to Approved / Dispatched
          const token = localStorage.getItem('roadnex_token');
          const res = await fetch(`/api/complaints/${selectedComplaint.id}/status`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status: `Dispatched to ${assignedStaffName}` })
          });
          const data = await res.json();
          if (data.success) {
            if (onUpdateComplaint) onUpdateComplaint(data.complaint);
            if (onTriggerToast) onTriggerToast(`Complaint ${selectedComplaint.id} dispatched to ${assignedStaffName}!`);
            setSelectedComplaint(null);
          }
        }
      }
    } catch (err) {
      console.error(err);
      alert('Error dispatching repair ticket.');
    } finally {
      setIsDispatching(false);
    }
  };

  const getRiskColor = (severity) => {
    if (severity?.toLowerCase() === 'high') return 'rose';
    if (severity?.toLowerCase() === 'medium') return 'amber';
    return 'emerald';
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-custom-taupe tracking-tight flex items-center gap-2">
            <MessageSquareWarning className="w-7 h-7 text-amber-400" /> Citizen Complaints & Case Tracker
          </h1>
          <p className="text-xs text-custom-sage font-medium mt-1">
            {isAdmin 
              ? 'Consolidated municipal complaint deduplication center & daily filing counters.'
              : 'Track your reported pothole cases, camera photo dispatches, and resolution status.'}
          </p>
        </div>

        {/* Role Badge */}
        <div className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
          isAdmin 
            ? 'bg-custom-terra/10 text-custom-terra border-cyan-500/30' 
            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
        }`}>
          {isAdmin ? <Shield className="w-4 h-4 text-custom-terra" /> : <User className="w-4 h-4 text-emerald-400" />}
          <span>{isAdmin ? 'Municipal Admin Mode' : `Citizen Mode (${citizenName})`}</span>
        </div>
      </div>

      {/* Stats Summary Banner */}
      {isAdmin ? (
        <div className="bg-white shadow-sm border p-6 rounded-2xl border-amber-500/30 bg-amber-500/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-custom-taupe uppercase tracking-wider">
                  📊 TODAY'S CITIZEN COMPLAINTS RAISED COUNTER (ALL CITIZENS)
                </h3>
                <p className="text-[11px] text-custom-sage font-medium">
                  Municipal Admin Review Panel &amp; Live Citizen Filings
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
              Admin Overview
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-custom-cream p-4 rounded-xl border border-custom-sage/30 space-y-1">
              <span className="text-custom-sage font-medium text-[11px] block">Total Complaints Raised Today</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-custom-taupe">{todayCount}</span>
                <span className="text-[10px] text-custom-terra font-semibold bg-custom-terra/10 px-2 py-0.5 rounded border border-custom-terra/20">
                  Total Today
                </span>
              </div>
            </div>

            <div className="bg-custom-cream p-4 rounded-xl border border-custom-sage/30 space-y-1">
              <span className="text-custom-sage font-medium text-[11px] block">AI High-Similarity Auto-Merged</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-amber-400">{mergedCount}</span>
                <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Deduplicated
                </span>
              </div>
            </div>

            <div className="bg-custom-cream p-4 rounded-xl border border-custom-sage/30 space-y-1">
              <span className="text-custom-sage font-medium text-[11px] block">Unique Reports Requiring Dispatch</span>
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
        <div className="bg-white shadow-sm border p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-custom-taupe uppercase tracking-wider">
                  📊 My Reported Cases &amp; Uploaded Potholes ({citizenName})
                </h3>
                <p className="text-[11px] text-custom-sage font-medium">
                  Personal Citizen Tracker &amp; Live Pothole Upload Metrics
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
              My Citizen Portal
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-custom-cream p-4 rounded-xl border border-custom-sage/30 space-y-1">
              <span className="text-custom-sage font-medium text-[11px] block">Cases I Have Uploaded</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-emerald-400">{myTotalCount}</span>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  My Uploads
                </span>
              </div>
            </div>

            <div className="bg-custom-cream p-4 rounded-xl border border-custom-sage/30 space-y-1">
              <span className="text-custom-sage font-medium text-[11px] block">In Review / Dispatch Pending</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-amber-400">{myPendingCount}</span>
                <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Active
                </span>
              </div>
            </div>

            <div className="bg-custom-cream p-4 rounded-xl border border-custom-sage/30 space-y-1">
              <span className="text-custom-sage font-medium text-[11px] block">Resolved / Merged Work Orders</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-custom-terra">{myResolvedCount}</span>
                <span className="text-[10px] text-custom-terra font-semibold bg-custom-terra/10 px-2 py-0.5 rounded border border-custom-terra/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Completed
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complaints List */}
      <div className="space-y-4">
        {displayedComplaints.length === 0 ? (
          <div className="bg-white shadow-sm border p-12 rounded-2xl text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-custom-taupe">No Citizen Complaints in Queue</h3>
            <p className="text-xs text-custom-sage font-medium max-w-md mx-auto">
              Zero pending complaints. All municipal reports are up to date. You can report a new road defect using the <strong>Road Analysis</strong> camera tool.
            </p>
          </div>
        ) : (
          displayedComplaints.map((item) => {
            const isMerged = mergedList.includes(item.id) || item.isMerged || item.status === 'Dispatched';
            const isMyCase = item.citizenName === citizenName || item.citizenName === 'Rahul Sharma' || item.isMyUpload;

            return (
              <div
                key={item.id}
                className={`bg-white shadow-sm border p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all ${
                  isMyCase ? 'border-emerald-500/40 bg-emerald-950/5' : 'border-custom-sage/30 hover:border-custom-sage/60'
                }`}
              >
                {/* Left Details */}
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500&auto=format&fit=crop&q=60'}
                    alt="Citizen upload"
                    className="w-24 h-24 rounded-xl object-cover border border-custom-sage/30 shrink-0"
                  />

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-custom-taupe text-sm">{item.id}</span>
                      <span className="text-[10px] text-custom-sage font-medium bg-custom-cream px-2 py-0.5 rounded border border-custom-sage/30 flex items-center gap-1">
                        <User className="w-3 h-3 text-custom-terra" /> {item.citizenName}
                      </span>
                      {isMyCase && (
                        <span className="text-[10px] text-emerald-300 font-extrabold bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                          ⭐ My Uploaded Case
                        </span>
                      )}
                      <span className="text-[10px] text-custom-sage font-mono">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                      {item.whatsappVerified && (
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> WhatsApp Verified
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-custom-taupe font-medium leading-relaxed">
                      "{item.description}"
                    </p>

                    <p className="text-xs font-semibold text-custom-terra flex items-center gap-1">
                      📍 {item.location}
                    </p>

                    {/* AI Similarity Match Banner */}
                    {item.matchedDefectId && !isMerged && (
                      <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Possible duplicate detected:
                        <strong className="text-custom-taupe font-mono">{item.aiSimilarity}% similarity with {item.matchedDefectId}</strong>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {isMerged ? (
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                      <Check className="w-4 h-4" /> {item.status === 'Dispatched' ? 'Dispatched' : 'Merged'}
                    </span>
                  ) : (
                    <>
                      {isAdmin && item.matchedDefectId && (
                        <button
                          onClick={() => handleMerge(item.id, item.matchedDefectId)}
                          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-custom-taupe rounded-xl text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer font-sans"
                        >
                          <GitMerge className="w-4 h-4" /> Merge Duplicate
                        </button>
                      )}
                      {!isAdmin && isMyCase && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete complaint ${item.id}?`)) {
                              if (onDeleteComplaint) onDeleteComplaint(item.id);
                            }
                          }}
                          className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-xs font-bold border border-rose-500/30 transition-colors flex items-center gap-1 cursor-pointer font-sans"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete Case
                        </button>
                      )}
                      {isAdmin && (
                        <button
                          onClick={() => setSelectedComplaint(item)}
                          className="px-3 py-2 bg-custom-sage/10 hover:bg-slate-700 text-custom-taupe rounded-xl text-xs font-semibold border border-custom-sage/40 transition-colors flex items-center gap-1 cursor-pointer font-sans"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect Details
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* DETAILED INSPECTION MODAL (WITH SIMULATED VOICE CALLING & WHATSAPP MOCK) */}
      {/* ========================================================================= */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity" 
            onClick={() => {
              if (!isCalling) setSelectedComplaint(null);
            }}
          />

          {/* Modal Container */}
          <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-custom-sage/30 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-custom-sage/20 animate-in fade-in zoom-in-95 duration-200">
            {/* CLOSE BUTTON */}
            <button 
              onClick={() => setSelectedComplaint(null)}
              disabled={isCalling}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-700/10 text-custom-taupe transition-colors z-30 cursor-pointer disabled:opacity-30"
            >
              <X className="w-5 h-5" />
            </button>

            {/* LEFT SECTION: COMPLAINT DETAILS & AI RISK ASSESSMENT */}
            <div className="p-6 md:p-8 flex-1 space-y-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-custom-terra/10 text-custom-terra px-2.5 py-1 rounded-md border border-custom-terra/20 font-mono">
                  Complaint Case File
                </span>
                <h2 className="text-xl font-extrabold text-custom-taupe tracking-tight mt-2 flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-custom-terra" /> Inspect File: {selectedComplaint.id}
                </h2>
              </div>

              {/* Defect vs Repaired Image View */}
              {selectedComplaint.repairedImageUrl || selectedComplaint.status === 'Completed' ? (
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-600 tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Live Resolution Proof (Before &amp; After)
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Before Image */}
                    <div className="relative rounded-2xl overflow-hidden border border-custom-sage/30 h-36 bg-slate-950">
                      <img 
                        src={selectedComplaint.image || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500&auto=format&fit=crop&q=60'} 
                        alt="Original Defect" 
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-rose-600/90 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase">
                        Before (Reported)
                      </span>
                    </div>

                    {/* After Image */}
                    <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/40 h-36 bg-slate-950">
                      <img 
                        src={selectedComplaint.repairedImageUrl || 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=500&auto=format&fit=crop&q=60'} 
                        alt="Repaired Pothole Proof" 
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-emerald-600/90 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase">
                        After (Repaired Live)
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Pothole Image */
                <div className="relative rounded-2xl overflow-hidden border border-custom-sage/30 h-48 bg-slate-950">
                  <img 
                    src={selectedComplaint.image || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500&auto=format&fit=crop&q=60'} 
                    alt="Defect visual" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                    <div className="flex items-center gap-2 text-white text-[11px] font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-custom-terra shrink-0" />
                      <span>
                        Lat: {selectedComplaint.lat ? Number(selectedComplaint.lat).toFixed(5) : '16.22200'}, 
                        Lng: {selectedComplaint.lng ? Number(selectedComplaint.lng).toFixed(5) : '80.44400'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Description & Location details */}
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl bg-custom-cream border border-custom-sage/20 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-custom-sage">Citizen Description</span>
                  <p className="text-custom-taupe font-medium italic">"{selectedComplaint.description}"</p>
                </div>

                <div className="p-4 rounded-xl bg-custom-cream border border-custom-sage/20 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-custom-sage">Reported Location Address</span>
                  <p className="text-custom-taupe font-bold flex items-center gap-1">
                    📍 {selectedComplaint.location}
                  </p>
                </div>
              </div>

              {/* AI RISK ASSESSMENT CARD */}
              <div className="p-5 rounded-2xl bg-slate-800/10 border border-custom-sage/20 space-y-3">
                <h4 className="text-xs font-black uppercase text-custom-taupe tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-custom-terra" /> AI Risk Assessment Analysis
                </h4>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/40 p-3 rounded-lg border border-custom-sage/10">
                    <span className="text-[10px] text-custom-sage font-medium block">Report Severity</span>
                    <span className={`font-black uppercase text-${getRiskColor(selectedComplaint.severity)}-400 mt-0.5 inline-block`}>
                      {selectedComplaint.severity || 'Medium'}
                    </span>
                  </div>
                  <div className="bg-white/40 p-3 rounded-lg border border-custom-sage/10">
                    <span className="text-[10px] text-custom-sage font-medium block">Defect Category</span>
                    <span className="font-extrabold text-custom-taupe mt-0.5 inline-block">
                      {selectedComplaint.defectType || 'Pothole'}
                    </span>
                  </div>
                  <div className="bg-white/40 p-3 rounded-lg border border-custom-sage/10">
                    <span className="text-[10px] text-custom-sage font-medium block">AI Prediction Confidence</span>
                    <span className="font-extrabold text-custom-taupe mt-0.5 inline-block">
                      {selectedComplaint.confidence}%
                    </span>
                  </div>
                  <div className="bg-white/40 p-3 rounded-lg border border-custom-sage/10">
                    <span className="text-[10px] text-custom-sage font-medium block">Risk / Priority Score</span>
                    <span className="font-extrabold text-custom-taupe mt-0.5 inline-block">
                      {selectedComplaint.priorityScore}/100
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SECTION: CITIZEN PROFILE, PHONE DIALER & WHATSAPP FLOW */}
            <div className="p-6 md:p-8 w-full md:w-[380px] bg-custom-cream/30 flex flex-col justify-between gap-6">
              
              {/* CITIZEN PROFILE CARD */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-custom-sage tracking-wider border-b border-custom-sage/20 pb-2">
                  Citizen Contact profile
                </h3>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-custom-terra/10 border border-custom-terra/20 text-custom-terra flex items-center justify-center font-bold text-sm">
                    {(selectedComplaint?.citizenName || 'Citizen').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'C'}
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-custom-taupe">{selectedComplaint?.citizenName || 'Citizen User'}</h4>
                    <p className="text-[10px] text-custom-sage font-mono">{selectedComplaint?.citizenEmail || 'citizen@roadguard.org'}</p>
                  </div>
                </div>

                {/* Citizen Meta Info */}
                <div className="space-y-2 text-[11px] font-medium text-custom-taupe bg-white/40 p-3 rounded-xl border border-custom-sage/15">
                  <p className="flex justify-between items-center">
                    <span className="text-custom-sage">Phone:</span> 
                    <span className="font-bold font-mono">{selectedComplaint?.citizenPhone || 'Not specified'}</span>
                  </p>
                  <p className="flex justify-between items-center">
                    <span className="text-custom-sage">Registered Address:</span> 
                    <span className="font-bold text-right truncate max-w-[180px]">{selectedComplaint?.citizenAddress || 'Not specified'}</span>
                  </p>
                </div>
              </div>

              {/* ACTION: ACTIVE DIALER OR DUAL CALL GATEWAY */}
              {isCalling ? (
                /* SIMULATED ACTIVE DIALER MODAL VIEW */
                <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-700/50 shadow-inner flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden h-40">
                  <div className="absolute inset-0 bg-radial-gradient from-emerald-500/10 to-transparent pointer-events-none" />
                  <div className="space-y-1">
                    <p className="text-xs font-mono tracking-wider font-extrabold text-emerald-400 animate-pulse">
                      {callStatus.toUpperCase()}...
                    </p>
                    {callStatus === 'Connected' && (
                      <p className="text-[10px] font-mono text-slate-400">
                        Duration: {Math.floor(callTimer / 60)}:{(callTimer % 60).toString().padStart(2, '0')}
                      </p>
                    )}
                  </div>
                  <div className="h-12 flex items-center justify-center px-4">
                    <p className="text-[11px] font-sans font-medium text-slate-200 italic leading-snug">
                      {callSubtitles || 'Listening...'}
                    </p>
                  </div>
                  <button 
                    onClick={hangUpCall}
                    className="p-3 bg-rose-600 hover:bg-rose-500 text-white rounded-full transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-rose-600/30"
                  >
                    <PhoneOff className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Call Citizen Option */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-custom-sage tracking-wider block">
                      📞 Call Citizen
                    </span>
                    <button 
                      onClick={startSimulatedCall}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5" /> Call Citizen ({(selectedComplaint?.citizenName || 'Citizen').split(' ')[0]})
                    </button>
                  </div>

                  {/* Registered Municipal Staff Selector & Call */}
                  <div className="space-y-2 border-t border-custom-sage/20 pt-3">
                    <h4 className="text-[10px] font-black uppercase text-custom-sage tracking-widest flex items-center gap-1">
                      👷 REGISTERED MUNICIPAL STAFF
                    </h4>

                    {loadingStaff ? (
                      <p className="text-[10px] text-custom-sage font-medium italic">Loading registered staff...</p>
                    ) : (
                      <div className="space-y-2">
                        <select
                          value={selectedStaffId}
                          onChange={(e) => setSelectedStaffId(e.target.value)}
                          className="w-full p-2.5 bg-white border border-custom-sage/30 rounded-xl text-xs font-bold text-custom-taupe focus:outline-none focus:border-custom-terra transition-colors cursor-pointer"
                        >
                          {municipalStaffList.map((staff) => (
                            <option key={staff.id} value={staff.id}>
                              {staff.name} {staff.department ? `(${staff.department})` : ''}
                            </option>
                          ))}
                        </select>

                        {activeStaff && (
                          <div className="p-3 bg-white/60 rounded-xl border border-custom-sage/20 space-y-2 text-xs">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-extrabold text-custom-taupe block">{activeStaff.name}</span>
                                <span className="text-[10px] text-custom-sage font-medium block">{activeStaff.department || activeStaff.email}</span>
                              </div>
                              <span className="text-[9px] font-bold uppercase bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                                Registered
                              </span>
                            </div>

                            {/* Call Staff Button */}
                            <button
                              onClick={() => startSimulatedCallTarget(activeStaff.phone, activeStaff.name, 'Municipal Staff')}
                              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-extrabold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                            >
                              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" /> Call Staff: {activeStaff.phone || 'System Line'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* MUNICIPAL PROCEED ACTION FOOTER */}
              <div className="border-t border-custom-sage/20 pt-4 mt-2">
                <button
                  disabled={isDispatching}
                  onClick={handleAcceptAndDispatch}
                  className="w-full py-3 bg-custom-taupe text-white text-xs font-black rounded-xl hover:bg-custom-taupe/90 shadow-lg shadow-custom-taupe/20 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-sans"
                >
                  {isDispatching ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      Assigning &amp; Dispatching...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Accept &amp; Assign Work to {assignedStaffName}
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
