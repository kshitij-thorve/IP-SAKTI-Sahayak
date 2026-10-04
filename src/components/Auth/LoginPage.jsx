import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Globe,
  Loader2,
  ChevronLeft
} from 'lucide-react';
import { login, signup, requestPasswordReset, loginAsGuest } from '../../api/auth';
import { SUPPORTED_LANGUAGES } from '../../constants/languages';
import './LoginPage.css';

const AUTH_TEXTS = {
  en: {
    appTitle: 'IP-SAKTI Sahayak',
    appSubtitle: 'Intellectual Property Knowledge & Regulatory Assistant',
    badge: 'Civic AI • Research Prototype',
    signInTab: 'Sign In',
    signUpTab: 'Create Account',
    forgotTab: 'Reset Password',
    idLabel: 'Email Address or Mobile Number',
    idPlaceholder: 'e.g. advocate@example.com or 9876543210',
    passLabel: 'Password',
    passPlaceholder: 'Enter your password',
    rememberMe: 'Remember this device',
    forgotPass: 'Forgot password?',
    signInBtn: 'Sign In to Sahayak',
    signingIn: 'Authenticating...',
    noAccount: "Don't have an account?",
    registerNow: 'Register here',
    haveAccount: 'Already registered?',
    loginHere: 'Sign in here',
    nameLabel: 'Full Name',
    namePlaceholder: 'e.g. Adv. Rajesh Sharma',
    emailLabel: 'Email Address',
    emailPlaceholder: 'name@example.com',
    mobileLabel: '10-Digit Mobile Number',
    mobilePlaceholder: '9876543210',
    roleLabel: 'User Category',
    signUpBtn: 'Create Account',
    creatingAccount: 'Creating Account...',
    resetBtn: 'Send Password Reset Link',
    sendingReset: 'Sending Instructions...',
    backToLogin: 'Back to Sign In',
    guestSectionTitle: 'Prototype & Researcher Access',
    guestBtn: 'Continue as Research Evaluator (Guest Access)',
    guestHint: 'Instant access for evaluation without creating credentials.',
    securityNote: 'Official civic knowledge portal. Backend credentials are securely verified.',
    roles: [
      { id: 'applicant', label: 'Patent / Trademark Applicant' },
      { id: 'attorney', label: 'IP Attorney / Patent Agent' },
      { id: 'msme', label: 'MSME / Startup Founder' },
      { id: 'researcher', label: 'Academic / AYUSH Researcher' }
    ]
  },
  mr: {
    appTitle: 'आयपी-शक्ती सहायक',
    appSubtitle: 'बौद्धिक संपदा बहुभाषिक माहिती आणि नियमन सहाय्यक',
    badge: 'संशोधन प्रोटोटाइप टप्पा',
    signInTab: 'साइन इन (Login)',
    signUpTab: 'नवीन खाते तयार करा',
    forgotTab: 'पासवर्ड विसरलात?',
    idLabel: 'ईमेल किंवा १०-अंकी मोबाईल नंबर',
    idPlaceholder: 'उदा. advocate@example.com किंवा 9876543210',
    passLabel: 'पासवर्ड',
    passPlaceholder: 'आपला पासवर्ड प्रविष्ट करा',
    rememberMe: 'हे डिव्हाइस लक्षात ठेवा',
    forgotPass: 'पासवर्ड विसरलात?',
    signInBtn: 'सहायकमध्ये साइन इन करा',
    signingIn: 'प्रमाणीकरण करत आहे...',
    noAccount: 'खाते नाही का?',
    registerNow: 'येथे नोंदणी करा',
    haveAccount: 'आधीच नोंदणी केली आहे?',
    loginHere: 'येथे साइन इन करा',
    nameLabel: 'पूर्ण नाव',
    namePlaceholder: 'उदा. राजेश शर्मा',
    emailLabel: 'ईमेल पत्ता',
    emailPlaceholder: 'name@example.com',
    mobileLabel: 'मोबाईल नंबर',
    mobilePlaceholder: '9876543210',
    roleLabel: 'वापरकर्ता प्रकार',
    signUpBtn: 'खाते तयार करा',
    creatingAccount: 'खाते तयार करत आहे...',
    resetBtn: 'पासवर्ड रीसेट लिंक पाठवा',
    sendingReset: 'सूचना पाठवत आहे...',
    backToLogin: 'साइन इनकडे परत जा',
    guestSectionTitle: 'प्रोटोटाइप व संशोधक प्रवेश',
    guestBtn: 'संशोधक म्हणून थेट पुढे जा (Guest Access)',
    guestHint: 'प्रोटोटाइप तपासणीसाठी खात्याशिवाय त्वरित प्रवेश.',
    securityNote: 'अधिकृत नियामक ज्ञान व्यासपीठ. सुरक्षित प्रमाणीकरण.',
    roles: [
      { id: 'applicant', label: 'पेटंट / ट्रेडमार्क अर्जदार' },
      { id: 'attorney', label: 'आयपी वकील / पेटंट एजंट' },
      { id: 'msme', label: 'एमएसएमई / स्टार्टअप संस्थापक' },
      { id: 'researcher', label: 'संशोधक / आयुष अभ्यासक' }
    ]
  },
  hi: {
    appTitle: 'आईपी-शक्ति सहायक',
    appSubtitle: 'बौद्धिक संपदा बहुभाषी ज्ञान एवं नियामक सहायक',
    badge: 'अनुसंधान प्रोटोटाइप चरण',
    signInTab: 'साइन इन (Login)',
    signUpTab: 'नया खाता बनाएं',
    forgotTab: 'पासवर्ड भूल गए?',
    idLabel: 'ईमेल या १०-अंकीय मोबाइल नंबर',
    idPlaceholder: 'उदा. advocate@example.com या 9876543210',
    passLabel: 'पासवर्ड',
    passPlaceholder: 'अपना पासवर्ड दर्ज करें',
    rememberMe: 'यह डिवाइस याद रखें',
    forgotPass: 'पासवर्ड भूल गए?',
    signInBtn: 'सहायक में साइन इन करें',
    signingIn: 'सत्यापन हो रहा है...',
    noAccount: 'खाता नहीं है?',
    registerNow: 'यहाँ पंजीकरण करें',
    haveAccount: 'पहले से पंजीकृत हैं?',
    loginHere: 'यहाँ साइन इन करें',
    nameLabel: 'पूरा नाम',
    namePlaceholder: 'उदा. राजेश शर्मा',
    emailLabel: 'ईमेल पता',
    emailPlaceholder: 'name@example.com',
    mobileLabel: 'मोबाइल नंबर',
    mobilePlaceholder: '9876543210',
    roleLabel: 'उपयोगकर्ता वर्ग',
    signUpBtn: 'खाता बनाएं',
    creatingAccount: 'खाता बनाया जा रहा है...',
    resetBtn: 'पासवर्ड रीसेट लिंक भेजें',
    sendingReset: 'निर्देश भेजे जा रहे हैं...',
    backToLogin: 'साइन इन पर वापस जाएं',
    guestSectionTitle: 'प्रोटोटाइप एवं शोधकर्ता प्रवेश',
    guestBtn: 'शोधकर्ता के रूप में सीधे आगे बढ़ें (Guest Access)',
    guestHint: 'प्रोटोटाइप मूल्यांकन के लिए बिना क्रेडेंशियल्स के सीधा प्रवेश।',
    securityNote: 'आधिकारिक नियामक ज्ञान मंच। सुरक्षित प्रमाणीकरण।',
    roles: [
      { id: 'applicant', label: 'पेटेंट / ट्रेडमार्क आवेदक' },
      { id: 'attorney', label: 'आईपी अधिवक्ता / पेटेंट एजेंट' },
      { id: 'msme', label: 'एमएसएमई / स्टार्टअप संस्थापक' },
      { id: 'researcher', label: 'अकादमिक / आयुष शोधकर्ता' }
    ]
  }
};

