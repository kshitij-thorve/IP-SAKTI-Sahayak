import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Copy, 
  Check, 
  RotateCcw, 
  Sparkles
} from 'lucide-react';
import SourcesPanel from '../sources/SourcesPanel';
import DevelopmentBadge from '../common/DevelopmentBadge';
import './ChatMessage.css';

/**
 * Lightweight, accessible formatted text renderer for AI responses
 */
function MarkdownBody({ content }) {
  if (!content) return null;
  const lines = content.split('\n');

  return (
    <div className="prose-container">
      {lines.map((line, idx) => {
        if (line.startsWith('### ')) {
          return <h4 key={idx} className="prose-h4">{renderSpans(line.slice(4))}</h4>;
        }
        if (line.startsWith('## ')) {
          return <h3 key={idx} className="prose-h3">{renderSpans(line.slice(3))}</h3>;
        }
        if (line.startsWith('# ')) {
          return <h2 key={idx} className="prose-h2">{renderSpans(line.slice(2))}</h2>;
        }
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          return (
            <div key={idx} className="prose-bullet-row">
              <span className="bullet-point">•</span>
              <span>{renderSpans(line.trim().slice(2))}</span>
            </div>
          );
        }
        const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="prose-number-row">
              <span className="number-point">{numMatch[1]}.</span>
              <span>{renderSpans(numMatch[2])}</span>
            </div>
          );
        }
        if (!line.trim()) {
          return <div key={idx} className="prose-gap"></div>;
        }
        return <p key={idx} className="prose-paragraph">{renderSpans(line)}</p>;
      })}
    </div>
  );
}

function renderSpans(text) {
  const chunks = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/^(.*?)\*\*(.*?)\*\*(.*)/s);
    const codeMatch = remaining.match(/^(.*?)`(.*?)`(.*)/s);

    if (boldMatch && (!codeMatch || boldMatch[1].length <= codeMatch[1].length)) {
      if (boldMatch[1]) chunks.push(<span key={key++}>{boldMatch[1]}</span>);
      chunks.push(<strong key={key++}>{boldMatch[2]}</strong>);
      remaining = boldMatch[3];
    } else if (codeMatch) {
      if (codeMatch[1]) chunks.push(<span key={key++}>{codeMatch[1]}</span>);
      chunks.push(<code key={key++} className="inline-code-pill">{codeMatch[2]}</code>);
      remaining = codeMatch[3];
    } else {
      chunks.push(<span key={key++}>{remaining}</span>);
      break;
    }
  }
  return chunks;
}

export default function ChatMessage({
  message,
  onPreviewCitation,
  onRetry
}) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    if (!message.content) return;
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- 1. USER QUESTION ---
  if (isUser) {
    return (
      <div className="message-wrapper user-wrapper">
        <div className="user-card-bubble">
          <div className="user-badge-header">User Question</div>
          <p className="user-text-content">{message.content}</p>
          <span className="message-timestamp">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="user-icon-avatar">
          <User size={18} />
        </div>
      </div>
    );
  }

  // --- 2. AI ASSISTANT ANSWER & EVIDENCE ---
  return (
    <div className="message-wrapper assistant-wrapper">
      <div className="assistant-avatar-badge">
        <ShieldCheck size={20} className="assistant-emblem" />
      </div>

      <div className="assistant-card-container">
        {/* Assistant Header Bar */}
        <div className="assistant-top-bar">
          <div className="assistant-branding">
            <Sparkles size={13} className="engine-spark" />
            <span className="engine-title">IP-SAKTI Knowledge Assistant</span>
            <DevelopmentBadge variant="sample" label="Prototype Response" />
          </div>

          <div className="assistant-actions">
            <button 
              className="btn-copy-response" 
              onClick={handleCopy}
              title="Copy answer to clipboard"
            >
              {copied ? <Check size={13} className="copied-green" /> : <Copy size={13} />}
              <span>{copied ? 'Copied!' : 'Copy Answer'}</span>
            </button>

            {onRetry && (
              <button 
                className="btn-retry-icon" 
                onClick={onRetry} 
                title="Regenerate this response"
              >
                <RotateCcw size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Answer Content */}
        <div className="assistant-body-content">
          <MarkdownBody content={message.content} />
        </div>

        {/* Evidence / Sources Section */}
        <SourcesPanel
          citations={message.citations}
          grounded={message.grounded}
          onPreview={onPreviewCitation}
        />

        {/* Prototype Legal Disclaimer Notice */}
        <div className="assistant-disclaimer-note">
          * Prototype Evaluation Note: Answers are generated from development artifacts for interface testing. Always cross-check with official gazettes at ipindia.gov.in.
        </div>
      </div>
    </div>
  );
}
