/**
 * HTTP RAG Service Adapter
 * 
 * Ready to connect to the team's Backend + RAG API once deployed.
 * ZERO frontend UI redesign required when switching from Mock to HTTP!
 */

import { formatRagRequest, normalizeRagResponse } from './ragContracts';

export async function sendHttpRagRequest({
  endpoint = 'http://localhost:8000/api/chat',
  query,
  language = 'en',
  sessionId = null,
  category = null,
  signal = null
}) {
  const payload = formatRagRequest({ query, language, sessionId, category });

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(
      `Backend API Error (${response.status} ${response.statusText}): ${errorText || 'Failed to fetch RAG response'}`
    );
  }

  const rawJson = await response.json();
  return normalizeRagResponse(rawJson);
}

/**
 * Handles Server-Sent Events (SSE) or streaming ndjson from the backend if supported.
 */
export async function streamHttpRagRequest({
  endpoint = 'http://localhost:8000/api/chat/stream',
  query,
  language = 'en',
  sessionId = null,
  category = null,
  onChunk,
  signal
}) {
  const payload = formatRagRequest({ query, language, sessionId, category });

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream, application/x-ndjson'
    },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    throw new Error(`Streaming failed: HTTP ${response.status} ${response.statusText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let accumulatedAnswer = '';
  let finalSources = [];
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop(); // keep partial line

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith(':')) continue;
      
      const dataStr = trimmed.startsWith('data:') ? trimmed.slice(5).trim() : trimmed;
      if (dataStr === '[DONE]') continue;

      try {
        const parsed = JSON.parse(dataStr);
        if (parsed.chunk || parsed.text || parsed.delta) {
          accumulatedAnswer += (parsed.chunk || parsed.text || parsed.delta);
          onChunk({
            accumulatedAnswer,
            sources: parsed.sources || finalSources,
            isComplete: false
          });
        }
        if (parsed.sources) {
          finalSources = parsed.sources;
        }
      } catch {
        // Fallback for raw text stream chunks
        accumulatedAnswer += dataStr;
        onChunk({
          accumulatedAnswer,
          sources: finalSources,
          isComplete: false
        });
      }
    }
  }

  return normalizeRagResponse({
    answer: accumulatedAnswer,
    sources: finalSources,
    language,
    session_id: sessionId
  });
}
