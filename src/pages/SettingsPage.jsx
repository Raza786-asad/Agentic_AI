import React, { useState } from 'react';
import { Settings, Save, Sliders, MapPin, Database, Key } from 'lucide-react';

export default function SettingsPage({ onTriggerToast }) {
  const [aiThreshold, setAiThreshold] = useState(85);
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [googleMapsKey, setGoogleMapsKey] = useState(import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '');

  const handleSave = () => {
    if (googleMapsKey) {
      localStorage.setItem('VITE_GOOGLE_MAPS_API_KEY', googleMapsKey);
    }
    onTriggerToast('RoadGuard AI system parameters & Google Maps key saved!');
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-7 h-7 text-cyan-400" /> Platform Settings & Operations Controls
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure AI vision confidence cutoffs, Google Maps API key, and municipal dispatch thresholds.
        </p>
      </div>

      <div className="space-y-6">
        {/* Google Maps API Configuration Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" /> Google Maps API Key Configuration
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-200 block mb-1">
                Google Maps JavaScript API Key (`VITE_GOOGLE_MAPS_API_KEY`)
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Paste AIzaSy... your Google Maps API Key here"
                  value={googleMapsKey}
                  onChange={(e) => setGoogleMapsKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                You can also place this key in your project's <code className="text-cyan-300 font-mono">.env</code> file as <code className="text-cyan-300 font-mono">VITE_GOOGLE_MAPS_API_KEY=AIzaSy...</code>
              </p>
            </div>
          </div>
        </div>

        {/* AI Model Controls */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" /> AI Neural Vision Parameters
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-slate-200">Minimum AI Confidence Threshold</span>
                <span className="font-mono font-bold text-cyan-400">{aiThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={aiThreshold}
                onChange={(e) => setAiThreshold(e.target.value)}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Defects detected with confidence below {aiThreshold}% will require manual human engineer review.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div>
                <span className="font-semibold text-slate-200 block">Automated Contractor Dispatch</span>
                <span className="text-[11px] text-slate-400">Automatically generate work orders for Critical defects</span>
              </div>
              <input
                type="checkbox"
                checked={autoDispatch}
                onChange={(e) => setAutoDispatch(e.target.checked)}
                className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* GIS & Telemetry Integration */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" /> Smart City GIS Integration
          </h3>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span>Google Maps JavaScript & Embed API</span>
              <span className="text-emerald-400 font-bold text-[11px]">Connected</span>
            </div>
            <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span>Municipal Contractor Dispatch API</span>
              <span className="text-emerald-400 font-bold text-[11px]">Active</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save Configuration Parameters
        </button>
      </div>
    </div>
  );
}
