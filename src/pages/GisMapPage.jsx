import React, { useState } from 'react';
import { MapPin, Filter, AlertTriangle, Layers, Navigation, Compass, ExternalLink } from 'lucide-react';
import GoogleDefectMap from '../components/GoogleDefectMap';
import WorkOrderModal from '../components/WorkOrderModal';

export default function GisMapPage({ defects, onUpdateStatus, onTriggerToast }) {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedDefect, setSelectedDefect] = useState(null);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <MapPin className="w-7 h-7 text-cyan-400" /> Google Maps Smart City GIS Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time urban road defect mapping with Google Maps API Satellite, Hybrid & Vector overlays.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400 font-bold px-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-cyan-400" /> Severity:
          </span>
          {['All', 'Critical', 'High', 'Medium', 'Waterlogging'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedFilter === filter
                  ? 'bg-cyan-500 text-slate-100 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Google Map Viewport */}
      <div className="h-[580px] w-full">
        <GoogleDefectMap
          defects={defects}
          selectedFilter={selectedFilter}
          onSelectWorkOrder={(defect) => setSelectedDefect(defect)}
        />
      </div>

      {/* Work Order Inspect Modal */}
      {selectedDefect && (
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
