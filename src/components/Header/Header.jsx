import React from 'react';
import { 
  ShieldCheck, 
  Globe, 
  Check, 
  ChevronDown, 
  Terminal, 
  Menu, 
  X,
  User,
  LogIn,
  LogOut,
  BadgeCheck
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, UI_TRANSLATIONS } from '../../constants/languages';
import './Header.css';

export default function Header({
  language,
  setLanguage,
  onOpenDevSettings,
  isMockMode,
  sidebarOpen,
  setSidebarOpen,
  currentUser,
  onOpenLogin,
  onLogout
}) {
  const [langDropdownOpen, setLangDropdownOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const langDropdownRef = React.useRef(null);
  const userDropdownRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="app-header">
      <div className="header-left">
        <button 
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-label="Toggle Sidebar"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="brand-container">
          <div className="brand-logo-badge">
            <ShieldCheck className="brand-icon" size={24} />
            <span className="brand-sub-badge">IP</span>
          </div>
          <div className="brand-text">
            <div className="brand-title-row">
              <h1 className="brand-title">IP-SAKTI Sahayak</h1>
              <span className="dev-status-pill">{t.devBadge}</span>
            </div>
            <p className="brand-subtitle">{t.appSubtitle}</p>
          </div>
        </div>
      </div>

      <div className="header-right">
        {/* Language Selector Dropdown */}
        <div className="language-selector-wrapper" ref={langDropdownRef}>
          <button 
            type="button"
            className="lang-trigger-btn"
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            aria-expanded={langDropdownOpen}
            aria-label="Select application language"
          >
            <Globe size={16} className="lang-icon" />
            <span className="lang-flag">{currentLang.flag}</span>
            <span className="lang-name">{currentLang.nativeName}</span>
            <ChevronDown size={14} className={`chevron-icon ${langDropdownOpen ? 'rotated' : ''}`} />
          </button>

          {langDropdownOpen && (
            <div className="lang-dropdown-menu">
              <div className="lang-menu-header">Select Language / भाषा निवडा</div>
              {SUPPORTED_LANGUAGES.map((langItem) => (
                <button
                  key={langItem.code}
                  type="button"
                  className={`lang-option-btn ${langItem.code === language ? 'active' : ''}`}
                  onClick={() => {
                    setLanguage(langItem.code);
                    setLangDropdownOpen(false);
                  }}
                >
                  <span className="lang-flag">{langItem.flag}</span>
                  <div className="lang-details">
                    <span className="lang-native">{langItem.nativeName}</span>
                    <span className="lang-english">{langItem.name}</span>
                  </div>
                  {langItem.code === language && <Check size={14} className="check-icon" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Backend & RAG Status Indicator / Dev Modal Trigger */}
        <button 
          type="button"
          className={`dev-settings-trigger ${isMockMode ? 'mock-active' : 'live-active'}`}
          onClick={onOpenDevSettings}
          title="Configure Backend API & RAG Simulator Settings"
        >
          <Terminal size={14} />
          <span className="mode-label">
            {isMockMode ? 'Mock RAG' : 'Live API'}
          </span>
          <span className="status-dot"></span>
        </button>

        {/* User Account / Sign In Widget */}
        {currentUser ? (
          <div className="user-menu-wrapper" ref={userDropdownRef}>
            <button
              type="button"
              className="user-profile-btn"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              title={currentUser.name || 'Account'}
              aria-label="User Account Menu"
            >
              <div className="user-avatar-circle">
                <User size={14} />
              </div>
              <span className="user-header-name">
                {currentUser.name ? currentUser.name.split(' ')[0] : 'Evaluator'}
              </span>
              <ChevronDown size={12} className={`chevron-icon ${userDropdownOpen ? 'rotated' : ''}`} />
            </button>

            {userDropdownOpen && (
              <div className="user-dropdown-menu">
                <div className="user-dropdown-header">
                  <div className="user-dropdown-name">{currentUser.name || 'Evaluator'}</div>
                  <div className="user-dropdown-email">{currentUser.email || currentUser.identifier || 'Active Session'}</div>
                  {currentUser.isGuest ? (
                    <span className="user-role-badge guest">Guest Evaluator</span>
                  ) : (
                    <span className="user-role-badge verified">
                      <BadgeCheck size={11} />
                      <span>{currentUser.role || 'Authorized User'}</span>
                    </span>
                  )}
                </div>

                <div className="user-dropdown-divider"></div>

                <button
                  type="button"
                  className="user-menu-action logout"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    onLogout?.();
                  }}
                >
                  <LogOut size={14} />
                  <span>Sign Out / Switch</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            className="btn-header-login"
            onClick={onOpenLogin}
            title="Sign In to IP-SAKTI Sahayak"
          >
            <LogIn size={15} />
            <span className="login-btn-text">Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
