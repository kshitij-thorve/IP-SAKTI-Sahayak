/**
 * Authentication API Service for IP-SAKTI Sahayak
 * 
 * Provides clean interface for authentication and user sessions.
 * Communicates with backend endpoints (/auth/login, /auth/register, /auth/me).
 * 
 * Architecture Principle:
 * - Keeps auth integration behind this service layer.
 * - Does not use fake hardcoded credentials or pretend insecure mock is live auth.
 * - Provides explicit Guest / Prototype mode for developer and researcher testing
 *   when backend auth service is pending integration.
 */

import { 
  apiClient, 
  setAuthToken, 
  clearAuthToken, 
  setStoredUser, 
  getStoredUser, 
  clearStoredUser,
  ApiError 
} from './client.js';

/**
 * Authenticates user with email/mobile and password.
 * 
 * @param {Object} credentials
 * @param {string} credentials.identifier - Email address or 10-digit mobile number
 * @param {string} credentials.password - Account password
 */
export async function login({ identifier, password }) {
  const cleanId = (identifier || '').trim();
  const cleanPass = (password || '').trim();

  if (!cleanId || !cleanPass) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Please enter both your email/mobile and password.');
  }

  try {
    const payload = {
      identifier: cleanId,
      username: cleanId,
      email: cleanId.includes('@') ? cleanId : undefined,
      password: cleanPass
    };

    const response = await apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    const token = response?.token || response?.access_token || response?.data?.token;
    const user = response?.user || response?.data?.user || {
      id: response?.user_id || `user_${Date.now()}`,
      identifier: cleanId,
      name: cleanId.split('@')[0],
      role: 'user',
      isGuest: false
    };

    if (token) {
      setAuthToken(token);
    }
    setStoredUser(user);

    return user;
  } catch (error) {
    // If backend auth routes are not yet mounted or backend returns 404
    if (error.status === 404) {
      throw new ApiError(
        404,
        'AUTH_NOT_IMPLEMENTED',
        'Backend authentication endpoints are under active integration by the backend team. You can continue as a Research Guest to test the assistant.'
      );
    }
    throw error;
  }
}

/**
 * Registers a new user account.
 */
export async function signup({ name, email, mobile, password, role = 'applicant' }) {
  const cleanName = (name || '').trim();
  const cleanEmail = (email || '').trim();
  const cleanMobile = (mobile || '').trim();
  const cleanPass = (password || '').trim();

  if (!cleanName || !cleanEmail || !cleanPass) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Please fill in all required registration fields.');
  }

  try {
    const payload = {
      name: cleanName,
      email: cleanEmail,
      mobile: cleanMobile,
      password: cleanPass,
      role
    };

    const response = await apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    const token = response?.token || response?.access_token;
    const user = response?.user || {
      name: cleanName,
      email: cleanEmail,
      mobile: cleanMobile,
      role,
      isGuest: false
    };

    if (token) {
      setAuthToken(token);
    }
    setStoredUser(user);

    return user;
  } catch (error) {
    if (error.status === 404) {
      throw new ApiError(
        404,
        'AUTH_NOT_IMPLEMENTED',
        'Backend user registration service is under active integration. Please continue as a Research Guest for prototype evaluation.'
      );
    }
    throw error;
  }
}

/**
 * Initiates a password reset request.
 */
export async function requestPasswordReset({ identifier }) {
  const cleanId = (identifier || '').trim();
  if (!cleanId) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Please enter your registered email or mobile number.');
  }

  try {
    return await apiClient('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ identifier: cleanId })
    });
  } catch (error) {
    if (error.status === 404) {
      throw new ApiError(
        404,
        'AUTH_NOT_IMPLEMENTED',
        'Password recovery service is not yet enabled on the backend server.'
      );
    }
    throw error;
  }
}

/**
 * Logs out the active user and clears security tokens.
 */
export async function logout() {
  try {
    await apiClient('/auth/logout', { method: 'POST' });
  } catch {
    // Graceful offline cleanup even if backend is offline
  } finally {
    clearAuthToken();
    clearStoredUser();
  }
}

/**
 * Explicit Guest / Prototype Evaluator session.
 * Allows safe, credential-free evaluation of IP-SAKTI Sahayak.
 */
export function loginAsGuest() {
  const guestUser = {
    id: `guest_${Date.now()}`,
    name: 'Research Evaluator',
    email: 'evaluator@ip-sakti.gov.in',
    role: 'evaluator',
    isGuest: true
  };

  setStoredUser(guestUser);
  return guestUser;
}

/**
 * Returns currently stored user or null.
 */
export function getCurrentUser() {
  return getStoredUser();
}

/**
 * Checks if user is currently logged in.
 */
export function isAuthenticated() {
  return Boolean(getStoredUser());
}
