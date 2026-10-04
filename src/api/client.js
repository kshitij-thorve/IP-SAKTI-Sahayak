/**
 * Centralized API Client for IP-SAKTI Sahayak
 * 
 * Architecture Guarantees:
 * - Public API Gateway access only (FastAPI).
 * - No Supabase service-role keys, Milvus credentials, or NVIDIA API keys in frontend.
 * - Centralized timeout, header, authorization, and error normalization.
 * - Dynamic runtime base URL support for Android local device testing on Wi-Fi.
 */

const STORAGE_KEY_API_BASE_URL = 'ipsakti_api_base_url';
const STORAGE_KEY_USE_MOCK = 'ipsakti_use_mock_api';
const STORAGE_KEY_AUTH_TOKEN = 'ipsakti_auth_token';
const STORAGE_KEY_AUTH_USER = 'ipsakti_auth_user';

const DEFAULT_BASE_URL = 'http://localhost:8000/api';

/**
 * Custom normalized API Error
 */
export class ApiError extends Error {
  constructor(status, code, message, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.isBackendUnavailable = status === 0 || status === 503;
  }
}

/**
 * Gets the current active API Base URL.
 * Checks runtime localStorage override first (useful for Android testing),
 * then Vite environment variable, then default.
 */
export function getApiBaseUrl() {
  try {
    const runtimeUrl = localStorage.getItem(STORAGE_KEY_API_BASE_URL);
    if (runtimeUrl && runtimeUrl.trim()) {
      return runtimeUrl.trim().replace(/\/+$/, '');
    }
  } catch {
    // Fallback if localStorage is inaccessible
  }

  let envUrl = null;
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      envUrl = import.meta.env.VITE_API_BASE_URL;
    }
  } catch {
    // Ignore
  }

  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, '');
  }

  return DEFAULT_BASE_URL;
}

/**
 * Sets a runtime API Base URL (e.g. laptop Wi-Fi IP for Android testing).
 */
export function setApiBaseUrl(url) {
  try {
    if (!url || !url.trim()) {
      localStorage.removeItem(STORAGE_KEY_API_BASE_URL);
    } else {
      localStorage.setItem(STORAGE_KEY_API_BASE_URL, url.trim().replace(/\/+$/, ''));
    }
  } catch (e) {
    console.warn('Could not persist API base URL to storage', e);
  }
}

/**
 * Resets the runtime API Base URL back to environment default.
 */
export function resetApiBaseUrl() {
  try {
    localStorage.removeItem(STORAGE_KEY_API_BASE_URL);
  } catch {
    // Ignore
  }
}

/**
 * Checks whether Mock API mode is enabled.
 * Default is FALSE (Live Backend first per project architecture).
 */
export function isMockApiEnabled() {
  try {
    const runtimeSetting = localStorage.getItem(STORAGE_KEY_USE_MOCK);
    if (runtimeSetting !== null) {
      return runtimeSetting === 'true';
    }
  } catch {
    // Ignore
  }

  // Vite env variable check - defaults to false if unset
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env.VITE_USE_MOCK_API === 'true';
    }
  } catch {
    // Ignore
  }

  return false;
}

/**
 * Toggles Mock API mode at runtime.
 */
export function setMockApiEnabled(enabled) {
  try {
    localStorage.setItem(STORAGE_KEY_USE_MOCK, enabled ? 'true' : 'false');
  } catch (e) {
    console.warn('Could not persist mock API setting', e);
  }
}

/**
 * Auth Token Management
 */
export function getAuthToken() {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY_AUTH_TOKEN) || null;
    }
    return null;
  } catch {
    return null;
  }
}

export function setAuthToken(token) {
  try {
    if (typeof localStorage !== 'undefined') {
      if (!token) {
        localStorage.removeItem(STORAGE_KEY_AUTH_TOKEN);
      } else {
        localStorage.setItem(STORAGE_KEY_AUTH_TOKEN, token);
      }
    }
  } catch (e) {
    console.warn('Could not persist auth token', e);
  }
}

export function clearAuthToken() {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_AUTH_TOKEN);
    }
  } catch {
    // Ignore
  }
}

export function getStoredUser() {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY_AUTH_USER);
      return raw ? JSON.parse(raw) : null;
    }
    return null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  try {
    if (typeof localStorage !== 'undefined') {
      if (!user) {
        localStorage.removeItem(STORAGE_KEY_AUTH_USER);
      } else {
        localStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(user));
      }
    }
  } catch (e) {
    console.warn('Could not persist auth user', e);
  }
}

