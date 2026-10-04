import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import ChatArea from './components/Chat/ChatArea';
import DevSettingsModal from './components/DevSettings/DevSettingsModal';
import LoginPage from './components/Auth/LoginPage';
import { sendChatMessage } from './api/chat';
import { fetchSessions, fetchSessionMessages, persistSession, removeSession } from './api/sessions';
import { isMockApiEnabled, setMockApiEnabled } from './api/client';
import { getCurrentUser, logout } from './api/auth';
import { DEFAULT_LANGUAGE } from './constants/languages';
import './index.css';

export default function App() {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  
  // Lightweight hash-based view router for Android/Web ('chat' | 'login')
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash;
    if (hash === '#/login' || hash === '#/signup' || hash === '#/forgot') {
      return 'login';
    }
    // If not authenticated, open login page; otherwise chat
    return getCurrentUser() ? 'chat' : 'login';
  });

  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [devModalOpen, setDevModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [mockActive, setMockActive] = useState(() => isMockApiEnabled());

  const abortControllerRef = useRef(null);

  // Sync with browser URL hash
  useEffect(() => {
    function handleHashChange() {
      const hash = window.location.hash;
      if (hash === '#/login' || hash === '#/signup' || hash === '#/forgot') {
        setCurrentView('login');
      } else if (hash === '#/chat') {
        setCurrentView('chat');
      }
    }
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Load chat sessions on mount
  useEffect(() => {
    async function loadSessions() {
      try {
        const data = await fetchSessions();
        setSessions(data || []);
      } catch (err) {
        console.warn('Failed to load initial sessions', err);
      }
    }
    loadSessions();
  }, []);

  // Authentication Handlers
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentView('chat');
    window.location.hash = '#/chat';
  };

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    setCurrentView('login');
    window.location.hash = '#/login';
  };

  const handleOpenLogin = () => {
    setCurrentView('login');
    window.location.hash = '#/login';
  };

  const handleBackToChat = () => {
    setCurrentView('chat');
    window.location.hash = '#/chat';
  };

  // New Chat action
  const handleNewChat = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setActiveSessionId(null);
    setMessages([]);
    setError(null);
    setInput('');
    setIsLoading(false);
  };

  // Select existing session and fetch its messages
  const handleSelectSession = async (sessionId) => {
    setActiveSessionId(sessionId);
    setError(null);

    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      if (session.messages && session.messages.length > 0) {
        setMessages(session.messages);
      } else {
        const msgs = await fetchSessionMessages(sessionId);
        setMessages(msgs || []);
      }
      if (session.language) setLanguage(session.language);
    }
  };

  // Delete session
  const handleDeleteSession = async (sessionId) => {
    const remaining = await removeSession(sessionId);
    setSessions(remaining);
    if (activeSessionId === sessionId) {
      handleNewChat();
    }
  };

  // Send message action
  const handleSendMessage = async (queryOverride, langOverride) => {
    const queryToSend = (queryOverride || input).trim();
    if (!queryToSend || isLoading) return;

    const queryLang = langOverride || language;
    if (langOverride && langOverride !== language) {
      setLanguage(langOverride);
    }

    setError(null);
    setInput('');
    setIsLoading(true);

    const userMessageId = `user_${Date.now()}`;
    const userMessage = {
      id: userMessageId,
      role: 'user',
      content: queryToSend,
      timestamp: new Date().toISOString(),
      language: queryLang
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    const currentSessionId = activeSessionId || `session_${Date.now()}`;
    if (!activeSessionId) {
      setActiveSessionId(currentSessionId);
    }

    abortControllerRef.current = new AbortController();

    try {
      // Dispatch through dedicated API layer to backend POST /api/chat
      const response = await sendChatMessage({
        message: queryToSend,
        language: queryLang,
        sessionId: currentSessionId,
        signal: abortControllerRef.current.signal
      });

      const assistantMessageId = response.message_id || `asst_${Date.now()}`;
      const assistantMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: response.answer,
        grounded: response.grounded,
        citations: response.citations || [],
        model_info: response.model_info || {},
        timestamp: new Date().toISOString(),
        language: response.language || queryLang
      };

      const finalizedMessages = [...newMessages, assistantMessage];
      setMessages(finalizedMessages);

      // Persist session
      const sessionTitle = queryToSend.length > 36 
        ? `${queryToSend.substring(0, 36)}...` 
        : queryToSend;

      await persistSession({
        id: currentSessionId,
        title: sessionTitle,
        language: queryLang,
        messages: finalizedMessages
      });

      const updatedSessions = await fetchSessions();
      setSessions(updatedSessions);
    } catch (err) {
      if (err.name === 'ApiError' && err.code === 'CANCELLED') {
        // User cancelled
      } else {
        console.error('Chat error:', err);
        setError(err);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  // Retry last query
  const handleRetryLast = () => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.content, lastUserMessage.language);
    }
  };

  // Switch to Mock mode and retry
  const handleSwitchToMock = () => {
    setMockApiEnabled(true);
    setMockActive(true);
    try {
      localStorage.removeItem('ipsakti_sim_error');
    } catch {
      // Ignore
    }
    setError(null);
    handleRetryLast();
  };

  // If active view is Login, render LoginPage
  if (currentView === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        language={language}
        setLanguage={setLanguage}
        onCancel={currentUser ? handleBackToChat : null}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Top Prototype / Research Advisory Banner */}
      <div className="disclaimer-banner">
        <strong>DEVELOPMENT PROTOTYPE</strong>
        <span>
          Official IP Regulatory Knowledge Assistant. Knowledge corpus is in development. Answers are generated for evaluation and do not substitute official gazettes.
        </span>
      </div>

      {/* Main Header */}
      <Header
        language={language}
        setLanguage={setLanguage}
        onOpenDevSettings={() => setDevModalOpen(true)}
        isMockMode={mockActive}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentUser={currentUser}
        onOpenLogin={handleOpenLogin}
        onLogout={handleLogout}
      />

      {/* Body Frame */}
      <div className="app-body">
        {/* Left Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          sessions={sessions}
          activeSessionId={activeSessionId}
          onNewChat={handleNewChat}
          onSelectSession={handleSelectSession}
          onDeleteSession={handleDeleteSession}
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => setSelectedCategory(catId)}
          onOpenDocuments={() => setUploadModalOpen(true)}
          onOpenSettings={() => setDevModalOpen(true)}
        />

        {/* Central Chat Area */}
        <ChatArea
          messages={messages}
          input={input}
          setInput={setInput}
          onSend={() => handleSendMessage()}
          isLoading={isLoading}
          error={error}
          onRetry={handleRetryLast}
          onSwitchToMock={handleSwitchToMock}
          language={language}
          setLanguage={setLanguage}
          selectedCategory={selectedCategory}
          onSelectPrompt={(prompt, lang) => handleSendMessage(prompt, lang)}
          uploadModalOpen={uploadModalOpen}
          setUploadModalOpen={setUploadModalOpen}
        />
      </div>

      {/* Dev Settings & Architecture Modal */}
      <DevSettingsModal
        isOpen={devModalOpen}
        onClose={() => setDevModalOpen(false)}
        onSettingsUpdated={({ useMock }) => setMockActive(useMock)}
      />
    </div>
  );
}
