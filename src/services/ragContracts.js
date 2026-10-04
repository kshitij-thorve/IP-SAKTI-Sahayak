/**
 * RAG Contracts & Response Normalizer
 * 
 * Ensures the Frontend UI is decoupled from future Backend/RAG contract changes.
 * If the Backend team renames fields (e.g. 'doc_title' -> 'title', 'citations' -> 'sources'),
 * modify only this normalizer without touching any UI component!
 */

export const PROTOTYPE_DISCLAIMER_TAG = '[Prototype / Development Artifact — Not Official Legal Advice]';

/**
 * Normalizes any incoming backend or mock response into the standard UI contract.
 * @param {Object} rawData 
 * @returns {Object} Standardized RAG response
 */
export function normalizeRagResponse(rawData = {}) {
  const answer = rawData.answer || rawData.text || rawData.content || 'No response generated.';
  const language = rawData.language || rawData.lang || 'en';
  const sessionId = rawData.session_id || rawData.sessionId || rawData.session || `session_${Date.now()}`;
  
  // Normalize sources array
  const rawSources = rawData.sources || rawData.citations || rawData.documents || [];
  const sources = Array.isArray(rawSources) ? rawSources.map((s, idx) => ({
    id: s.id || `source_${idx + 1}`,
    index: idx + 1,
    title: s.title || s.doc_title || s.name || 'Sample Document — Development Only',
    page: s.page !== undefined ? s.page : (s.page_no || s.page_number || 'N/A'),
    section: s.section || s.clause || s.heading || 'Draft Section',
    url: s.url || s.link || s.official_url || '#',
    excerpt: s.excerpt || s.snippet || s.text || 'Document excerpt under research and curation.',
    isMock: Boolean(s.isMock ?? true)
  })) : [];

  return {
    answer,
    language,
    sources,
    session_id: sessionId,
    isPrototype: true,
    timestamp: rawData.timestamp || new Date().toISOString(),
    confidence: rawData.confidence ?? 0.92,
    metadata: rawData.metadata || {}
  };
}

/**
 * Prepares standard request payload sent to the backend.
 * @param {Object} params
 */
export function formatRagRequest({ query, language = 'en', sessionId = null, category = null }) {
  return {
    query: query.trim(),
    language,
    session_id: sessionId,
    category_filter: category || undefined,
    client_timestamp: new Date().toISOString()
  };
}
