import React from 'react';
import { BookOpen, ExternalLink, Percent } from 'lucide-react';
import DevelopmentBadge from '../common/DevelopmentBadge';
import './SourceCard.css';

export default function SourceCard({ citation, index, onPreview }) {
  const isSample = Boolean(citation.is_sample_document);
  const hasUrl = Boolean(citation.source_url && citation.source_url.trim() && citation.source_url !== '#');

  const formattedScore = typeof citation.relevance_score === 'number'
    ? `${Math.round(citation.relevance_score <= 1 ? citation.relevance_score * 100 : citation.relevance_score)}% Match`
    : null;

  return (
    <div className={`source-evidence-card ${isSample ? 'is-dev-sample' : ''}`}>
      <div className="source-card-header">
        <div className="source-index-tag">
          <BookOpen size={12} />
          <span>[{index}]</span>
        </div>

        <div className="source-header-titles">
          <h4 className="source-doc-title" title={citation.document_title}>
            {citation.document_title}
          </h4>
          {isSample && <DevelopmentBadge variant="sample" />}
        </div>
      </div>

      <div className="source-metadata-chips">
        <span className="source-chip page-chip">
          <strong>Page:</strong> {citation.page_number}
        </span>
        <span className="source-chip section-chip" title={citation.section}>
          <strong>Section:</strong> {citation.section}
        </span>
        {formattedScore && (
          <span className="source-chip score-chip" title="Vector retrieval relevance score">
            <Percent size={10} />
            <span>{formattedScore}</span>
          </span>
        )}
      </div>

      {citation.snippet && (
        <p className="source-snippet-box" onClick={() => onPreview?.(citation)}>
          "{citation.snippet}"
        </p>
      )}

      <div className="source-card-actions">
        <button 
          className="btn-view-evidence"
          onClick={() => onPreview?.(citation)}
        >
          View Evidence Details
        </button>

        {hasUrl ? (
          <a
            href={citation.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-official-source"
            title="Open official document portal in new tab"
          >
            <span>Open Source</span>
            <ExternalLink size={12} />
          </a>
        ) : (
          <span className="no-url-indicator" title="Document is indexed internally in research repository; no external public URL exists">
            Internal Research Index
          </span>
        )}
      </div>
    </div>
  );
}
