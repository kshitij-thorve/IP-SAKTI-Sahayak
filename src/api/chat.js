/**
 * Chat API Service for IP-SAKTI Sahayak
 * 
 * Target Architecture:
 * Frontend UI -> FastAPI Backend (/api/chat) -> RAG Service -> NVIDIA RAG
 * 
 * Request Contract:
 * {
 *   "message": "...",
 *   "session_id": "...",
 *   "language": "mr" | "hi" | "en"
 * }
 * 
 * Response Contract:
 * {
 *   "answer": "...",
 *   "language": "mr",
 *   "session_id": "...",
 *   "message_id": "...",
 *   "grounded": true | false,
 *   "sources": []
 * }
 */

import { apiClient, isMockApiEnabled, ApiError } from './client.js';
import { MOCK_RAG_RESPONSES, generatePrototypeFallbackResponse } from './mockData.js';

/**
 * Normalizes incoming response to ensure strict UI contract adherence.
 * Never invents sources: if sources are empty, citations remain empty.
 */
export function normalizeChatResponse(raw = {}) {
  const payload = raw.data || raw;

  const rawAnswer = payload.answer || payload.content || payload.text;
  const answer = (rawAnswer && typeof rawAnswer === 'string' && rawAnswer.trim())
    ? rawAnswer.trim()
    : 'No regulatory information could be retrieved for this query. Please rephrase or try another IP topic.';

  const grounded = payload.grounded !== undefined ? Boolean(payload.grounded) : true;
  const language = payload.language || 'en';
  const sessionId = payload.session_id || payload.sessionId || null;
  const messageId = payload.message_id || payload.messageId || null;

  // Accept sources or citations array from backend contract
  const rawSources = payload.sources || payload.citations || [];
  const citations = Array.isArray(rawSources) ? rawSources.map((c, idx) => ({
    citation_id: c.citation_id || c.id || (idx + 1),
    document_id: c.document_id || c.doc_id || `DOC-${idx + 1}`,
    document_title: c.document_title || c.title || 'Document Source',
    chunk_id: c.chunk_id || `chunk_${idx + 1}`,
    page_number: c.page_number !== undefined ? c.page_number : (c.page !== undefined ? c.page : 'N/A'),
    section: c.section || c.clause || 'General Section',
    source_url: c.source_url || (c.url && c.url !== '#' ? c.url : null),
    relevance_score: typeof c.relevance_score === 'number' 
      ? c.relevance_score 
      : (typeof c.score === 'number' ? c.score : null),
    snippet: c.snippet || c.excerpt || '',
    is_sample_document: Boolean(c.is_sample_document || c.is_sample || false)
  })) : [];

  return {
    answer,
    language,
    session_id: sessionId,
    message_id: messageId,
    grounded,
    citations,
    model_info: payload.model_info || {
      pipeline: isMockApiEnabled() ? 'Prototype Mock Service' : 'Live Backend RAG Service'
    }
  };
}

/**
 * Sends chat message to backend or mock provider.
 * 
 * @param {Object} params
 * @param {string} params.message - User prompt
 * @param {string} params.language - 'en' | 'hi' | 'mr'
 * @param {string} params.sessionId - Unique conversation id
 * @param {AbortSignal} params.signal - Cancellation signal
 */
export async function sendChatMessage({
  message,
  language = 'en',
  sessionId = null,
  signal = null
}) {
  const trimmed = (message || '').trim();
  if (!trimmed) {
    throw new ApiError(400, 'INVALID_REQUEST', 'Message cannot be empty.');
  }

  // 1. LIVE BACKEND MODE (Default)
  if (!isMockApiEnabled()) {
    const payload = {
      message: trimmed,
      session_id: sessionId,
      language
    };

    try {
      const rawResponse = await apiClient('/chat', {
        method: 'POST',
        body: JSON.stringify(payload),
        signal
      });

      return normalizeChatResponse(rawResponse);
    } catch (err) {
      // If /chat returned 404, attempt /api/chat fallback in case backend mount differs
      if (err.status === 404) {
        try {
          const fallbackResponse = await apiClient('/api/chat', {
            method: 'POST',
            body: JSON.stringify(payload),
            signal
          });
          return normalizeChatResponse(fallbackResponse);
        } catch {
          throw err;
        }
      }
      throw err;
    }
  }

  // 2. MOCK API MODE (Clearly isolated development mock mode)
  // Artificial network latency simulation (400-700ms)
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (signal?.aborted) {
    throw new ApiError(0, 'CANCELLED', 'Request was cancelled by user.');
  }

  // Check test toggles from localStorage for developer testing
  const simulateError = localStorage.getItem('ipsakti_sim_error') === 'true';
  const simulateUngrounded = localStorage.getItem('ipsakti_sim_ungrounded') === 'true';

  if (simulateError) {
    throw new ApiError(503, 'RAG_UNAVAILABLE', 'Simulated Backend Error (503): Target RAG orchestration service is unreachable.');
  }

  const queryLower = trimmed.toLowerCase();
  const matched = MOCK_RAG_RESPONSES.find(item =>
    item.triggers.some(t => queryLower.includes(t.toLowerCase()))
  );

  if (matched && !simulateUngrounded) {
    return normalizeChatResponse({
      ...matched.response,
      session_id: sessionId,
      language
    });
  }

  const fallback = generatePrototypeFallbackResponse(trimmed, language, simulateUngrounded);
  return normalizeChatResponse({
    ...fallback,
    session_id: sessionId,
    language
  });
}
