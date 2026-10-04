/**
 * Sessions API Service for IP-SAKTI Sahayak
 * 
 * Manages active conversation sessions and history.
 * Prefers backend FastAPI sessions API (/api/sessions) when available,
 * with resilient offline localStorage caching for fast mobile UX.
 */

import { apiClient, isMockApiEnabled } from './client.js';

const STORAGE_KEY = 'ipsakti_chat_sessions_v2';

/**
 * Normalizes session objects from backend or storage
 */
function normalizeSession(raw = {}) {
  return {
    id: raw.id || raw.session_id || `session_${Date.now()}`,
    title: raw.title || 'Regulatory Discussion',
    timestamp: raw.timestamp || raw.created_at || new Date().toISOString(),
    language: raw.language || 'en',
    messageCount: raw.messageCount || raw.message_count || (raw.messages?.length || 0),
    messages: raw.messages || []
  };
}

/**
 * Loads all sessions for the active user/device
 */
export async function fetchSessions() {
  // If live mode is enabled, attempt to fetch from backend sessions API
  if (!isMockApiEnabled()) {
    try {
      const response = await apiClient('/sessions', { timeoutMs: 5000 });
      const backendSessions = Array.isArray(response) 
        ? response 
        : (Array.isArray(response?.sessions) ? response.sessions : (Array.isArray(response?.data) ? response.data : null));

      if (backendSessions) {
        const normalized = backendSessions.map(normalizeSession);
        // Sync local cache
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized.slice(0, 30)));
        } catch {
          // Ignore storage overflow
        }
        return normalized;
      }
    } catch {
      // Backend /sessions may not be implemented yet or temporarily offline; fall back to local cache
    }
  }

  // Fallback to local storage
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw).map(normalizeSession) : [];
  } catch {
    return [];
  }
}

/**
 * Fetches messages for a specific session ID
 */
export async function fetchSessionMessages(sessionId) {
  if (!sessionId) return [];

  if (!isMockApiEnabled()) {
    try {
      const response = await apiClient(`/sessions/${sessionId}/messages`, { timeoutMs: 5000 });
      const msgs = Array.isArray(response) ? response : (Array.isArray(response?.messages) ? response.messages : null);
      if (msgs) {
        return msgs;
      }
    } catch {
      // Fallback
    }
  }

  // Fallback to local cache
  const sessions = await fetchSessions();
  const session = sessions.find(s => s.id === sessionId);
  return session?.messages || [];
}

/**
 * Persists an active session (upsert)
 */
export async function persistSession(session) {
  if (!session || !session.id) return;

  const record = {
    id: session.id,
    title: session.title || 'Conversation',
    timestamp: session.timestamp || new Date().toISOString(),
    language: session.language || 'en',
    messageCount: session.messages?.length || 0,
    messages: session.messages || []
  };

  // 1. Immediately update local cache for smooth zero-latency UI
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const sessions = raw ? JSON.parse(raw) : [];
    const existingIndex = sessions.findIndex(s => s.id === session.id);

    if (existingIndex >= 0) {
      sessions[existingIndex] = record;
    } else {
      sessions.unshift(record);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, 30)));
  } catch (e) {
    console.warn('Failed to update local session cache', e);
  }

  // 2. If live mode, sync with backend in background
  if (!isMockApiEnabled()) {
    try {
      await apiClient('/sessions', {
        method: 'POST',
        body: JSON.stringify({
          session_id: record.id,
          title: record.title,
          language: record.language,
          messages: record.messages
        }),
        timeoutMs: 5000
      });
    } catch {
      // Backend may be read-only or session auto-persists in /chat; ignore
    }
  }

  return record;
}

/**
 * Removes a session by ID
 */
export async function removeSession(sessionId) {
  // Update local cache
  let remaining = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const sessions = raw ? JSON.parse(raw) : [];
    remaining = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
  } catch (e) {
    console.warn('Failed to remove session from cache', e);
  }

  // If live mode, notify backend
  if (!isMockApiEnabled()) {
    try {
      await apiClient(`/sessions/${sessionId}`, {
        method: 'DELETE',
        timeoutMs: 5000
      });
    } catch {
      // Ignore
    }
  }

  return remaining;
}
