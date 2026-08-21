/**
 * Agentic AI Studio - Frontend Application Logic
 */

let selectedAgentId = 'planner';
let availableAgents = [];
let lastResponseData = null;
let currentTab = 'formatted';

document.addEventListener('DOMContentLoaded', () => {
  fetchAgents();

  // Keyboard shortcut Ctrl + Enter to submit prompt
  document.getElementById('promptInput').addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runAgentTask();
    }
  });
});

/**
 * Fetches supported agents list from backend
 */
async function fetchAgents() {
  const agentListEl = document.getElementById('agentList');
  try {
    const res = await fetch('/api/agents');
    const data = await res.json();

    if (data.success && Array.isArray(data.agents)) {
      availableAgents = data.agents;
      renderAgentList(data.agents);
    } else {
      agentListEl.innerHTML = `<div class="empty-state">Failed to load agents list.</div>`;
    }
  } catch (err) {
    console.error('Error fetching agents:', err);
    // Fallback static rendering if network is briefly offline
    const fallbackAgents = [
      { id: 'planner', name: 'Architect & Task Planner', icon: '🗺️', description: 'System Architecture & Roadmaps', badge: 'Architect' },
      { id: 'coder', name: 'Code Generator & Debugger', icon: '⚡', description: 'Full-Stack Code Generation', badge: 'Engineer' },
      { id: 'researcher', name: 'Web Research & Intelligence', icon: '🔍', description: 'Tech Feasibility & Intelligence', badge: 'Researcher' },
      { id: 'pitch', name: 'Hackathon Pitch & Deck Designer', icon: '🚀', description: 'Presentation & Elevator Pitch', badge: 'Strategist' }
    ];
    availableAgents = fallbackAgents;
    renderAgentList(fallbackAgents);
  }
}

/**
 * Renders agent selection options in sidebar
 */
function renderAgentList(agents) {
  const agentListEl = document.getElementById('agentList');
  agentListEl.innerHTML = agents.map(agent => `
    <div 
      class="agent-option ${agent.id === selectedAgentId ? 'active' : ''}" 
      onclick="selectAgent('${agent.id}')"
      id="agent-card-${agent.id}"
    >
      <div class="agent-icon-box">${agent.icon}</div>
      <div class="agent-info">
        <h4>${agent.name}</h4>
        <p>${agent.description}</p>
      </div>
    </div>
  `).join('');

  updateActiveBadge();
}

/**
 * Selects active agent
 */
function selectAgent(agentId) {
  selectedAgentId = agentId;
  document.querySelectorAll('.agent-option').forEach(el => el.classList.remove('active'));
  
  const activeCard = document.getElementById(`agent-card-${agentId}`);
  if (activeCard) activeCard.classList.add('active');

  updateActiveBadge();
}

function updateActiveBadge() {
  const activeAgent = availableAgents.find(a => a.id === selectedAgentId);
  const badgeEl = document.getElementById('activeAgentBadge');
  if (activeAgent && badgeEl) {
    badgeEl.textContent = `${activeAgent.icon} ${activeAgent.name} Active`;
  }
}

/**
 * Applies quick preset to input box & selects matching agent
 */
function applyPreset(agentId, promptText) {
  selectAgent(agentId);
  const inputEl = document.getElementById('promptInput');
  inputEl.value = promptText;
  inputEl.focus();
}

/**
 * Executes agent task request
 */
