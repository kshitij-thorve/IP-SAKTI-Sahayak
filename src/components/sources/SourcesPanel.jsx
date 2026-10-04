import React from 'react';
import { BookOpen, AlertCircle, ShieldAlert } from 'lucide-react';
import SourceCard from './SourceCard';
import './SourcesPanel.css';

export default function SourcesPanel({
  citations = [],
  grounded = true,
  onPreview
}) {
  // 1. If grounded is explicitly false (Insufficient source context)
  if (!grounded) {
    return (
      <div className="sources-ungrounded-notice">
        <div className="ungrounded-header">
          <ShieldAlert size={16} className="ungrounded-icon" />
          <strong>Insufficient source context</strong>
        </div>
        <p className="ungrounded-body">
          The knowledge retrieval pipeline could not locate verified statutory or gazette evidence with high semantic grounding. The response above is synthesized as general regulatory context.
        </p>
      </div>
    );
  }

  // 2. If grounded is true but no citations returned
  if (!citations || citations.length === 0) {
    return (
      <div className="no-citations-notice">
        <AlertCircle size={14} className="no-citations-icon" />
        <span>No specific document references were returned for this query.</span>
      </div>
    );
  }

  // 3. Normal Sources list
  return (
    <div className="sources-panel-section">
      <div className="sources-heading-row">
        <div className="sources-title-group">
          <BookOpen size={14} className="sources-title-icon" />
          <h4 className="sources-heading">Sources</h4>
          <span className="sources-count-badge">({citations.length} References)</span>
        </div>
        <span className="sources-prototype-note">Development Sample Documents</span>
      </div>

      <div className="sources-grid-layout">
        {citations.map((citation, index) => (
          <SourceCard
            key={citation.citation_id || index}
            citation={citation}
            index={index + 1}
            onPreview={onPreview}
          />
        ))}
      </div>
    </div>
  );
}
