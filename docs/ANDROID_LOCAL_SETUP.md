# IP-SAKTI Sahayak: Android Local Development & Backend Integration Guide

This guide details how to run and test the IP-SAKTI Sahayak application on physical Android devices, Android emulators, and local web browsers during backend integration.

---

## 1. Network Architecture

When testing on an Android device or emulator, `http://localhost:8000` refers to the Android device itself, **NOT** your developer workstation. To connect the mobile frontend to the FastAPI backend, requests must route over your local network:

```
┌─────────────────────────────────┐
│ Android Device (Phone / Tablet) │
│ (Connected to Wi-Fi)            │
└────────────────┬────────────────┘
                 │
                 │ HTTP requests to http://<LAPTOP_LOCAL_IP>:8000/api
                 ▼
┌─────────────────────────────────┐
│ Developer Laptop                │
│ (FastAPI listening on 0.0.0.0)  │
│ ├── FastAPI Gateway (:8000)     │
│ └── IP-SAKTI RAG Service        │
└────────────────┬────────────────┘
                 │
                 │ (Internal Server-Side Only)
                 ▼
┌─────────────────────────────────┐
│ NVIDIA RAG / Vector Engine      │
│ (Keys NEVER present on phone)   │
└─────────────────────────────────┘
```

---

## 2. Step-by-Step Local Setup

### Step A: Find Your Laptop's Local IP Address

On Windows:
```powershell
ipconfig
```
Look for **IPv4 Address** under your active Wi-Fi or Ethernet adapter (e.g., `192.168.1.45`).

On macOS / Linux:
```bash
ifconfig | grep "inet "
# or
ip a
```

---

### Step B: Configure the Frontend

You have two convenient ways to set the API Gateway URL:

#### Method 1: Via `.env` (Recommended for Builds)
Open [`.env`](file:///.env) in the frontend root:
```env
# For local web browser testing:
VITE_API_BASE_URL=http://localhost:8000/api

# For physical Android phone on the same Wi-Fi:
# VITE_API_BASE_URL=http://192.168.1.45:8000/api

# For Android Studio Emulator (AVD):
# VITE_API_BASE_URL=http://10.0.2.2:8000/api

VITE_USE_MOCK_API=false
```

#### Method 2: Runtime UI Configuration (Instant, No Rebuild Needed)
1. Open the app in your browser or phone.
2. Tap the **`Live API / Mock RAG`** status pill in the top header.
3. In the **Backend Gateway URL** field, enter your laptop's IP address (e.g. `http://192.168.1.45:8000/api`).
4. Tap **Save Configuration**. The change is persisted in device storage immediately.

---

### Step C: Start the FastAPI Backend

Ensure FastAPI listens on `0.0.0.0` (all network interfaces), rather than `127.0.0.1`:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### CORS Configuration
Make sure FastAPI permits requests from the mobile client:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend origin / Capacitor scheme
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### Windows Firewall
If your phone cannot reach `http://<LAPTOP_LOCAL_IP>:8000/api/health`:
1. Check that both the phone and laptop are on the same Wi-Fi network.
2. In Windows Defender Firewall, allow incoming TCP traffic on port 8000 for Private Networks.

---

## 3. Backend API Contract Summary

All requests from the frontend client flow through these endpoints:

### Chat Request
- **Endpoint**: `POST /api/chat`
- **Payload**:
  ```json
  {
    "message": "पेटंट अर्जासाठी कोणती कागदपत्रे लागतील?",
    "session_id": "session_1740000000",
    "language": "mr"
  }
  ```

### Chat Response
- **Expected Structure**:
  ```json
  {
    "answer": "पेटंट अर्जासाठी आवश्यक कागदपत्रे...",
    "language": "mr",
    "session_id": "session_1740000000",
    "message_id": "msg_001",
    "grounded": true,
    "sources": [
      {
        "title": "Indian Patents Act 1970",
        "page": 12,
        "section": "Section 7",
        "url": "https://ipindia.gov.in/...",
        "snippet": "Every application for a patent shall be for one invention only...",
        "score": 0.89,
        "is_sample": false
      }
    ]
  }
  ```

### Health Check
- **Endpoint**: `GET /api/health`
- **Response**: `{"status": "ok"}`

### Sessions
- **Endpoints**: `GET /api/sessions`, `POST /api/sessions`, `DELETE /api/sessions/{id}`

---

## 4. Security Reminders

1. **Never commit `.env` with private credentials.**
2. **Never place Supabase service keys or NVIDIA API keys in the frontend bundle.**
3. **The frontend client only communicates with the public FastAPI backend.**