export default function LoginPage({
  onLoginSuccess,
  language = 'en',
  setLanguage,
  onCancel = null
}) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState('applicant');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [backendError, setBackendError] = useState(null);
  const [successNotice, setSuccessNotice] = useState(null);

  const t = AUTH_TEXTS[language] || AUTH_TEXTS.en;

  // Clear errors upon typing
  const handleIdentifierChange = (e) => {
    setIdentifier(e.target.value);
    setValidationError(null);
    setBackendError(null);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setValidationError(null);
    setBackendError(null);
  };

  // 1. Submit Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);
    setBackendError(null);

    const cleanId = identifier.trim();
    const cleanPass = password.trim();

    if (!cleanId) {
      setValidationError('Please enter your email or 10-digit mobile number.');
      return;
    }
    if (!cleanPass) {
      setValidationError('Please enter your account password.');
      return;
    }
    if (cleanPass.length < 4) {
      setValidationError('Password must be at least 4 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const user = await login({ identifier: cleanId, password: cleanPass });
      onLoginSuccess?.(user);
    } catch (err) {
      console.warn('Login attempt response:', err);
      setBackendError(err.message || 'Unable to sign in. Please verify your credentials or network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Submit Signup
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);
    setBackendError(null);

    if (!name.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setValidationError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const user = await signup({
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        password,
        role
      });
      onLoginSuccess?.(user);
    } catch (err) {
      setBackendError(err.message || 'Registration failed. Please check network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Submit Forgot Password
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);
    setBackendError(null);

    const cleanId = identifier.trim();
    if (!cleanId) {
      setValidationError('Please enter your registered email or mobile number.');
      return;
    }

    setIsLoading(true);

    try {
      await requestPasswordReset({ identifier: cleanId });
      setSuccessNotice(`Password recovery link has been dispatched to ${cleanId}.`);
    } catch (err) {
      setBackendError(err.message || 'Could not send recovery instructions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Continue as Research Guest (Instant Prototype Access)
  const handleGuestAccess = () => {
    const guestUser = loginAsGuest();
    onLoginSuccess?.(guestUser);
  };

  return (
    <div className="login-viewport">
      {/* Top Advisory Banner */}
      <div className="login-top-bar">
        <div className="banner-advisory">
          <span className="advisory-pill">DPIIT PROTOTYPE</span>
          <span className="advisory-text">
            Official IP Knowledge Assistant • Multilingual Legal Information Engine
          </span>
        </div>

        {/* Language selector in top right */}
        {setLanguage && (
          <div className="login-lang-switch">
            <Globe size={14} className="login-lang-icon" />
            {SUPPORTED_LANGUAGES.map(lang => (
              <button
                key={lang.code}
                type="button"
                className={`login-lang-btn ${lang.code === language ? 'active' : ''}`}
                onClick={() => setLanguage(lang.code)}
              >
                {lang.nativeName}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="login-container">
        <div className="login-card">
          {/* Card Header Branding */}
          <div className="login-header">
            {onCancel && (
              <button 
                type="button" 
                className="btn-back-to-app" 
                onClick={onCancel}
                title="Return to Assistant"
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>
            )}

            <div className="login-brand-badge">
              <ShieldCheck size={32} className="login-shield-icon" />
              <span className="brand-accent-dot"></span>
            </div>

            <h1 className="login-title">{t.appTitle}</h1>
            <p className="login-subtitle">{t.appSubtitle}</p>
            <div className="login-status-tag">
              <Sparkles size={12} />
              <span>{t.badge}</span>
            </div>
          </div>

          {/* Navigation Tabs (Sign In / Register / Reset) */}
          <div className="login-tabs-bar" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'login'}
              className={`login-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('login');
                setValidationError(null);
                setBackendError(null);
                setSuccessNotice(null);
              }}
            >
              {t.signInTab}
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'signup'}
              className={`login-tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('signup');
                setValidationError(null);
                setBackendError(null);
                setSuccessNotice(null);
              }}
            >
              {t.signUpTab}
            </button>
          </div>

          {/* Inline Validation / Backend Errors */}
          {validationError && (
            <div className="auth-alert validation-alert" role="alert">
              <AlertCircle size={15} />
              <span>{validationError}</span>
            </div>
          )}

          {backendError && (
            <div className="auth-alert backend-error-alert" role="alert">
              <AlertCircle size={15} />
              <div className="alert-text-group">
                <strong>Authentication Notice</strong>
                <span>{backendError}</span>
              </div>
            </div>
          )}

          {successNotice && (
            <div className="auth-alert success-alert" role="status">
              <CheckCircle2 size={15} />
              <span>{successNotice}</span>
            </div>
          )}

          {/* TAB 1: SIGN IN FORM */}
          {activeTab === 'login' && (
            <form className="auth-form" onSubmit={handleLoginSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="login-identifier" className="form-label">
                  {t.idLabel}
                </label>
                <div className="input-field-wrap">
                  <Mail size={16} className="field-icon" />
                  <input
                    id="login-identifier"
                    type="text"
                    className="form-input"
                    placeholder={t.idPlaceholder}
                    value={identifier}
                    onChange={handleIdentifierChange}
                    disabled={isLoading}
                    autoComplete="username"
                    aria-required="true"
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="label-with-action">
                  <label htmlFor="login-password" className="form-label">
                    {t.passLabel}
                  </label>
                  <button
                    type="button"
                    className="link-subtle"
                    onClick={() => {
                      setActiveTab('forgot');
                      setValidationError(null);
                      setBackendError(null);
                    }}
                  >
                    {t.forgotPass}
                  </button>
                </div>

                <div className="input-field-wrap">
                  <Lock size={16} className="field-icon" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder={t.passPlaceholder}
                    value={password}
                    onChange={handlePasswordChange}
                    disabled={isLoading}
                    autoComplete="current-password"
                    aria-required="true"
                  />
                  <button
                    type="button"
                    className="btn-toggle-eye"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-row remember-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                  />
                  <span>{t.rememberMe}</span>
                </label>
              </div>

              <button
                type="submit"
                className="btn-auth-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="spinner-icon" />
                    <span>{t.signingIn}</span>
                  </>
                ) : (
                  <>
                    <span>{t.signInBtn}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: REGISTER ACCOUNT FORM */}
          {activeTab === 'signup' && (
            <form className="auth-form" onSubmit={handleSignupSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="reg-name" className="form-label">{t.nameLabel}</label>
                <div className="input-field-wrap">
                  <User size={16} className="field-icon" />
                  <input
                    id="reg-name"
                    type="text"
                    className="form-input"
                    placeholder={t.namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-email" className="form-label">{t.emailLabel}</label>
                <div className="input-field-wrap">
                  <Mail size={16} className="field-icon" />
                  <input
                    id="reg-email"
                    type="email"
                    className="form-input"
                    placeholder={t.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-mobile" className="form-label">{t.mobileLabel}</label>
                <div className="input-field-wrap">
                  <Phone size={16} className="field-icon" />
                  <input
                    id="reg-mobile"
                    type="tel"
                    className="form-input"
                    placeholder={t.mobilePlaceholder}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-role" className="form-label">{t.roleLabel}</label>
                <select
                  id="reg-role"
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={isLoading}
                >
                  {t.roles.map(r => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="reg-password" className="form-label">{t.passLabel}</label>
                <div className="input-field-wrap">
                  <Lock size={16} className="field-icon" />
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Create a strong password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="btn-toggle-eye"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-auth-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="spinner-icon" />
                    <span>{t.creatingAccount}</span>
                  </>
                ) : (
                  <>
                    <span>{t.signUpBtn}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: FORGOT PASSWORD */}
          {activeTab === 'forgot' && (
            <form className="auth-form" onSubmit={handleForgotSubmit} noValidate>
              <p className="forgot-instruction">
                Enter your registered email address or mobile number. We will send you verification instructions to securely reset your credentials.
              </p>

              <div className="form-group">
                <label htmlFor="forgot-identifier" className="form-label">{t.idLabel}</label>
                <div className="input-field-wrap">
                  <Mail size={16} className="field-icon" />
                  <input
                    id="forgot-identifier"
                    type="text"
                    className="form-input"
                    placeholder={t.idPlaceholder}
                    value={identifier}
                    onChange={handleIdentifierChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-auth-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="spinner-icon" />
                    <span>{t.sendingReset}</span>
                  </>
                ) : (
                  <>
                    <span>{t.resetBtn}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn-back-link"
                onClick={() => {
                  setActiveTab('login');
                  setValidationError(null);
                  setBackendError(null);
                }}
              >
                ← {t.backToLogin}
              </button>
            </form>
          )}

          {/* RESEARCH EVALUATOR / PROTOTYPE ACCESS (Honest, clean abstraction) */}
          <div className="auth-divider">
            <span>{t.guestSectionTitle}</span>
          </div>

          <div className="guest-action-card">
            <button
              type="button"
              className="btn-guest-access"
              onClick={handleGuestAccess}
              disabled={isLoading}
            >
              <div className="guest-btn-content">
                <strong>{t.guestBtn}</strong>
                <span>{t.guestHint}</span>
              </div>
              <ArrowRight size={16} className="guest-arrow" />
            </button>
          </div>

          {/* Footer Security Note */}
          <div className="login-footer-note">
            <p>{t.securityNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
