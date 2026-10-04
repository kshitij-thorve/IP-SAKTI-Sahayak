/**
 * Unified RAG API Service Facade
 * 
 * All UI components interact exclusively through this module.
 * It abstracts whether responses come from Mock Data or Live HTTP Backend API.
 */

import { getMockRagResponse } from './mockRagAdapter';
import { sendHttpRagRequest, streamHttpRagRequest } from './httpRagAdapter';
import { storageService } from './storageService';

export const ragApi = {
  /**
   * Retrieves active configuration (mock vs live, urls, delays).
   */
  getConfig() {
    return storageService.getSettings();
  },

  /**
   * Updates configuration.
   */
  updateConfig(updates) {
    return storageService.saveSettings(updates);
  },

  /**
   * Sends a message to the RAG service (Mock or HTTP).
   * Supports simulated streaming or standard promise response.
   */
  async sendMessage({
    query,
    language = 'en',
    sessionId = null,
    category = null,
    onStreamChunk = null,
    signal = null
  }) {
    const config = this.getConfig();

    // 1. If HTTP Backend is configured and active
    if (config.mode === 'http') {
      if (onStreamChunk && config.streamSimulation) {
        return await streamHttpRagRequest({
          endpoint: `${config.backendUrl}/stream`,
          query,
          language,
          sessionId,
          category,
          onChunk: onStreamChunk,
          signal
        });
      }
      return await sendHttpRagRequest({
        endpoint: config.backendUrl,
        query,
        language,
        sessionId,
        category,
        signal
      });
    }

    // 2. Mock RAG Service Path (Development / Prototype)
    // Simulate deliberate error if test toggle is enabled
    if (config.simulateError) {
      await new Promise(r => setTimeout(r, 600));
      throw new Error(
        'Simulated RAG Service Connection Error: Target vector database or retrieval endpoint unreachable. Please verify backend connection or disable error simulation in Dev Settings.'
      );
    }

    // Fetch mock response
    const mockResponse = getMockRagResponse(query, language, config.simulateNoSources);

    // Initial retrieval latency simulation
    await new Promise(resolve => setTimeout(resolve, config.simulatedDelayMs || 500));

    // If streaming simulation is requested and callback provided
    if (onStreamChunk && config.streamSimulation) {
      return await this._simulateStream(mockResponse, onStreamChunk, signal);
    }

    return mockResponse;
  },

  /**
   * Internal helper to simulate realistic token streaming for presentation/demo.
   */
  async _simulateStream(response, onStreamChunk, signal) {
    const fullText = response.answer;
    // Chunk by words/tokens
    const words = fullText.split(/(\s+)/);
    let currentText = '';

    for (let i = 0; i < words.length; i++) {
      if (signal?.aborted) {
        throw new Error('Response generation stopped by user.');
      }
      
      currentText += words[i];
      onStreamChunk({
        accumulatedAnswer: currentText,
        sources: response.sources,
        isComplete: false
      });

      // Quick variable delay to mimic real LLM token arrival
      const delay = Math.floor(Math.random() * 15) + 12;
      await new Promise(r => setTimeout(r, delay));
    }

    onStreamChunk({
      accumulatedAnswer: currentText,
      sources: response.sources,
      isComplete: true
    });

    return {
      ...response,
      answer: currentText
    };
  }
};
