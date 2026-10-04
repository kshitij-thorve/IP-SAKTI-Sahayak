import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Copy, 
  Check, 
  RotateCcw, 
  BookOpen, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import CitationCard from './CitationCard';
import { UI_TRANSLATIONS } from '../../constants/languages';
import './MessageItem.css';

/**
 * Lightweight, clean Markdown renderer for AI chat output.
 * Renders bold, italics, headers, lists, and linebreaks cleanly without heavy external packages.
 */
function FormattedText({ content }) {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <div className="formatted-prose">
      {lines.map((line, lineIdx) => {
        // Headers ###
        if (line.startsWith('### ')) {
          return <h4 key={lineIdx} className="prose-h4">{renderInline(line.slice(4))}</h4>;
        }
        if (line.startsWith('## ')) {
          return <h3 key={lineIdx} className="prose-h3">{renderInline(line.slice(3))}</h3>;
        }
        if (line.startsWith('# ')) {
          return <h2 key={lineIdx} className="prose-h2">{renderInline(line.slice(2))}</h2>;
        }

        // Bullet items
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          return (
            <div key={lineIdx} className="prose-bullet">
              <span className="bullet-dot">•</span>
              <span>{renderInline(line.trim().slice(2))}</span>
            </div>
          );
        }

        // Numbered items: 1. 2. etc.
        const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={lineIdx} className="prose-numbered">
              <span className="num-badge">{numMatch[1]}.</span>
              <span>{renderInline(numMatch[2])}</span>
            </div>
          );
        }

        // Empty lines
        if (!line.trim()) {
          return <div key={lineIdx} className="prose-spacer"></div>;
        }

        // Standard paragraph
        return <p key={lineIdx} className="prose-p">{renderInline(line)}</p>;
      })}
    </div>
  );
}

/**
 * Helper to parse bold **text**, code `text`, and italic *text*
 */
function renderInline(text) {
  // Simple token parser
  const parts = [];
  let remaining = text;
  let keyCounter = 0;

  while (remaining.length > 0) {
    // Bold **text**
    const boldMatch = remaining.match(/^(.*?)\*\*(.*?)\*\*(.*)/s);
    // Code `text`
    const codeMatch = remaining.match(/^(.*?)`(.*?)`(.*)/s);

    if (boldMatch && (!codeMatch || boldMatch[1].length <= codeMatch[1].length)) {
      if (boldMatch[1]) parts.push(<span key={keyCounter++}>{boldMatch[1]}</span>);
      parts.push(<strong key={keyCounter++}>{boldMatch[2]}</strong>);
      remaining = boldMatch[3];
    } else if (codeMatch) {
      if (codeMatch[1]) parts.push(<span key={keyCounter++}>{codeMatch[1]}</span>);
      parts.push(<code key={keyCounter++} className="inline-code">{codeMatch[2]}</code>);
      remaining = codeMatch[3];
    } else {
      parts.push(<span key={keyCounter++}>{remaining}</span>);
      break;
    }
  }

  return parts;
}

export default function MessageItem({
  message,
  language,
  onPreviewSource,
  onRetry
}) {
  const [copied, setCopied] = useState(false);
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const isUser = message.role === 'user';

  const handleCopy = () => {
    if (!message.content) return;
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div className="chat-message-row user-row">
        <div className="message-bubble user-bubble">
          <p className="user-message-text">{message.content}</p>
          <div className="message-meta-footer">
            <span className="timestamp">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        <div className="user-avatar-wrap">
          <User size={18} />
        </div>
      </div>
    );
  }

  // Assistant Message
  const hasSources = message.sources && message.sources.length > 0;

  return (
    <div className="chat-message-row assistant-row">
      <div className="assistant-avatar-wrap">
        <ShieldCheck size={20} className="assistant-icon" />
      </div>

      <div className="message-content-wrapper">
        <div className="assistant-header-bar">
          <div className="assistant-info-pill">
            <Sparkles size={13} className="engine-sparkle" />
            <span className="assistant-name">IP-SAKTI Knowledge Engine</span>
            {message.language && (
              <span className="response-lang-badge">{message.language.toUpperCase()}</span>
            )}
          </div>

          <div className="assistant-top-actions">
            <button 
              className="action-icon-btn" 
              onClick={handleCopy}
              title="Copy answer to clipboard"
            >
              {copied ? <Check size={14} className="copied-icon" /> : <Copy size={14} />}
              <span className="btn-label">{copied ? t.copied : t.copyAnswer}</span>
            </button>
            {onRetry && (
              <button 
                className="action-icon-btn"
                onClick={() => onRetry(message)}
                title="Regenerate this response"
              >
                <RotateCcw size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Formatted Answer Body */}
        <div className="assistant-answer-body">
          <FormattedText content={message.content} />
          {message.isStreaming && <span className="streaming-cursor"></span>}
        </div>

        {/* Source / Citation Section */}
        {hasSources ? (
          <div className="citations-container">
            <div className="citations-header">
              <BookOpen size={14} className="citations-header-icon" />
              <span>{t.sourcesHeading}</span>
              <span className="sources-count">({message.sources.length} Verified Sources)</span>
            </div>

            <div className="citations-grid">
              {message.sources.map((src, idx) => (
                <CitationCard
                  key={src.id || idx}
                  source={src}
                  index={idx + 1}
                  onPreview={onPreviewSource}
                />
              ))}
            </div>
          </div>
        ) : (
          !message.isStreaming && (
            <div className="no-sources-card">
              <div className="no-sources-header">
                <AlertCircle size={15} className="no-sources-icon" />
                <span>{t.noSourcesTitle}</span>
              </div>
              <p className="no-sources-text">{t.noSourcesDesc}</p>
            </div>
          )
        )}

        {/* Prototype Legal Disclaimer Notice */}
        <div className="prototype-legal-footer">
          <span>* Research Prototype Notice: Answers are generated from development artifacts for evaluation. Always cross-check with official gazettes at ipindia.gov.in.</span>
        </div>
      </div>
    </div>
  );
}
