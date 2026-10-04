/**
 * Local Storage Service for Chat History and Settings
 */

const STORAGE_KEYS = {
  SESSIONS: 'ipsakti_chat_sessions_v1',
  ACTIVE_SESSION: 'ipsakti_active_session_id_v1',
  SETTINGS: 'ipsakti_dev_settings_v1'
};

const DEFAULT_SETTINGS = {
  mode: 'mock', // 'mock' | 'http'
  backendUrl: 'http://localhost:8000/api/chat',
  streamSimulation: true,
  simulatedDelayMs: 400,
  simulateError: false,
  simulateNoSources: false
};

export const storageService = {
  // --- Sessions & History ---
  getSessions() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to read sessions from localStorage', e);
      return [];
    }
  },

  saveSession(session) {
    try {
      const sessions = this.getSessions();
      const existingIndex = sessions.findIndex(s => s.id === session.id);
      
      const sessionSummary = {
        id: session.id,
        title: session.title || 'New Query',
        timestamp: session.timestamp || new Date().toISOString(),
        messageCount: session.messages?.length || 0,
        language: session.language || 'en',
        messages: session.messages || []
      };

      if (existingIndex >= 0) {
        sessions[existingIndex] = sessionSummary;
      } else {
        sessions.unshift(sessionSummary);
      }

      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions.slice(0, 50)));
      return sessionSummary;
    } catch (e) {
      console.error('Failed to save session to localStorage', e);
    }
  },

  getSessionById(sessionId) {
    const sessions = this.getSessions();
    return sessions.find(s => s.id === sessionId) || null;
  },

  deleteSession(sessionId) {
    try {
      const sessions = this.getSessions().filter(s => s.id !== sessionId);
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
      return sessions;
    } catch (e) {
      console.error('Failed to delete session', e);
      return [];
    }
  },

  clearAllSessions() {
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSIONS);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    } catch (e) {
      console.error('Failed to clear sessions', e);
    }
  },

  // --- Active Session Pointer ---
  getActiveSessionId() {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION) || null;
  },

  setActiveSessionId(id) {
    if (id) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    }
  },

  // --- Dev & Backend Settings ---
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(newSettings) {
    try {
      const merged = { ...this.getSettings(), ...newSettings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
      return merged;
    } catch (e) {
      console.error('Failed to save settings', e);
      return DEFAULT_SETTINGS;
    }
  }
};
