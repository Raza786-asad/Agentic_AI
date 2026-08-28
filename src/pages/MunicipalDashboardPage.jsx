import React, { useState, useEffect } from 'react';
import {
  Wrench, MapPin, Camera, CheckCircle2, ShieldAlert,
  Loader2, RefreshCw, AlertTriangle, Check, ArrowRight, ClipboardCheck
} from 'lucide-react';

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // in metres
}

export default function MunicipalDashboardPage({ onTriggerToast }) {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWO, setSelectedWO] = useState(null);

  // Form states
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Geolocation states
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [currentCoords, setCurrentCoords] = useState(null);
  const [distanceDelta, setDistanceDelta] = useState(null);

  // Load assigned work orders
  const loadWorkOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('roadnex_token');
      const res = await fetch('/api/work-orders', {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      });
      const data = await res.json();
      if (data.success) {
        setWorkOrders(data.workOrders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkOrders();
  }, []);

  // Request browser GPS location
  const captureGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setGpsLoading(true);
    setGpsError('');
    setCurrentCoords(null);
    setDistanceDelta(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentCoords({ lat: latitude, lng: longitude });
        setGpsLoading(false);

        if (selectedWO) {
          const distance = getDistance(
            selectedWO.lat,
            selectedWO.lng,
            latitude,
            longitude
          );
          setDistanceDelta(distance);
        }
      },
      (error) => {
        console.error(error);
        setGpsLoading(false);
        setGpsError('GPS permission denied or timeout. Please enable location.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Recalculate distance delta when selected work order changes
  useEffect(() => {
    if (selectedWO && currentCoords) {
      const distance = getDistance(
        selectedWO.lat,
        selectedWO.lng,
        currentCoords.lat,
        currentCoords.lng
      );
      setDistanceDelta(distance);
    } else {
      setDistanceDelta(null);
    }
    // Reset submission form when task changes
    setImageFile(null);
    setImageUrl('');
  }, [selectedWO]);

  // Handle Photo Upload
  const handlePhotoSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setUploadingImage(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('roadnex_token');
      const res = await fetch('/api/upload/image', {
        method: 'POST',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setImageUrl(data.imageUrl);
        onTriggerToast('Repair verification photo uploaded successfully.');
      } else {
        alert(data.error || 'Failed to upload photo.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error uploading file.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Submit Repair Report
  const handleSubmitRepair = async (e) => {
    e.preventDefault();
    if (!imageUrl) {
      alert('Please upload a photo of the repaired road.');
      return;
    }
    if (!currentCoords) {
      alert('Please capture your current GPS location to verify the site.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('roadnex_token');
      const res = await fetch(`/api/work-orders/${selectedWO.id}/submit-repair`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          repairedImageUrl: imageUrl,
          repairedLat: currentCoords.lat,
          repairedLng: currentCoords.lng
        })
      });
      const data = await res.json();
      if (data.success) {
        onTriggerToast(`Work order ${selectedWO.id} submitted for Admin verification.`);
        // Reload list and update selected
        await loadWorkOrders();
        setSelectedWO(null);
      } else {
        alert(data.error || 'Failed to submit repair report.');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting repair details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-custom-taupe tracking-tight flex items-center gap-2">
            <Wrench className="w-7 h-7 text-custom-terra" /> Municipal Dispatch Operations
          </h1>
          <p className="text-xs text-custom-sage font-medium mt-1">
            View assigned maintenance tickets, capture photographic resolution proof, and verify GPS geolocations.
          </p>
        </div>
        <button 
          onClick={loadWorkOrders}
          className="p-2.5 rounded-xl border border-custom-sage/30 hover:bg-white/40 text-custom-taupe transition-all flex items-center gap-1.5 text-xs font-bold"
        >
          <RefreshCw className="w-4 h-4 text-custom-terra" /> Refresh Dispatch List
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN - Assigned Work Orders List (Span 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-custom-sage/30 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-custom-taupe uppercase tracking-wider">
              Assigned Tickets Queue ({workOrders.filter(w => w.status !== 'Completed').length})
            </h3>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-2">
                <Loader2 className="w-8 h-8 text-custom-terra animate-spin" />
                <p className="text-[10px] text-custom-sage font-semibold uppercase tracking-wider">Loading maintenance queue...</p>
              </div>
            ) : workOrders.length === 0 ? (
              <div className="py-12 text-center text-custom-sage text-xs font-medium">
                No active work orders dispatched to your sector.
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {workOrders.map((wo) => {
                  const isSelected = selectedWO?.id === wo.id;
                  return (
                    <div 
                      key={wo.id}
                      onClick={() => setSelectedWO(wo)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                        isSelected 
                          ? 'border-custom-terra bg-custom-cream/20' 
                          : 'border-custom-sage/20 bg-custom-cream/5 hover:border-custom-sage/40'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-custom-taupe">{wo.id}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          wo.status === 'Completed' 
                            ? 'bg-emerald-100 text-emerald-600' 
                            : wo.status === 'Pending Verification'
                              ? 'bg-amber-100 text-amber-600 animate-pulse'
                              : 'bg-custom-terra/10 text-custom-terra'
                        }`}>
                          {wo.status}
                        </span>
                      </div>
                      
                      <h4 className="text-xs font-extrabold text-custom-taupe">{wo.defectType}</h4>
                      <p className="text-[10px] text-custom-sage font-medium mt-1 truncate">{wo.location}</p>

                      <div className="mt-3 flex justify-between items-center text-[10px] text-custom-sage font-semibold">
                        <span>Dispatched to Contractor</span>
                        <span className="text-custom-taupe font-bold">{wo.contractor}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN - Completion Form Dashboard (Span 7) */}
        <div className="lg:col-span-7">
          {selectedWO ? (
            <div className="bg-white border border-custom-sage/30 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-left">
              {/* Task Details Header */}
              <div className="border-b border-custom-sage/20 pb-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-custom-taupe uppercase tracking-wider flex items-center gap-1.5">
                    <ClipboardCheck className="w-4 h-4 text-custom-terra" /> Submit Resolution Log
                  </h3>
                  <span className="text-xs font-mono font-bold text-custom-sage">{selectedWO.id}</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-4 text-xs text-custom-taupe">
                  <div>
                    <span className="text-[10px] text-custom-sage font-semibold block uppercase">Type</span>
                    <span className="font-bold">{selectedWO.defectType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-custom-sage font-semibold block uppercase">Location</span>
                    <span className="font-bold truncate block" title={selectedWO.location}>{selectedWO.location}</span>
                  </div>
                </div>
              </div>

              {/* Status Restriction Check */}
              {selectedWO.status === 'Completed' ? (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-600 text-xs font-semibold">
                  <CheckCircle2 size={16} />
                  This repair task has already been resolved and verified by the Admin.
                </div>
              ) : selectedWO.status === 'Pending Verification' ? (
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3 text-amber-600 text-xs font-semibold animate-pulse">
                  <AlertTriangle size={16} />
                  Resolution log submitted! Awaiting Admin side-by-side photographic inspection.
                </div>
              ) : (
                <form onSubmit={handleSubmitRepair} className="space-y-6">
                  {/* Step 1: GPS Verification */}
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-bold text-custom-sage uppercase tracking-wider">Step 1: Capture Exact GPS Site Coordinates</h4>
                    <div className="p-4 rounded-2xl bg-custom-cream/40 border border-custom-sage/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-custom-taupe block">Automatic Site Check</span>
                        {currentCoords ? (
                          <div className="space-y-1">
                            <span className="text-[10px] text-custom-sage block font-mono">
                              Latitude: {currentCoords.lat.toFixed(5)} &bull; Longitude: {currentCoords.lng.toFixed(5)}
                            </span>
                            {distanceDelta !== null && (
                              <div className="flex items-center gap-1.5 text-[10px] font-bold mt-1">
                                {distanceDelta <= 100 ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className="text-emerald-500">Site Verified ({distanceDelta.toFixed(1)}m from center)</span>
                                  </>
                                ) : (
                                  <>
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                                    <span className="text-amber-500">Warning: You are {distanceDelta.toFixed(1)}m away from assigned site!</span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        ) : gpsLoading ? (
                          <span className="text-[10px] text-custom-sage font-medium flex items-center gap-1 animate-pulse">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-custom-terra" /> Pinning GPS satellite feed...
                          </span>
                        ) : gpsError ? (
                          <span className="text-[10px] text-rose-500 font-semibold">{gpsError}</span>
                        ) : (
                          <span className="text-[10px] text-custom-sage font-medium">GPS location not captured yet.</span>
                        )}
                      </div>
                      <button 
                        type="button"
                        onClick={captureGps}
                        disabled={gpsLoading}
                        className="px-4 py-2 border border-custom-sage/30 rounded-xl hover:bg-white text-xs font-bold text-custom-taupe transition-all flex items-center gap-1 cursor-pointer shrink-0 disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${gpsLoading ? 'animate-spin text-custom-terra' : ''}`} />
                        {currentCoords ? 'Recapture Site GPS' : 'Lock GPS Location'}
                      </button>
                    </div>
                  </div>

                  {/* Step 2: Photo Submission */}
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-bold text-custom-sage uppercase tracking-wider">Step 2: Upload Repaired Pothole Photo</h4>
                    
                    {imageUrl ? (
                      <div className="relative rounded-2xl overflow-hidden border border-custom-sage/30 h-44 bg-slate-900 group">
                        <img src={imageUrl} alt="Repaired Road" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setImageUrl('')}
                          className="absolute top-2 right-2 px-3 py-1 bg-black/60 hover:bg-black text-white text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                        >
                          Change Photo
                        </button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-custom-sage/30 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-custom-terra hover:bg-custom-cream/5 transition-all text-center">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handlePhotoSelect}
                          className="hidden"
                        />
                        {uploadingImage ? (
                          <>
                            <Loader2 className="w-8 h-8 text-custom-terra animate-spin mb-2" />
                            <span className="text-xs font-bold text-custom-taupe">Uploading repair photo...</span>
                          </>
                        ) : (
                          <>
                            <Camera className="w-8 h-8 text-custom-sage group-hover:text-custom-terra mb-2 transition-colors" />
                            <span className="text-xs font-bold text-custom-taupe">Take/Upload Post-Repair Photo</span>
                            <span className="text-[10px] text-custom-sage font-medium mt-1">Accepts PNG, JPG, JPEG</span>
                          </>
                        )}
                      </label>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-custom-sage/20">
                    <button 
                      type="submit"
                      disabled={isSubmitting || !imageUrl || !currentCoords}
                      className="w-full py-3 bg-custom-terra hover:bg-custom-terra/90 text-white text-xs font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting Resolution Log...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Submit Repair for Verification
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="bg-white border border-custom-sage/30 rounded-3xl p-12 shadow-sm text-center flex flex-col items-center justify-center h-full min-h-[400px]">
              <div className="w-16 h-16 rounded-3xl bg-custom-cream border border-custom-sage/30 flex items-center justify-center mb-4">
                <Wrench className="w-8 h-8 text-custom-sage" />
              </div>
              <h3 className="text-base font-extrabold text-custom-taupe">No Work Order Selected</h3>
              <p className="text-xs text-custom-sage font-medium mt-1.5 max-w-sm">
                Select an active maintenance task from the assigned queue to upload a photo and record GPS coordinates of the repaired site.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
