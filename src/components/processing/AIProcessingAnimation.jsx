import React, { useState, useEffect } from 'react';
import './AIProcessingAnimation.css';

const DEFAULT_MESSAGES = [
  'Understanding your question...',
  'Finding relevant information...',
  'Checking available sources...',
  'Preparing citations...',
  'Organizing the response...',
  'Generating your answer...'
];

/**
 * AIProcessingAnimation Component
 * 
 * Features:
 * - Central / right-side circular AI ring animation
 * - Strict adherence to website's existing blue design token (--accent-blue / #3B82F6)
 * - Dynamic configurable processing message cycling
 * - Accessibility: reduced-motion support
 * - Pure presentation component (no RAG/API logic)
 */
export default function AIProcessingAnimation({
  visible = true,
  messages = DEFAULT_MESSAGES,
  primaryColor = 'var(--accent-blue)',
  cycleIntervalMs = 1800
}) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if (!visible || !messages.length) return;

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, cycleIntervalMs);

    return () => clearInterval(interval);
  }, [visible, messages.length, cycleIntervalMs]);

  if (!visible) return null;

  return (
    <div 
      className="ai-processing-container"
      role="status" 
      aria-live="polite"
      aria-label="AI Assistant is processing your request"
    >
      <div className="processing-content-layout">
        {/* Left / Text Side */}
        <div className="processing-text-column">
          <div className="processing-badge">
            <span className="processing-dot"></span>
            <span>AI Processing</span>
          </div>

          <div className="processing-message-carousel">
            <p className="processing-active-message" key={currentMessageIndex}>
              {messages[currentMessageIndex] || messages[0]}
            </p>
          </div>

          <span className="processing-hint">
            Evaluating knowledge index and preparing authoritative evidence
          </span>
        </div>

        {/* Central / Right Circular AI Animation */}
        <div 
          className="processing-visual-column"
          style={{ '--ai-primary-blue': primaryColor }}
        >
          <div className="ai-circular-rig">
            {/* Outer Rotating Orbit Ring */}
            <div className="ai-ring outer-ring">
              <span className="orbital-node node-1"></span>
              <span className="orbital-node node-2"></span>
            </div>

            {/* Middle Counter-Rotating Ring */}
            <div className="ai-ring middle-ring">
              <span className="orbital-node node-3"></span>
            </div>

            {/* Inner Glowing Pulsing Core */}
            <div className="ai-core-pulse">
              <div className="core-inner-glow"></div>
            </div>

            {/* Subtle Radiating Wave */}
            <div className="ai-radiance-aura"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
