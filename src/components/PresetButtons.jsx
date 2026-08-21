import React from 'react';
import { Rocket } from 'lucide-react';

export default function PresetButtons({ onApplyPreset }) {
  const presets = [
    {
      agentId: 'planner',
      title: 'Architect AI Resume Parser',
      prompt: 'Build a full-stack AI resume parser web app with PDF upload and skills extraction.',
      icon: '🗺️'
    },
    {
      agentId: 'coder',
      title: 'Express Rate-Limit Middleware',
      prompt: 'Write an Express middleware to rate limit API requests to 100 per minute per IP.',
      icon: '⚡'
    },
    {
      agentId: 'researcher',
      title: 'Compare Hackathon Databases',
      prompt: 'Compare SQLite vs MongoDB vs PostgreSQL for a 24-hour hackathon project.',
      icon: '🔍'
    },
    {
      agentId: 'pitch',
      title: 'Pitch Deck Outline & Hook',
      prompt: 'Generate 3-minute pitch deck outline and 30-second elevator pitch for an AI Copilot.',
      icon: '🚀'
    }
  ];

  return (
    <div className="card">
      <h3 className="card-title">
        <Rocket size={18} /> Quick Hackathon Presets
      </h3>
      <div className="preset-buttons">
        {presets.map((p, idx) => (
          <button
            key={idx}
            className="btn-preset"
            onClick={() => onApplyPreset(p.agentId, p.prompt)}
          >
            <span>{p.icon}</span> {p.title}
          </button>
        ))}
      </div>
    </div>
  );
}
