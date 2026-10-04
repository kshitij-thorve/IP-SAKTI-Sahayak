import React from 'react';
import { X, UploadCloud, FileText, AlertCircle, Shield } from 'lucide-react';
import { INGESTION_NOTICE } from '../../api/documents';
import './UploadModal.css';

export default function UploadModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="upload-modal-card" onClick={e => e.stopPropagation()}>
        <div className="upload-modal-header">
          <div className="upload-header-title">
            <UploadCloud size={20} className="upload-icon" />
            <h3>Document Ingestion & Knowledge Index</h3>
          </div>
          <button className="upload-modal-close" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <div className="upload-modal-body">
          {/* Prominent Prototype Advisory Banner */}
          <div className="ingestion-alert-box">
            <AlertCircle size={20} className="alert-icon" />
            <div className="alert-content">
              <strong>Ingestion Phase Status</strong>
              <p>{INGESTION_NOTICE}</p>
            </div>
          </div>

          {/* Planned Corpus Roadmap */}
          <div className="corpus-specs-section">
            <h4 className="section-heading">Target Document Ingestion Pipeline</h4>
            <p className="section-subtext">
              The research team is actively compiling verified government publications. Once curated, documents will be ingested via the backend RAG pipeline:
            </p>

            <div className="specs-list">
              <div className="spec-item">
                <FileText size={16} className="spec-icon" />
                <div className="spec-info">
                  <strong>The Indian Patents Act 1970 & Patent Rules 2003</strong>
                  <span>Forms 1–30, Manual of Patent Office Practice (MPOPP)</span>
                </div>
                <span className="spec-badge">In Curation</span>
              </div>

              <div className="spec-item">
                <FileText size={16} className="spec-icon" />
                <div className="spec-info">
                  <strong>The Trade Marks Act 1999 & Nice Classification (11th Ed.)</strong>
                  <span>Form TM-A, examination standards & judicial precedents</span>
                </div>
                <span className="spec-badge">In Curation</span>
              </div>

              <div className="spec-item">
                <FileText size={16} className="spec-icon" />
                <div className="spec-info">
                  <strong>DPIIT Toys (Quality Control) Order & BIS Standards</strong>
                  <span>IS 9873 (Parts 1–7) & IS 15644 electrical toy compliance</span>
                </div>
                <span className="spec-badge">In Curation</span>
              </div>

              <div className="spec-item">
                <FileText size={16} className="spec-icon" />
                <div className="spec-info">
                  <strong>Ministry of Ayush & CSIR TKDL Formulations</strong>
                  <span>Traditional medicine prior-art defense database</span>
                </div>
                <span className="spec-badge">In Curation</span>
              </div>
            </div>
          </div>

          <div className="security-notice-box">
            <Shield size={16} className="shield-icon" />
            <span>Architecture Note: Documents are processed securely through backend chunking and embedding pipelines. No raw documents or vector credentials touch the client browser.</span>
          </div>
        </div>

        <div className="upload-modal-footer">
          <button className="btn-close-upload" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
