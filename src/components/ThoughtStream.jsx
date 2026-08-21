import React from 'react';
import { Cpu, Check } from 'lucide-react';

export default function ThoughtStream({ steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="card">
      <h3 className="card-title" style={{ color: 'var(--accent-cyan)', marginBottom: '0.75rem' }}>
        <Cpu size={18} /> Agent Reasoning & Execution Stream
      </h3>
      <div className="thought-stream">
        {steps.map((step, idx) => (
          <div key={idx} className="step-item">
            <div className="step-icon">
              <Check size={14} />
            </div>
            <div className="step-details">
              <span className="step-title">{step.title}</span> &bull;{' '}
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8em' }}>{step.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
