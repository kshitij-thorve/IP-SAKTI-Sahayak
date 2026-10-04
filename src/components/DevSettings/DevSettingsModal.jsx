import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  Save, 
  RotateCcw, 
  CheckCircle,
  Smartphone
} from 'lucide-react';
import { 
  isMockApiEnabled, 
  setMockApiEnabled, 
  getApiBaseUrl, 
  setApiBaseUrl, 
  resetApiBaseUrl 
} from '../../api/client';
import './DevSettingsModal.css';

export default function DevSettingsModal({ isOpen, onClose, onSettingsUpdated }) {
  const [useMock, setUseMock] = useState(() => isMockApiEnabled());
  const [backendUrl, setBackendUrl] = useState(() => getApiBaseUrl());
  const [simulateError, setSimulateError] = useState(() => {
    try {
      return localStorage.getItem('ipsakti_sim_error') === 'true';
    } catch {
      return false;
    }
  });
  const [simulateUngrounded, setSimulateUngrounded] = useState(() => {
    try {
      return localStorage.getItem('ipsakti_sim_ungrounded') === 'true';
    } catch {
      return false;
    }
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Return early after hooks are defined
  if (!isOpen) return null;

  const handleSave = () => {
    setMockApiEnabled(useMock);
    setApiBaseUrl(backendUrl);

    try {
      localStorage.setItem('ipsakti_sim_error', simulateError ? 'true' : 'false');
      localStorage.setItem('ipsakti_sim_ungrounded', simulateUngrounded ? 'true' : 'false');
    } catch {
      // Ignore
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
    onSettingsUpdated?.({ useMock, backendUrl });
  };

  const handleReset = () => {
    setUseMock(false); // Default is live backend per specification
    setMockApiEnabled(false);
    resetApiBaseUrl();
    setBackendUrl(getApiBaseUrl());
    setSimulateError(false);
    setSimulateUngrounded(false);

    try {
      localStorage.removeItem('ipsakti_sim_error');
      localStorage.removeItem('ipsakti_sim_ungrounded');
    } catch {
      // Ignore
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="dev-modal-card" onClick={e => e.stopPropagation()}>
        <div className="dev-modal-header">
          <div className="dev-header-title">
            <Terminal size={18} className="terminal-icon" />
            <h3>RAG API Architecture & Prototype Settings</h3>
          </div>
          <button className="dev-modal-close" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <div className="dev-modal-body">
          {/* Target Architecture Flow */}
          <div className="arch-flow-box">
            <span className="arch-label">Target Integration Pipeline:</span>
            <div className="arch-steps">
              <span className="step-pill frontend">Frontend / Android</span>
              <span className="arrow-sep">→</span>
              <span className="step-pill backend">FastAPI Backend</span>
              <span className="arrow-sep">→</span>
              <span className="step-pill rag">RAG Service</span>
              <span className="arrow-sep">→</span>
              <span className="step-pill vector">NVIDIA RAG</span>
            </div>
            <p className="arch-note">
              Frontend is strictly decoupled: No Supabase keys, Milvus credentials, or NVIDIA API keys in frontend.
            </p>
          </div>

          {/* Mode Selector */}
          <div className="setting-section">
            <label className="section-title">Active API Mode</label>
            <div className="mode-toggle-group">
              <button
                type="button"
                className={`mode-select-btn ${!useMock ? 'selected' : ''}`}
                onClick={() => setUseMock(false)}
              >
                <div className="mode-btn-content">
                  <strong className="mode-name">Live Backend API (Default)</strong>
                  <span className="mode-hint">Dispatches live POST /api/chat requests to your FastAPI backend</span>
                </div>
              </button>

              <button
                type="button"
                className={`mode-select-btn ${useMock ? 'selected' : ''}`}
                onClick={() => setUseMock(true)}
              >
                <div className="mode-btn-content">
                  <strong className="mode-name">Mock API Mode (Development Only)</strong>
                  <span className="mode-hint">Uses prototype responses with sample citations across IP domains</span>
                </div>
              </button>
            </div>
          </div>

          {/* Backend Base URL */}
          <div className="setting-section">
            <label className="section-title">Backend Gateway URL</label>
            <input
              type="text"
              className="text-setting-input"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              placeholder="http://localhost:8000/api"
            />
            <span className="field-hint">
              Local Web: <code>http://localhost:8000/api</code> | Android Device: <code>http://&lt;LAPTOP_IP&gt;:8000/api</code>
            </span>
          </div>

          {/* Android Local Testing Helper */}
          <div className="setting-section android-helper-box">
            <div className="android-box-header">
              <Smartphone size={15} className="smartphone-icon" />
              <strong>Android Physical Device Testing</strong>
            </div>
            <p className="android-box-desc">
              When testing on an Android phone over Wi-Fi, <code>localhost</code> points to the phone itself.
              Set the URL above to your laptop's local IPv4 (e.g. <code>http://192.168.1.15:8000/api</code>)
              and ensure FastAPI binds to <code>0.0.0.0</code>.
            </p>
          </div>

          {/* Prototype Edge Case Simulators */}
          <div className="setting-section">
            <label className="section-title">Edge Case Simulators (Prototype Testing)</label>
            <div className="toggles-grid">
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={simulateUngrounded}
                  onChange={(e) => setSimulateUngrounded(e.target.checked)}
                />
                <span className="check-label">
                  <strong>Simulate Insufficient Context (grounded = false)</strong>
                  <small>Tests "Insufficient source context" state display</small>
                </span>
              </label>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={simulateError}
                  onChange={(e) => setSimulateError(e.target.checked)}
                />
                <span className="check-label">
                  <strong>Simulate Network Error / Gateway Timeout</strong>
                  <small>Tests error banner and retry behavior</small>
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="dev-modal-footer">
          <button type="button" className="btn-secondary" onClick={handleReset}>
            <RotateCcw size={14} />
            <span>Reset Defaults</span>
          </button>

          <button type="button" className="btn-primary" onClick={handleSave}>
            {savedSuccess ? <CheckCircle size={15} /> : <Save size={15} />}
            <span>{savedSuccess ? 'Settings Applied!' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
