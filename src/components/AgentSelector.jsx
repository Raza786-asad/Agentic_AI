import React from 'react';
import { Bot } from 'lucide-react';

export default function AgentSelector({ agents, selectedAgentId, onSelectAgent }) {
  return (
    <div className="card">
      <h3 className="card-title">
        <Bot size={18} /> Active Agent Squad
      </h3>
      <div className="agent-selector-list">
        {agents.length === 0 ? (
          <div className="empty-state">
            <div className="spinner"></div>
            <span>Loading agents...</span>
          </div>
        ) : (
          agents.map((agent) => (
            <div
              key={agent.id}
              className={`agent-option ${agent.id === selectedAgentId ? 'active' : ''}`}
              onClick={() => onSelectAgent(agent.id)}
            >
              <div className="agent-icon-box">{agent.icon}</div>
              <div className="agent-info">
                <h4>{agent.name}</h4>
                <p>{agent.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
