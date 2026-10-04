import React from 'react';
import { 
  PlusCircle, 
  MessageSquare, 
  Trash2, 
  FileBadge, 
  ShieldCheck, 
  FileText, 
  Layers, 
  MapPin, 
  Gamepad2, 
  Flower2, 
  Globe2, 
  Settings,
  Shield,
  UploadCloud,
  X
} from 'lucide-react';
import './Sidebar.css';

// The 8 official requested categories
const SIDEBAR_CATEGORIES = [
  { id: 'patents', label: 'Patents', icon: FileBadge, color: '#3B82F6' },
  { id: 'trademarks', label: 'Trademarks', icon: ShieldCheck, color: '#8B5CF6' },
  { id: 'copyright', label: 'Copyright', icon: FileText, color: '#EC4899' },
  { id: 'designs', label: 'Designs', icon: Layers, color: '#F59E0B' },
  { id: 'gi', label: 'GI', icon: MapPin, color: '#10B981' },
  { id: 'bis_toys', label: 'BIS / Toys', icon: Gamepad2, color: '#06B6D4' },
  { id: 'ayush', label: 'Ayush', icon: Flower2, color: '#84CC16' },
  { id: 'international_ip', label: 'International IP', icon: Globe2, color: '#6366F1' }
];

export default function Sidebar({
  isOpen,
  onClose,
  sessions = [],
  activeSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  selectedCategory,
  onSelectCategory,
  onOpenDocuments,
  onOpenSettings
}) {
  // Mobile helper: close drawer on small screens after clicking an action
  const handleMobileNav = (callback) => {
    callback?.();
    if (window.innerWidth <= 768) {
      onClose?.();
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div 
          className="sidebar-mobile-backdrop" 
          onClick={onClose} 
          aria-label="Close navigation drawer"
        />
      )}

      <aside className={`sidebar-container ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-inner">
          {/* Brand & Mobile Close in Sidebar */}
          <div className="sidebar-brand-box">
            <div className="sidebar-brand-left">
              <div className="sidebar-brand-logo">
                <Shield size={18} className="shield-icon" />
              </div>
              <div className="sidebar-brand-title">
                <h3>IP-SAKTI</h3>
                <span>Sahayak Assistant</span>
              </div>
            </div>

            <button 
              type="button" 
              className="sidebar-mobile-close-btn" 
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>

          {/* New Chat Primary Action */}
          <div className="sidebar-action-section">
            <button 
              type="button" 
              className="new-chat-btn" 
              onClick={() => handleMobileNav(onNewChat)}
            >
              <PlusCircle size={18} />
              <span>New Chat</span>
            </button>
          </div>

          {/* Scrollable Center Content */}
          <div className="sidebar-scrollable">
            {/* Chat History Section */}
            <div className="sidebar-group">
              <div className="sidebar-group-header">
                <MessageSquare size={14} />
                <span>Chat History</span>
                {sessions.length > 0 && <span className="history-count">{sessions.length}</span>}
              </div>

              <div className="history-list">
                {sessions.length === 0 ? (
                  <div className="empty-history-note">
                    No previous sessions recorded.
                  </div>
                ) : (
                  sessions.map((session) => (
                    <div
                      key={session.id}
                      className={`history-item ${session.id === activeSessionId ? 'active' : ''}`}
                      onClick={() => handleMobileNav(() => onSelectSession(session.id))}
                    >
                      <MessageSquare size={14} className="history-icon" />
                      <span className="history-title" title={session.title}>
                        {session.title}
                      </span>
                      <button
                        type="button"
                        className="delete-history-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(session.id);
                        }}
                        title="Delete session"
                        aria-label={`Delete session ${session.title}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Categories Section (The 8 requested categories) */}
            <div className="sidebar-group">
              <div className="sidebar-group-header">
                <span>Categories</span>
              </div>

              <div className="categories-list">
                {SIDEBAR_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      className={`category-item-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleMobileNav(() => onSelectCategory(isSelected ? null : cat.id))}
                    >
                      <div className="cat-icon-wrap" style={{ color: cat.color }}>
                        <Icon size={15} />
                      </div>
                      <span className="cat-name">{cat.label}</span>
                      {isSelected && <span className="cat-active-dot"></span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Lower Navigation: Documents & Settings */}
          <div className="sidebar-bottom-nav">
            <button 
              type="button" 
              className="bottom-nav-item" 
              onClick={() => handleMobileNav(onOpenDocuments)}
            >
              <UploadCloud size={16} className="nav-icon" />
              <div className="nav-text">
                <span className="nav-title">Documents</span>
                <span className="nav-subtitle">Corpus Status</span>
              </div>
            </button>

            <button 
              type="button" 
              className="bottom-nav-item" 
              onClick={() => handleMobileNav(onOpenSettings)}
            >
              <Settings size={16} className="nav-icon" />
              <div className="nav-text">
                <span className="nav-title">Settings</span>
                <span className="nav-subtitle">Backend & Mock Mode</span>
              </div>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
