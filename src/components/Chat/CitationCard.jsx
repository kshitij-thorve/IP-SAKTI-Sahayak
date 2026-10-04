import React from 'react';
import { ExternalLink, BookOpen } from 'lucide-react';
import './CitationCard.css';

export default function CitationCard({ source, index, onPreview }) {
  const isMock = source.isMock || source.title.toLowerCase().includes('sample') || source.title.toLowerCase().includes('development');

  return (
    <div className={`citation-card ${isMock ? 'is-mock-source' : ''}`}>
      <div className="citation-top-row">
        <div className="citation-number-badge">
          <BookOpen size={12} />
          <span>[{index}]</span>
        </div>
        <div className="citation-title-wrap">
          <h4 className="citation-doc-title" title={source.title}>
            {source.title}
          </h4>
          {isMock && (
            <span className="prototype-tag">Test Artifact</span>
          )}
        </div>
      </div>

      <div className="citation-meta-row">
        <span className="meta-pill page-pill">
          <strong>Page:</strong> {source.page}
        </span>
        <span className="meta-pill section-pill" title={source.section}>
          <strong>Section:</strong> {source.section}
        </span>
      </div>

      {source.excerpt && (
        <p className="citation-excerpt" onClick={() => onPreview?.(source)}>
          "{source.excerpt}"
        </p>
      )}

      <div className="citation-actions">
        <button 
          className="preview-source-btn"
          onClick={() => onPreview?.(source)}
        >
          View Citation Details
        </button>

        {source.url && source.url !== '#' ? (
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="external-source-link"
            title="Open official document portal in new tab"
          >
            <span>Official Portal</span>
            <ExternalLink size={12} />
          </a>
        ) : (
          <span className="doc-indexing-tag">Doc in Research Index</span>
        )}
      </div>
    </div>
  );
}
