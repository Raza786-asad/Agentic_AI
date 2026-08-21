import React from 'react';
import { Bot, Activity, Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <header class="navbar">
      <div class="brand">
        <div class="brand-logo">
          <Bot size={22} />
        </div>
        <span class="brand-text">Agentic AI Studio</span>
        <span class="badge-tag">
          <Sparkles size={12} /> React Hackathon v1.0
        </span>
      </div>
      <div class="nav-actions">
        <div class="status-indicator">
          <div class="status-dot"></div>
          <Activity size={15} style={{ marginRight: '2px' }} />
          <span>System Online</span>
        </div>
      </div>
    </header>
  );
}
