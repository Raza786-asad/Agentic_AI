import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Filter, AlertTriangle, Layers, Navigation, Compass, ExternalLink } from 'lucide-react';
import GoogleDefectMap from '../components/GoogleDefectMap';
import WorkOrderModal from '../components/WorkOrderModal';
import { State } from 'country-state-city';
import { getDistricts } from 'india-state-district';

export default function GisMapPage({ defects = [], onUpdateStatus, onTriggerToast, currentUser }) {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedDefect, setSelectedDefect] = useState(null);
  const [localDefects, setLocalDefects] = useState(defects);
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');

  useEffect(() => {
    setLocalDefects(defects);
  }, [defects]);

  // Indian Data Setup
  const allStates = useMemo(() => State.getStatesOfCountry('IN'), []);
  
  const availableDistricts = useMemo(() => {
    if (selectedState === 'ALL') return [];
    const stateObj = allStates.find(s => s.name === selectedState);
    if (!stateObj) return [];
    const districts = getDistricts(stateObj.isoCode) || [];
    
    // Custom districts not in the package
    const customDistricts = { 'AP': ['Chebrolu'] };
    const extras = customDistricts[stateObj.isoCode] || [];
    return [...new Set([...districts, ...extras])];
  }, [selectedState, allStates]);

  const uniqueStates = ['ALL', ...allStates.map(s => s.name).sort()];
  const uniqueDistricts = ['ALL', ...availableDistricts.sort()];

  // Live polling for real-time map updates
  useEffect(() => {
    const token = localStorage.getItem('roadnex_token');
    if (!token) return;

    const fetchLatestDefects = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedState !== 'ALL') params.append('state', selectedState);
        if (selectedDistrict !== 'ALL') params.append('district', selectedDistrict);
        
        const res = await fetch(`/api/reports?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.reports) {
          const apiDefects = data.reports.map((r) => ({
            id:           r.id,
            location:     r.location,
            type:         r.defectType,
            severity:     r.severity,
            confidence:   r.confidence,
            area:         r.area,
            depth:        r.depth,
            complaints:   1,
            waterlogging: r.waterlogging !== 'N/A',
            priorityScore: r.priorityScore,
            lat:          r.lat,
            lng:          r.lng,
            reportedDate: r.createdAt,
            status:       r.status,
            imageUrl:     r.imageUrl,
            citizenName:  r.citizenName,
            isMyUpload:   r.userId === currentUser?.id,
            state:        r.state,
            district:     r.district,
          }));
          setLocalDefects(apiDefects);
        }
      } catch (err) {
        console.error('Failed to poll live defects:', err);
      }
    };

    const interval = setInterval(fetchLatestDefects, 4000);
    // Fetch immediately when dependencies change
    fetchLatestDefects();
    return () => clearInterval(interval);
  }, [currentUser, selectedState, selectedDistrict]);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-custom-taupe tracking-tight flex items-center gap-2">
            <MapPin className="w-7 h-7 text-custom-terra" /> Leaflet OpenStreetMap Smart City GIS Command Center
          </h1>
          <p className="text-xs text-custom-sage font-medium mt-1">
            Real-time urban road defect mapping with Leaflet GIS Command Center.
          </p>
        </div>

        {currentUser?.role !== 'user' && (
          <div className="flex items-center gap-4 bg-white p-2 px-4 rounded-xl shadow-sm border border-custom-sage/30">
            <div className="flex items-center gap-2">
              <span className="text-xs text-custom-sage font-semibold">State:</span>
              <select 
                value={selectedState} 
                onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict('ALL'); }}
                className="bg-custom-cream text-custom-taupe text-xs rounded-lg px-2 py-1 outline-none focus:border-custom-terra min-w-[120px]"
              >
                {uniqueStates.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-custom-sage font-semibold">District:</span>
              <select 
                value={selectedDistrict} 
                onChange={(e) => { setSelectedDistrict(e.target.value); }}
                className="bg-custom-cream text-custom-taupe text-xs rounded-lg px-2 py-1 outline-none focus:border-custom-terra min-w-[120px]"
              >
                {uniqueDistricts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="flex items-center gap-2 bg-custom-cream p-1.5 rounded-xl border border-custom-sage/30 text-xs">
          <span className="text-custom-sage font-medium font-bold px-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-custom-terra" /> Severity:
          </span>
          {['All', 'Critical', 'High', 'Medium', 'Waterlogging'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedFilter === filter
                  ? 'bg-cyan-500 text-custom-taupe shadow-md shadow-cyan-500/20'
                  : 'text-custom-sage font-medium hover:text-custom-taupe hover:bg-custom-sage/10'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main GIS Leaflet Map Viewport */}
      <div className="h-[580px] w-full">
        <GoogleDefectMap
          defects={localDefects}
          selectedFilter={selectedFilter}
          onSelectWorkOrder={(defect) => setSelectedDefect(defect)}
          userRole={currentUser?.role}
        />
      </div>

      {/* Work Order Inspect Modal */}
      {selectedDefect && currentUser?.role !== 'user' && (
        <WorkOrderModal
          defect={selectedDefect}
          onClose={() => setSelectedDefect(null)}
          onUpdateStatus={(id, newStatus) => {
            onUpdateStatus(id, newStatus);
            onTriggerToast(`Work Order ${id} updated to ${newStatus}`);
            setSelectedDefect(null);
          }}
        />
      )}
    </div>
  );
}
