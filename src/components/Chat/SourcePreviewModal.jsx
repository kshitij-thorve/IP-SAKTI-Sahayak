import React from 'react';
import { X, ExternalLink, BookOpen, AlertTriangle } from 'lucide-react';
import './SourcePreviewModal.css';

export default function SourcePreviewModal({ source, onClose }) {
  if (!source) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="source-preview-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-badge">
            <BookOpen size={16} />
            <span>Citation Source [{source.index || 1}]</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-warning-box">
            <AlertTriangle size={16} className="warning-icon" />
            <div className="warning-content">
              <strong>Development / Prototype Knowledge Artifact</strong>
              <p>This citation is simulated from draft indexing records for UI demonstration. The official research team corpus will replace this in the final production release.</p>
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Document Title</label>
            <h3 className="source-title-display">{source.title}</h3>
          </div>

          <div className="field-row">
            <div className="field-group half">
              <label className="field-label">Page Number</label>
              <div className="field-value highlight">{source.page}</div>
            </div>
            <div className="field-group half">
              <label className="field-label">Statutory Section / Clause</label>
              <div className="field-value highlight">{source.section}</div>
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Retrieved Excerpt</label>
            <div className="excerpt-display">
              "{source.excerpt || 'Excerpt text is pending full optical document ingestion and semantic chunking by the RAG research team.'}"
            </div>
          </div>

          {source.url && source.url !== '#' && (
            <div className="field-group">
              <label className="field-label">Official Verification Portal</label>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="full-portal-link"
              >
                <span>{source.url}</span>
                <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <span className="metadata-tag">RAG Vector Retrieval Confidence: 0.92</span>
          <button className="btn-close-modal" onClick={onClose}>
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
