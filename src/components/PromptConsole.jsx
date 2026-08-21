import React from 'react';
import { MessageSquare, Zap } from 'lucide-react';

export default function PromptConsole({ 
  prompt, 
  onPromptChange, 
  onRunTask, 
  loading, 
  activeAgentName 
}) {
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRunTask();
    }
  };

  return (
    <div className="card prompt-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="card-title" style={{ marginBottom: 0 }}>
          <MessageSquare size={18} /> Agent Prompt Console
        </h3>
        <span 
          className="badge-tag" 
          style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: 'var(--accent-emerald)', color: 'var(--accent-emerald)' }}
        >
          {activeAgentName || 'Agent Active'}
        </span>
      </div>

      <div className="prompt-input-wrapper">
        <textarea
          className="prompt-textarea"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your task, idea, feature request, or code bug here... (e.g. Build an AI-powered smart study planner with task scheduling API)"
        />
      </div>

      <div className="prompt-actions">
        <span className="helper-text">
          Press <strong>Run Agent Task</strong> or <kbd>Ctrl + Enter</kbd> to execute
        </span>
        <button
          className="btn-primary"
          onClick={onRunTask}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              <span>Running Agent...</span>
            </>
          ) : (
            <>
              <Zap size={18} />
              <span>Run Agent Task</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
