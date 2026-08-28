import React, { useEffect, useRef } from 'react';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';

export default function GoogleDefectMap({ defects = [], selectedFilter = 'All', onSelectWorkOrder, centerLat = 28.5708, centerLng = 77.2510, activePhotoLocation = null, userRole }) {
  const mapContainerRef = useRef(null);
  const leafletMapInstance = useRef(null);
  const markersRef = useRef([]);

  const filteredDefects = defects.filter((d) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Waterlogging') return d.waterlogging && d.waterlogging !== 'N/A';
    return d.severity?.toLowerCase() === selectedFilter.toLowerCase();
  });

  const activeLoc = activePhotoLocation || { lat: centerLat, lng: centerLng };

  useEffect(() => {
    // If Leaflet is not loaded on window, wait
    if (!window.L || !mapContainerRef.current) return;

    // Destroy existing map instance to prevent double-initialization bugs
    if (leafletMapInstance.current) {
      leafletMapInstance.current.remove();
      leafletMapInstance.current = null;
    }

    try {
      // Initialize map instance
      const map = window.L.map(mapContainerRef.current, {
        center: [activeLoc.lat, activeLoc.lng],
        zoom: activePhotoLocation ? 16 : 13,
        zoomControl: true,
        attributionControl: true
      });
      leafletMapInstance.current = map;

      // Add OpenStreetMap dark/light themed tile layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      renderMarkers(map);
    } catch (err) {
      console.error('Failed to initialize Leaflet Map:', err);
    }

    return () => {
      if (leafletMapInstance.current) {
        leafletMapInstance.current.remove();
        leafletMapInstance.current = null;
      }
    };
  }, [activeLoc.lat, activeLoc.lng, activePhotoLocation]);

  // Handle marker updates when defects or filters change
  useEffect(() => {
    if (leafletMapInstance.current) {
      renderMarkers(leafletMapInstance.current);
    }
  }, [defects, selectedFilter, activePhotoLocation]);

  const renderMarkers = (map) => {
    if (!window.L) return;

    // Remove existing markers from the map
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    // 1. Add active photo location pin if present (Blue active radar pin)
    if (activePhotoLocation) {
      const activeIcon = window.L.divIcon({
        className: 'custom-active-pin',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background-color: rgba(59, 130, 246, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="background-color: #3b82f6; border: 2px solid white; border-radius: 50%; width: 14px; height: 14px; box-shadow: 0 0 10px rgba(0,0,0,0.5); z-index: 10;"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const activeMarker = window.L.marker([activePhotoLocation.lat, activePhotoLocation.lng], { icon: activeIcon })
        .addTo(map)
        .bindPopup(`
          <div style="color: #0f172a; font-family: sans-serif; font-size: 11px; padding: 4px;">
            <b style="font-size: 12px; color: #1e3a8a;">Selected Photo Location</b><br>
            ${activePhotoLocation.address || 'GPS Coordinates'}
          </div>
        `);
      
      markersRef.current.push(activeMarker);
    }

    // 2. Add defect markers
    filteredDefects.forEach((defect) => {
      const status = defect.status?.toUpperCase() || 'OPEN';
      let animationName = '';
      let markerColor = '#3b82f6'; // Fallback color

      // Determine blink animations and colors based on status:
      // Unverified/reported -> blink red
      // Pending/In Progress/Open -> blink yellow
      // Solved/Resolved/Completed -> blink green
      if (status === 'REPORTED') {
        animationName = 'blink-red 1.2s infinite';
        markerColor = '#ef4444';
      } else if (status === 'PENDING' || status === 'IN PROGRESS' || status === 'OPEN') {
        animationName = 'blink-yellow 1.4s infinite';
        markerColor = '#eab308';
      } else if (status === 'RESOLVED' || status === 'COMPLETED') {
        animationName = 'blink-green 1.6s infinite';
        markerColor = '#22c55e';
      } else {
        // Fallback animation based on severity
        if (defect.severity === 'Critical') {
          animationName = 'blink-red 1.2s infinite';
          markerColor = '#ef4444';
        } else if (defect.severity === 'High' || defect.severity === 'Medium') {
          animationName = 'blink-yellow 1.4s infinite';
          markerColor = '#f97316';
        } else {
          animationName = 'blink-green 1.6s infinite';
          markerColor = '#22c55e';
        }
      }

      // Modern dot marker with dynamic blink animations
      const customIcon = window.L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="animation: ${animationName}; border: 2px solid #ffffff; border-radius: 50%; width: 14px; height: 14px; box-shadow: 0 0 6px rgba(0,0,0,0.5);"></div>
        `,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      const marker = window.L.marker([defect.lat, defect.lng], { icon: customIcon })
        .addTo(map);

      // Defect details HTML popup
      const popupHtml = `
        <div style="background-color: #0f172a; color: #f8fafc; font-family: sans-serif; padding: 12px; max-width: 220px; border-radius: 8px; border: 1px solid #334155; line-height: 1.4;">
          <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${defect.location || 'Unknown Road'}
          </div>
          ${defect.state || defect.district ? `
          <div style="font-size: 9px; color: #38bdf8; text-transform: uppercase; margin-bottom: 4px; opacity: 0.9;">
            📍 ${defect.district ? defect.district + ', ' : ''}${defect.state || ''}
          </div>
          ` : ''}
          <div style="font-weight: 800; font-size: 14px; color: #38bdf8; margin-bottom: 8px;">
            ${defect.type || defect.defectType || 'Road Defect'}
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; font-size: 11px;">
            <div>
              <div style="font-size: 9px; color: #64748b;">SEVERITY</div>
              <div style="font-weight: bold; color: ${markerColor};">${defect.severity || 'Medium'}</div>
            </div>
            <div>
              <div style="font-size: 9px; color: #64748b;">STATUS</div>
              <div style="font-weight: bold; color: ${status === 'RESOLVED' ? '#22c55e' : '#f8fafc'};">${status}</div>
            </div>
            <div>
              <div style="font-size: 9px; color: #64748b;">COMPLAINTS</div>
              <div style="font-weight: bold;">${defect.complaints || 1}</div>
            </div>
            <div>
              <div style="font-size: 9px; color: #64748b;">PRIORITY</div>
              <div style="font-weight: bold; color: #fb7185;">${defect.priorityScore || 50}</div>
            </div>
          </div>
          
          ${userRole !== 'user' ? `
          <button id="btn-${defect.id}" style="width: 100%; background-color: #38bdf8; color: #0f172a; border: none; padding: 6px; border-radius: 4px; font-weight: bold; font-size: 11px; cursor: pointer; text-align: center; transition: all 0.2s;">
            View Work Order
          </button>
          ` : ''}
        </div>
      `;

      marker.bindPopup(popupHtml);

      // Hook click event handler to the popup button after render
      if (userRole !== 'user') {
        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-${defect.id}`);
          if (btn) {
            btn.addEventListener('click', () => {
              if (onSelectWorkOrder) onSelectWorkOrder(defect);
            });
          }
        });
      }

      markersRef.current.push(marker);
    });

    // Auto-fit zoom levels if we have multiple points
    if (filteredDefects.length > 0 && !activePhotoLocation) {
      const bounds = filteredDefects.map(d => [d.lat, d.lng]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  };

  return (
    <div className="w-full h-full min-h-[420px] rounded-xl overflow-hidden relative border border-slate-800/80 shadow-2xl bg-slate-950 flex flex-col">
      {/* Map Header Controls Bar */}
      <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 z-[1000]">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-100">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span>Leaflet Smart City Operations Map</span>
          {activePhotoLocation && (
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono">
              📍 Photo Location Pin Locked
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Direct Link to External Mapping Services */}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${activeLoc.lat},${activeLoc.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-bold flex items-center gap-1 border border-slate-700 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View on Google Maps
          </a>
        </div>
      </div>

      {/* Leaflet Map Viewport Container */}
      <div className="relative flex-1 min-h-[380px] w-full bg-slate-950">
        <div ref={mapContainerRef} className="w-full h-full min-h-[380px] z-10" />

        {/* Overlay Photo Location Pin Banner */}
        {activePhotoLocation && (
          <div className="absolute top-3 left-3 z-[1000] bg-slate-950/90 backdrop-blur border border-cyan-500/40 p-3 rounded-xl max-w-sm text-xs space-y-1 shadow-2xl">
            <div className="flex items-center gap-1.5 text-cyan-400 font-extrabold">
              <Navigation className="w-4 h-4" /> GPS Photo Location Pin
            </div>
            <p className="text-slate-100 font-semibold">{activePhotoLocation.address || 'Uploaded Photo Location'}</p>
            <div className="font-mono text-[10px] text-emerald-400 flex items-center gap-2">
              <span>LAT: {activeLoc.lat}° N</span>
              <span>LNG: {activeLoc.lng}° E</span>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animation Keyframes for Radar Ring */}
      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        @keyframes blink-red {
          0%, 100% {
            background-color: #ef4444;
            box-shadow: 0 0 10px #ef4444, inset 0 0 2px #ef4444;
          }
          50% {
            background-color: #7f1d1d;
            box-shadow: 0 0 2px #7f1d1d;
          }
        }
        @keyframes blink-yellow {
          0%, 100% {
            background-color: #eab308;
            box-shadow: 0 0 10px #eab308, inset 0 0 2px #eab308;
          }
          50% {
            background-color: #713f12;
            box-shadow: 0 0 2px #713f12;
          }
        }
        @keyframes blink-green {
          0%, 100% {
            background-color: #22c55e;
            box-shadow: 0 0 10px #22c55e, inset 0 0 2px #22c55e;
          }
          50% {
            background-color: #14532d;
            box-shadow: 0 0 2px #14532d;
          }
        }
        /* Override default Leaflet popup styling to fit dark theme */
        .leaflet-popup-content-wrapper, .leaflet-popup-tip {
          background-color: transparent !important;
          box-shadow: none !important;
          border: none !important;
          padding: 0 !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
        }
        .leaflet-popup-close-button {
          color: #94a3b8 !important;
          z-index: 1100 !important;
          top: 8px !important;
          right: 8px !important;
        }
      `}</style>
    </div>
  );
}
