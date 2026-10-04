import React from 'react';
import { ShieldAlert, Beaker } from 'lucide-react';
import './DevelopmentBadge.css';

/**
 * DevelopmentBadge Component
 * 
 * Used for:
 * - 'mode': Global "Development Mode" indicator in Header / Welcome UI
 * - 'sample': "Development Sample" badge on test citation cards
 */
export default function DevelopmentBadge({ 
  variant = 'mode', // 'mode' | 'sample'
  label = null,
  showIcon = true 
}) {
  if (variant === 'sample') {
    return (
      <span className="dev-badge-sample" title="Synthetic test document created for prototype demonstration. Not official regulatory record.">
        {showIcon && <Beaker size={11} />}
        <span>{label || 'Development Sample'}</span>
      </span>
    );
  }

  return (
    <div className="dev-mode-indicator" title="Application is in prototype development phase. Knowledge base documents are currently being curated.">
      <span className="dev-mode-pulse"></span>
      {showIcon && <ShieldAlert size={12} className="dev-mode-icon" />}
      <span className="dev-mode-text">{label || 'Development Mode'}</span>
    </div>
  );
}