export function clearStoredUser() {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_AUTH_USER);
    }
  } catch {
    // Ignore
  }
}

/**
 * Resolves full API URL with path normalization.
 * Prevents issues like duplicate `/api/api/...` when base URL already contains `/api`.
 */
export function resolveApiUrl(endpoint) {
  const base = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (base.endsWith('/api') && cleanEndpoint.startsWith('/api/')) {
    return `${base}${cleanEndpoint.slice(4)}`;
  }

  return `${base}${cleanEndpoint}`;
}

/**
 * Centralized fetch client with timeout, JSON formatting, auth headers, and standardized error parsing.
 */
export async function apiClient(endpoint, options = {}) {
  const url = resolveApiUrl(endpoint);

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers
  };

  // Attach auth bearer token if available and not already provided
  const token = getAuthToken();
  if (token && !headers['Authorization'] && !headers['authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const timeoutMs = options.timeoutMs || 30000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // Link caller signal if provided
  if (options.signal) {
    if (options.signal.aborted) {
      clearTimeout(timeoutId);
      throw new ApiError(0, 'CANCELLED', 'Request was cancelled.');
    }
    options.signal.addEventListener('abort', () => controller.abort());
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // If HTTP error status, parse and normalize user-friendly error message
    if (!response.ok) {
      let errorBody = null;
      let safeDetail = null;

      try {
        const text = await response.text();
        try {
          errorBody = JSON.parse(text);
          if (errorBody && typeof errorBody === 'object') {
            safeDetail = errorBody.detail || errorBody.message || null;
            // Clean detail to avoid exposing raw stack traces or internal paths
            if (typeof safeDetail === 'string' && (safeDetail.includes('Traceback') || safeDetail.includes('line '))) {
              safeDetail = null;
            }
          }
        } catch {
          if (text && !text.includes('<!DOCTYPE') && !text.includes('Traceback')) {
            safeDetail = text.slice(0, 150);
          }
        }
      } catch {
        // Fallback
      }

      let code = 'HTTP_ERROR';
      let message = 'An error occurred while communicating with the server.';

      switch (response.status) {
        case 400:
          code = 'INVALID_REQUEST';
          message = safeDetail || 'Invalid request. Please verify your query or input data.';
          break;
        case 401:
          code = 'UNAUTHORIZED';
          message = safeDetail || 'Authentication required or your session has expired. Please sign in.';
          break;
        case 403:
          code = 'FORBIDDEN';
          message = 'Access forbidden. You do not have permission to perform this action.';
          break;
        case 404:
          code = 'NOT_FOUND';
          message = safeDetail || 'Requested endpoint or resource was not found on the backend.';
          break;
        case 500:
          code = 'INTERNAL_ERROR';
          message = 'The server encountered an internal issue. Please try again later.';
          break;
        case 503:
          code = 'RAG_UNAVAILABLE';
          message = 'The knowledge / RAG service is temporarily unavailable. Please try again shortly.';
          break;
        default:
          message = safeDetail || `Backend returned error HTTP ${response.status}.`;
          break;
      }

      throw new ApiError(response.status, code, message, safeDetail);
    }

    // Parse JSON response body
    // If empty response (204 No Content)
    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await response.json();
    }

    return await response.text();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error.name === 'AbortError') {
      if (options.signal?.aborted) {
        throw new ApiError(0, 'CANCELLED', 'Request was cancelled by user.');
      }
      throw new ApiError(
        0,
        'TIMEOUT',
        `Network timeout: The backend service took longer than ${timeoutMs / 1000}s to respond. Please check backend connection.`
      );
    }

    // Network disconnection / connection refused
    const msg = error.message || '';
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('ERR_CONNECTION')) {
      throw new ApiError(
        0,
        'BACKEND_UNAVAILABLE',
        `Backend unavailable. Unable to connect to ${getApiBaseUrl()}. Please verify your FastAPI backend is running on port 8000 or switch to Mock Mode.`
      );
    }

    throw new ApiError(0, 'CLIENT_ERROR', error.message || 'An unexpected client error occurred.');
  }
}

/**
 * Health check helper for backend connectivity
 */
export async function checkBackendHealth() {
  try {
    const data = await apiClient('/health', { timeoutMs: 3500 });
    return { ok: true, data };
  } catch {
    // Also try without /api if base has /api
    try {
      const data = await apiClient('/api/health', { timeoutMs: 3500 });
      return { ok: true, data };
    } catch (innerErr) {
      return { ok: false, error: innerErr.message };
    }
  }
}
