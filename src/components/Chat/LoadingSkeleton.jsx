import React from 'react';
import { ShieldCheck, Database } from 'lucide-react';
import './LoadingSkeleton.css';

export default function LoadingSkeleton({ language }) {
  const loadingLabel = language === 'mr'
    ? 'अधिकृत पेटंट गॅझेट आणि कायदेशीर कलमांमधून माहिती शोधत आहे...'
    : language === 'hi'
    ? 'आधिकारिक पेटेंट गजट एवं वैधानिक संहिताओं में खोज जारी है...'
    : 'Searching authoritative IP gazettes, statutory acts, and BIS manuals...';

  return (
    <div className="skeleton-message-row">
      <div className="skeleton-avatar">
        <ShieldCheck size={20} className="pulse-icon" />
      </div>

      <div className="skeleton-content-box">
        <div className="skeleton-status-bar">
          <Database size={13} className="db-spin-icon" />
          <span className="skeleton-status-text">{loadingLabel}</span>
        </div>

        <div className="skeleton-lines">
          <div className="shimmer-line line-75"></div>
          <div className="shimmer-line line-100"></div>
          <div className="shimmer-line line-90"></div>
          <div className="shimmer-line line-60"></div>
        </div>

        <div className="skeleton-sources-preview">
          <div className="shimmer-card"></div>
          <div className="shimmer-card"></div>
        </div>
      </div>
    </div>
  );
}
