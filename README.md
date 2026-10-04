# IP-SAKTI Sahayak (Frontend)

Multilingual AI Knowledge and Regulatory Assistant for Intellectual Property (Patents, Trademarks, Copyright, Designs, Geographical Indications, BIS/Toy Standards, and AYUSH Traditional Knowledge).

Target Architecture:
```
Frontend / Android App
        ↓
     FastAPI Backend (:8000)
        ↓
     RAG Service
        ↓
   NVIDIA RAG
        ↓
Answer + Verified Sources
```

---

## Key Features

- **Civic / Legal-Tech Design System**: Premium accessible UI tailored for regulatory clarity, mobile touch readiness, and dark theme consistency.
- **Multilingual Support**: First-class support for English (`en`), Marathi (`mr`), and Hindi (`hi`).
- **Clean Authentication Layer**:
  - Professional Login / Registration / Password Reset views.
  - Clear service abstraction (`src/api/auth.js`) connecting to backend auth endpoints.
  - Dedicated Research Evaluator (Guest Access) mode for instant prototype testing without hardcoding fake credentials.
- **Centralized API Client (`src/api/client.js`)**:
  - Handles JSON requests, common headers, timeouts (30s), auth token persistence, and standardized error parsing (400, 401, 403, 404, 500, 503).
  - Dynamic runtime base URL configuration for seamless testing across physical Android devices over Wi-Fi.
- **Backend Chat Integration (`POST /api/chat`)**:
  - Adheres strictly to backend contract: `{ message, session_id, language }`.
  - Normalizes real citations from backend responses without inventing fake sources.
  - Grounded / ungrounded indicators with statutory context notices.
- **Session Management**:
  - Active session ID handling, New Chat, session switching, and message loading.
  - Resilient synchronization between backend sessions API and local storage cache.
- **Android Local Development Ready**:
  - Mobile-first responsive UI.
  - Full instructions in [`docs/ANDROID_LOCAL_SETUP.md`](docs/ANDROID_LOCAL_SETUP.md).

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Default configuration connects to your live FastAPI backend:
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK_API=false
```

For Android device testing on local Wi-Fi, change `VITE_API_BASE_URL` to your laptop's IP address:
```env
VITE_API_BASE_URL=http://192.168.1.X:8000/api
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

### 5. Run Linter
```bash
npm run lint
```

---

## Security Boundaries

- **Zero Client Secrets**: NVIDIA API keys, Supabase service-role keys, vector database credentials, and RAG pipelines are strictly managed server-side.
- The frontend interacts exclusively with the public FastAPI gateway endpoints.
