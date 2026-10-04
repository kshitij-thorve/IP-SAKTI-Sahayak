import React from 'react';
import { AlertTriangle, RotateCcw, Wrench } from 'lucide-react';
import './ErrorBanner.css';

export default function ErrorBanner({ error, onRetry, onSwitchToMock }) {
  if (!error) return null;

  return (
    <div className="error-banner-container">
      <div className="error-icon-column">
        <AlertTriangle size={20} className="error-sign" />
      </div>

      <div className="error-content-column">
        <h4 className="error-heading">RAG Pipeline Service Error</h4>
        <p className="error-message-text">{error.message || 'An unexpected error occurred while communicating with the retrieval pipeline.'}</p>

        <div className="error-action-row">
          {onRetry && (
            <button className="error-action-btn retry" onClick={onRetry}>
              <RotateCcw size={13} />
              <span>Retry Request</span>
            </button>
          )}

          {onSwitchToMock && (
            <button className="error-action-btn mock-switch" onClick={onSwitchToMock}>
              <Wrench size={13} />
              <span>Switch to Prototype Mock Mode</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
