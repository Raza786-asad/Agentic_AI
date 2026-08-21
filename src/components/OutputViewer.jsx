import React, { useState } from 'react';
import { Copy, Check, FileText, Sparkles } from 'lucide-react';

export default function OutputViewer({ outputText, loading }) {
  const [tab, setTab] = useState('formatted');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const renderSimpleMarkdown = (md) => {
    if (!md) return '';
    let html = md;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Blockquotes
    html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Code blocks
    html = html.replace(/```([a-z]*)\n([\s\S]*?)```/gim, (match, lang, code) => {
      const safeCode = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return `<pre><code class="language-${lang}">${safeCode.trim()}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold & italic
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Tables
    html = html.replace(/^\|(.+)\|$/gim, (match, content) => {
      const cells = content.split('|').map(c => c.trim());
      if (cells.some(c => c.includes('---'))) return '';
      return `<tr>${cells.map(c => `<td>${c}</td>`).join('')}</tr>`;
    });
    html = html.replace(/(<tr>[\s\S]*?<\/tr>)/gim, '<table>$1</table>');
    html = html.replace(/<\/table>\s*<table>/gim, '');

    // Lists
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
    html = html.replace(/<\/ul>\s*<ul>/gim, '');

    // Paragraph breaks
    html = html.replace(/\n\n/g, '<br><br>');

    return html;
  };

  return (
    <div className="card output-card">
      <div className="output-header">
        <div className="output-tabs">
          <button
            className={`tab-btn ${tab === 'formatted' ? 'active' : ''}`}
            onClick={() => setTab('formatted')}
          >
            <Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} />
            Formatted View
          </button>
          <button
            className={`tab-btn ${tab === 'raw' ? 'active' : ''}`}
            onClick={() => setTab('raw')}
          >
            <FileText size={14} style={{ display: 'inline', marginRight: '4px' }} />
            Raw Markdown
          </button>
        </div>

        {outputText && (
          <button className="btn-secondary" onClick={handleCopy}>
            {copied ? (
              <>
                <Check size={14} /> <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} /> <span>Copy Output</span>
              </>
            )}
          </button>
        )}
      </div>

      {loading ? (
        <div className="output-content">
          <div className="empty-state">
            <div className="spinner" style={{ width: '36px', height: '36px', borderWidth: '4px' }}></div>
            <h4>Agent Working</h4>
            <p>Executing step-by-step reasoning pipeline...</p>
          </div>
        </div>
      ) : !outputText ? (
        <div className="output-content">
          <div className="empty-state">
            <div className="empty-icon">💡</div>
            <h4>Workspace Ready</h4>
            <p>Select an agent on the left, enter a prompt, or choose a hackathon preset to run your first React agent workflow.</p>
          </div>
        </div>
      ) : tab === 'formatted' ? (
        <div
          className="output-content"
          dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(outputText) }}
        />
      ) : (
        <div className="output-content">
          <pre>
            <code>{outputText}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
