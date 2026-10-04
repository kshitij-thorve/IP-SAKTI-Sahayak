/**
 * Comprehensive IP-SAKTI Sahayak Frontend Test Suite
 */

import assert from 'node:assert';
import { resolveApiUrl, ApiError } from '../src/api/client.js';
import { normalizeChatResponse, sendChatMessage } from '../src/api/chat.js';
import { loginAsGuest, login, signup, requestPasswordReset } from '../src/api/auth.js';
import { SUPPORTED_LANGUAGES } from '../src/constants/languages.js';

console.log('🧪 Starting Comprehensive IP-SAKTI Sahayak Verification Test Suite...\n');

let passedTests = 0;
let failedTests = 0;

async function test(description, fn) {
  try {
    await fn();
    console.log(`  ✅ PASS: ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${description}`);
    console.error(`     Error: ${err.message}`);
    failedTests++;
  }
}

async function runAll() {
  // 1. URL Resolution & Android Configuration
  await test('URL resolution handles base without /api and endpoint with /chat', () => {
    const url = resolveApiUrl('/chat');
    assert(url.includes('/chat'), `Expected URL to include /chat, got ${url}`);
  });

  await test('URL resolution handles /api endpoints cleanly without duplicate /api/api', () => {
    const url = resolveApiUrl('/api/chat');
    assert(!url.includes('/api/api'), `URL must not contain /api/api, got ${url}`);
  });

  // 2. ApiError Normalization for HTTP Status Codes
  await test('ApiError sets correct properties for 400 INVALID_REQUEST', () => {
    const err = new ApiError(400, 'INVALID_REQUEST', 'Invalid request body');
    assert.strictEqual(err.status, 400);
    assert.strictEqual(err.code, 'INVALID_REQUEST');
  });

  await test('ApiError sets correct properties for 401 UNAUTHORIZED', () => {
    const err = new ApiError(401, 'UNAUTHORIZED', 'Session expired');
    assert.strictEqual(err.status, 401);
    assert.strictEqual(err.code, 'UNAUTHORIZED');
  });

  await test('ApiError sets correct properties for 500 INTERNAL_ERROR', () => {
    const err = new ApiError(500, 'INTERNAL_ERROR', 'Internal server error');
    assert.strictEqual(err.status, 500);
    assert.strictEqual(err.code, 'INTERNAL_ERROR');
  });

  await test('ApiError sets correct properties for 503 RAG Unavailable', () => {
    const err = new ApiError(503, 'RAG_UNAVAILABLE', 'Knowledge service is unavailable');
    assert.strictEqual(err.status, 503);
    assert.strictEqual(err.code, 'RAG_UNAVAILABLE');
    assert.strictEqual(err.isBackendUnavailable, true);
  });

  await test('ApiError handles network disconnection (status 0)', () => {
    const err = new ApiError(0, 'BACKEND_UNAVAILABLE', 'Backend unavailable');
    assert.strictEqual(err.status, 0);
    assert.strictEqual(err.isBackendUnavailable, true);
  });

  // 3. Chat Response Contract - Sources & Grounding
  await test('Chat normalizer never invents fake sources when sources is empty', () => {
    const raw = {
      answer: 'Patent applications are governed by Section 7.',
      language: 'mr',
      session_id: 'sess_123',
      message_id: 'msg_001',
      grounded: true,
      sources: []
    };

    const normalized = normalizeChatResponse(raw);
    assert.strictEqual(normalized.answer, raw.answer);
    assert.strictEqual(normalized.grounded, true);
    assert.strictEqual(normalized.session_id, 'sess_123');
    assert.strictEqual(normalized.citations.length, 0, 'Citations array must be empty');
  });

  await test('Chat normalizer correctly maps real backend sources to citation format', () => {
    const raw = {
      answer: 'Here is information on Trademark filing.',
      language: 'en',
      session_id: 'sess_tm',
      grounded: true,
      sources: [
        {
          title: 'Trade Marks Act 1999',
          page: 45,
          section: 'Section 9',
          url: 'https://ipindia.gov.in/tm.htm',
          snippet: 'Absolute grounds for refusal of registration.',
          score: 0.92,
          is_sample: false
        }
      ]
    };

    const normalized = normalizeChatResponse(raw);
    assert.strictEqual(normalized.citations.length, 1);
    const c = normalized.citations[0];
    assert.strictEqual(c.document_title, 'Trade Marks Act 1999');
    assert.strictEqual(c.page_number, 45);
    assert.strictEqual(c.section, 'Section 9');
    assert.strictEqual(c.source_url, 'https://ipindia.gov.in/tm.htm');
    assert.strictEqual(c.relevance_score, 0.92);
    assert.strictEqual(c.is_sample_document, false);
  });

  await test('Chat normalizer preserves grounded: false state', () => {
    const raw = {
      answer: 'General guidance without strong citations.',
      grounded: false,
      sources: []
    };
    const normalized = normalizeChatResponse(raw);
    assert.strictEqual(normalized.grounded, false);
  });

  // 4. Input Validation & Error Handling
  await test('sendChatMessage rejects empty queries with clear error', async () => {
    try {
      await sendChatMessage({ message: '   ' });
      assert.fail('Should have thrown an error for empty message');
    } catch (err) {
      assert(err.message.includes('cannot be empty'));
    }
  });

  // 5. Language Support
  await test('Supported languages include en, mr, and hi', () => {
    const codes = SUPPORTED_LANGUAGES.map(l => l.code);
    assert(codes.includes('en'), 'Must support en');
    assert(codes.includes('mr'), 'Must support mr (Marathi)');
    assert(codes.includes('hi'), 'Must support hi (Hindi)');
  });

  // 6. Auth API Validation & Guest Evaluation
  await test('login rejects missing identifier or password without hitting network', async () => {
    try {
      await login({ identifier: '', password: '' });
      assert.fail('Should have failed validation');
    } catch (err) {
      assert(err.message.includes('enter both'));
    }
  });

  await test('signup rejects missing fields without hitting network', async () => {
    try {
      await signup({ name: '', email: '', mobile: '', password: '' });
      assert.fail('Should have failed validation');
    } catch (err) {
      assert(err.message.includes('fill in all required'));
    }
  });

  await test('requestPasswordReset rejects empty identifier', async () => {
    try {
      await requestPasswordReset({ identifier: '' });
      assert.fail('Should have failed validation');
    } catch (err) {
      assert(err.message.includes('registered email'));
    }
  });

  await test('loginAsGuest creates safe research evaluator profile without fake credentials', () => {
    const guest = loginAsGuest();
    assert(guest.isGuest === true, 'isGuest must be true');
    assert(guest.name.includes('Evaluator'), 'Name must reflect evaluator');
    assert(guest.email.includes('ip-sakti.gov.in'), 'Email must be in government domain');
  });

  console.log(`\n=============================================`);
  console.log(`Summary: ${passedTests} passed, ${failedTests} failed.`);
  console.log(`=============================================\n`);

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAll();