async function runAgentTask() {
  const promptInput = document.getElementById('promptInput');
  const runBtn = document.getElementById('runBtn');
  const promptText = promptInput.value.trim();

  if (!promptText) {
    alert('Please enter a prompt or select a hackathon preset.');
    promptInput.focus();
    return;
  }

  // UI Loading state
  runBtn.disabled = true;
  runBtn.innerHTML = `<div class="spinner"></div> <span>Running Agent...</span>`;
  
  const streamWrapper = document.getElementById('thoughtStreamWrapper');
  const streamEl = document.getElementById('thoughtStream');
  const formattedOutput = document.getElementById('formattedOutput');
  const rawCode = document.getElementById('rawCode');
  const copyBtn = document.getElementById('copyBtn');

  streamWrapper.style.display = 'block';
  streamEl.innerHTML = `<div class="step-item"><div class="spinner" style="width: 14px; height: 14px;"></div><span>Dispatching prompt to agent worker...</span></div>`;
  
  formattedOutput.innerHTML = `
    <div class="empty-state">
      <div class="spinner" style="width: 36px; height: 36px; border-width: 4px;"></div>
      <h4>Agent Working</h4>
      <p>Executing step-by-step reasoning pipeline...</p>
    </div>
  `;

  try {
    const res = await fetch('/api/run-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentId: selectedAgentId,
        prompt: promptText
      })
    });

    const data = await res.json();

    if (data.success) {
      lastResponseData = data;
      
      // Animate thought steps
      await renderThoughtStream(data.steps || []);
      
      // Render Markdown output
      const htmlContent = parseSimpleMarkdown(data.output);
      formattedOutput.innerHTML = htmlContent;
      rawCode.textContent = data.output;
      copyBtn.style.display = 'flex';
    } else {
      formattedOutput.innerHTML = `<div class="empty-state" style="color: var(--accent-rose);">❌ ${data.error || 'Agent failed to respond.'}</div>`;
    }
  } catch (err) {
    console.error('Error running agent task:', err);
    formattedOutput.innerHTML = `<div class="empty-state" style="color: var(--accent-rose);">❌ Network error. Check server logs.</div>`;
  } finally {
    runBtn.disabled = false;
    runBtn.innerHTML = `<span>⚡ Run Agent Task</span>`;
  }
}

/**
 * Animates execution thought steps in stream timeline
 */
async function renderThoughtStream(steps) {
  const streamEl = document.getElementById('thoughtStream');
  streamEl.innerHTML = '';

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const stepEl = document.createElement('div');
    stepEl.className = 'step-item';
    stepEl.innerHTML = `
      <div class="step-icon">✓</div>
      <div class="step-details">
        <span class="step-title">${step.title}</span> &bull; 
        <span style="color: var(--text-muted); font-size: 0.8em;">${step.detail}</span>
      </div>
    `;
    streamEl.appendChild(stepEl);
    await new Promise(r => setTimeout(r, 180));
  }
}

/**
 * Lightweight Markdown Parser (No external dependencies)
 */
function parseSimpleMarkdown(md) {
  if (!md) return '';
  let html = md;

  // Escape HTML entities inside code blocks safety handled line by line
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Blockquotes
  html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

  // Fenced Code Blocks
  html = html.replace(/```([a-z]*)\n([\s\S]*?)```/gim, (match, lang, code) => {
    const safeCode = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<pre><code class="language-${lang}">${safeCode.trim()}</code></pre>`;
  });

  // Inline Code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Bold & Italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Tables
  html = html.replace(/^\|(.+)\|$/gim, (match, content) => {
    const cells = content.split('|').map(c => c.trim());
    if (cells.some(c => c.includes('---'))) return ''; // Skip markdown divider line
    const isHeader = match.includes('---');
    const tag = 'td';
    return `<tr>${cells.map(c => `<${tag}>${c}</${tag}>`).join('')}</tr>`;
  });
  html = html.replace(/(<tr>[\s\S]*?<\/tr>)/gim, '<table>$1</table>');
  // Clean up duplicate consecutive <table> tags
  html = html.replace(/<\/table>\s*<table>/gim, '');

  // Unordered Lists
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
  html = html.replace(/<\/ul>\s*<ul>/gim, '');

  // Paragraphs
  html = html.replace(/\n\n/g, '<br><br>');

  return html;
}

/**
 * Tab switcher for output view
 */
function switchOutputTab(tab) {
  currentTab = tab;
  const formattedEl = document.getElementById('formattedOutput');
  const rawEl = document.getElementById('rawOutput');
  const tabFormatted = document.getElementById('tabFormatted');
  const tabRaw = document.getElementById('tabRaw');

  if (tab === 'formatted') {
    formattedEl.style.display = 'block';
    rawEl.style.display = 'none';
    tabFormatted.classList.add('active');
    tabRaw.classList.remove('active');
  } else {
    formattedEl.style.display = 'none';
    rawEl.style.display = 'block';
    tabFormatted.classList.remove('active');
    tabRaw.classList.add('active');
  }
}

/**
 * Copies generated markdown output to clipboard
 */
function copyOutputText() {
  if (!lastResponseData || !lastResponseData.output) return;

  navigator.clipboard.writeText(lastResponseData.output).then(() => {
    const copyBtn = document.getElementById('copyBtn');
    const oldText = copyBtn.innerHTML;
    copyBtn.innerHTML = `<span>✅ Copied!</span>`;
    setTimeout(() => {
      copyBtn.innerHTML = oldText;
    }, 2000);
  }).catch(err => {
    console.error('Copy failed:', err);
  });
}
