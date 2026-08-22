import React, { useEffect, useRef, useState } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { MapPin, Navigation, ExternalLink, Layers, AlertTriangle, Droplets, CheckCircle2 } from 'lucide-react';

export default function GoogleDefectMap({ defects = [], selectedFilter = 'All', onSelectWorkOrder, centerLat = 28.5708, centerLng = 77.2510, activePhotoLocation = null }) {
  const mapRef = useRef(null);
  const googleMapInstance = useRef(null);
  const markersRef = useRef([]);
  const clustererRef = useRef(null);
  
  const [mapType, setMapType] = useState('roadmap'); // 'roadmap', 'satellite', 'hybrid'
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GOOGLE_MAPS_API_KEY || localStorage.getItem('VITE_GOOGLE_MAPS_API_KEY') || '');
  const [isJsApiActive, setIsJsApiActive] = useState(false);
  const [selectedDefect, setSelectedDefect] = useState(null);

  const filteredDefects = defects.filter((d) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Waterlogging') return d.waterlogging;
    return d.severity?.toLowerCase() === selectedFilter.toLowerCase();
  });

  const activeLoc = activePhotoLocation || { lat: centerLat, lng: centerLng };

  useEffect(() => {
    // Register global Google Maps Auth Failure listener to suppress Google error modals
    window.gm_authFailure = () => {
      console.warn("Google Maps API Key Authentication failed. Switching to clean Google Maps Embed mode.");
      setIsJsApiActive(false);
    };

    // ONLY attempt JS API Script load if a non-empty key of length > 12 exists
    const isValidKeyFormat = apiKey && apiKey.trim().length > 12 && !apiKey.includes('YOUR_KEY');
    if (!isValidKeyFormat) {
      setIsJsApiActive(false);
      return;
    }

    if (window.google && window.google.maps) {
      initJsMap();
      return;
    }

    const scriptId = 'google-maps-js-script';
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey.trim()}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => initJsMap();
      script.onerror = () => setIsJsApiActive(false);
      document.head.appendChild(script);
    } else {
      initJsMap();
    }
  }, [apiKey]);

  const initJsMap = () => {
    if (!mapRef.current || !window.google || !window.google.maps) return;

    try {
      const mapOptions = {
        center: activeLoc,
        zoom: activePhotoLocation ? 15 : 12,
        mapTypeId: mapType,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#241812" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#241812" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#A86F4B" }] },
          { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#C18A63" }] },
          { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#C18A63" }] },
          { featureType: "road", elementType: "geometry", stylers: [{ color: "#302019" }] },
          { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#3A271E" }] },
          { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#D8C1B0" }] },
          { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#4A3328" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#302019" }] }
        ],
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: true,
        fullscreenControl: true
      };

      const map = new window.google.maps.Map(mapRef.current, mapOptions);
      googleMapInstance.current = map;
      setIsJsApiActive(true);

      renderMarkers(map);
    } catch (err) {
      console.warn("Google Maps JS API Fallback:", err);
      setIsJsApiActive(false);
    }
  };

  const renderMarkers = (map) => {
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    } else {
      markersRef.current.forEach(m => m.setMap(null));
    }
    markersRef.current = [];

    if (!window.google || !window.google.maps) return;

    filteredDefects.forEach((defect) => {
      let markerColor = '#3b82f6'; // LOW
      const status = defect.status?.toUpperCase() || 'OPEN';
      
      if (status === 'RESOLVED' || status === 'COMPLETED') {
        markerColor = '#22c55e'; // RESOLVED = green
      } else if (defect.severity === 'Critical') {
        markerColor = '#ef4444'; // CRITICAL = red
      } else if (defect.severity === 'High') {
        markerColor = '#f97316'; // HIGH = orange
      } else if (defect.severity === 'Medium') {
        markerColor = '#eab308'; // MEDIUM = yellow
      }
      
      const marker = new window.google.maps.Marker({
        position: { lat: defect.lat, lng: defect.lng },
        map: map,
        title: `${defect.type || defect.defectType} - ${defect.location}`,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: defect.severity === 'Critical' ? 10 : 8,
          fillColor: markerColor,
          fillOpacity: 0.9,
          strokeWeight: 2,
          strokeColor: '#0f172a'
        }
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="background-color: #0f172a; color: #f8fafc; font-family: sans-serif; padding: 12px; max-width: 240px; border-radius: 8px; border: 1px solid #334155;">
            <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">${defect.location}</div>
            <div style="font-weight: 800; font-size: 14px; color: #38bdf8; margin-bottom: 8px;">${defect.type || defect.defectType}</div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
              <div>
                <div style="font-size: 10px; color: #64748b;">SEVERITY</div>
                <div style="font-size: 12px; font-weight: bold; color: ${markerColor};">${defect.severity}</div>
              </div>
              <div>
                <div style="font-size: 10px; color: #64748b;">STATUS</div>
                <div style="font-size: 12px; font-weight: bold; color: ${status === 'RESOLVED' ? '#22c55e' : '#f8fafc'};">
                  ${status === 'RESOLVED' ? '✓ ' : ''}${status}
                </div>
              </div>
              <div>
                <div style="font-size: 10px; color: #64748b;">COMPLAINTS</div>
                <div style="font-size: 12px; font-weight: bold;">${defect.complaints || 1}</div>
              </div>
              <div>
                <div style="font-size: 10px; color: #64748b;">PRIORITY SCORE</div>
                <div style="font-size: 12px; font-weight: bold; color: #fb7185;">${defect.priorityScore}</div>
              </div>
            </div>
            
            <div style="font-size: 10px; color: #475569; margin-bottom: 12px;">
              Reported: ${new Date(defect.reportedDate || defect.createdAt).toLocaleDateString()}
            </div>
            
            <button style="width: 100%; background-color: #38bdf8; color: #0f172a; border: none; padding: 6px; border-radius: 4px; font-weight: bold; font-size: 11px; cursor: pointer;">
              ${status === 'RESOLVED' ? 'View Details' : 'View Work Order'}
            </button>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
        setSelectedDefect(defect);
        if (onSelectWorkOrder) onSelectWorkOrder(defect);
      });

      markersRef.current.push(marker);
    });

    if (clustererRef.current) {
      clustererRef.current.addMarkers(markersRef.current);
    } else {
      clustererRef.current = new MarkerClusterer({ map, markers: markersRef.current });
    }

    if (activePhotoLocation && window.google) {
      const photoMarker = new window.google.maps.Marker({
        position: { lat: activePhotoLocation.lat, lng: activePhotoLocation.lng },
        map: map,
        title: "Photo Capture Location Pin",
        animation: window.google.maps.Animation.DROP,
        icon: {
          path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 7,
          fillColor: '#3F78F5',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#ffffff'
        }
      });
      markersRef.current.push(photoMarker);
    }
  };

  useEffect(() => {
    if (googleMapInstance.current) {
      renderMarkers(googleMapInstance.current);
      
      // Auto-center map if there are filtered defects and no specific photo location is active
      if (filteredDefects.length > 0 && !activePhotoLocation && window.google) {
        const bounds = new window.google.maps.LatLngBounds();
        filteredDefects.forEach(d => {
          bounds.extend({ lat: d.lat, lng: d.lng });
        });
        googleMapInstance.current.fitBounds(bounds);
        
        // Prevent extreme zoom level when points are close together
        const listener = window.google.maps.event.addListener(googleMapInstance.current, 'idle', () => {
          if (googleMapInstance.current.getZoom() > 14) {
            googleMapInstance.current.setZoom(14);
          }
          window.google.maps.event.removeListener(listener);
        });
      }
    }
  }, [defects, selectedFilter, activePhotoLocation]);

  useEffect(() => {
    if (googleMapInstance.current) {
      googleMapInstance.current.setMapTypeId(mapType);
    }
  }, [mapType]);

  // Format Google Maps Embed URL based on view mode (roadmap vs satellite vs hybrid)
  const embedTypeParam = mapType === 'satellite' || mapType === 'hybrid' ? '&t=k' : '';
  const embedSrc = `https://maps.google.com/maps?q=${activeLoc.lat},${activeLoc.lng}&z=${activePhotoLocation ? 15 : 12}${embedTypeParam}&output=embed`;

  return (
    <div className="w-full h-full min-h-[420px] rounded-xl overflow-hidden relative border border-slate-800/80 shadow-2xl bg-slate-950 flex flex-col">
      {/* Map Header Controls Bar */}
      <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-100">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span>Google Maps Smart City Operations</span>
          {activePhotoLocation && (
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono">
              📍 Photo Location Pin Locked
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Map View Mode Selectors */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] gap-1">
            <button
              onClick={() => setMapType('roadmap')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                mapType === 'roadmap' ? 'bg-cyan-500 text-slate-100 shadow' : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              Roadmap
            </button>
            <button
              onClick={() => setMapType('satellite')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                mapType === 'satellite' ? 'bg-cyan-500 text-slate-100 shadow' : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapType('hybrid')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                mapType === 'hybrid' ? 'bg-cyan-500 text-slate-100 shadow' : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              Hybrid
            </button>
          </div>

          {/* Open directly in Google Maps website */}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${activeLoc.lat},${activeLoc.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-bold flex items-center gap-1 border border-slate-700 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Google Maps
          </a>
        </div>
      </div>

      {/* Map Viewport Area */}
      <div className="relative flex-1 min-h-[380px] w-full bg-slate-950">
        {/* JS API Mount Node (Active when valid API Key exists) */}
        {isJsApiActive ? (
          <div ref={mapRef} className="w-full h-full min-h-[380px] z-10" />
        ) : (
          /* Clean Google Maps Embed Viewport (Zero error popups) */
          <iframe
            title="Clean Google Maps Operations View"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '380px' }}
            loading="lazy"
            allowFullScreen
            src={embedSrc}
            className="w-full h-full min-h-[380px] absolute inset-0 z-0"
          ></iframe>
        )}

        {/* Overlay Photo Location Pin Banner */}
        {activePhotoLocation && (
          <div className="absolute top-3 left-3 z-30 bg-slate-950/90 backdrop-blur border border-cyan-500/40 p-3 rounded-xl max-w-sm text-xs space-y-1 shadow-2xl">
            <div className="flex items-center gap-1.5 text-cyan-400 font-extrabold">
              <Navigation className="w-4 h-4" /> Photo Location Pin Locked
            </div>
            <p className="text-slate-100 font-semibold">{activePhotoLocation.address || 'Uploaded Photo Location'}</p>
            <div className="font-mono text-[10px] text-emerald-400 flex items-center gap-2">
              <span>LAT: {activeLoc.lat}° N</span>
              <span>LNG: {activeLoc.lng}° E</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
