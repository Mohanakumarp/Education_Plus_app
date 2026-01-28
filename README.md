# Education Plus

A comprehensive educational platform built with Next.js 16 (Frontend) and Python FastAPI (AI Service).

## Setup Instructions

### 1. Database Setup
Create a MongoDB Atlas account and get your connection string.

### 2. Frontend Setup
```bash
cd frontend
cp .env.local.example .env.local
# Edit .env.local and add your MONGODB_URI and AUTH_SECRET
bun install
bun dev
```

### 3. AI Service Setup
```bash
cd ai-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Features Implemented
*   **Auth**: Login/Register (Credentials).
*   **Profile**: Manage user details.
*   **Subjects**: Create and manage subjects.
*   **Notes**: Rich text editor with auto-save.
*   **AI**: 
    *   Summarization (using Sumy/LSA).
    *   Quiz Generation (using NLTK).

## Functional Requirements Status
See `TODO.md` for detailed progress.
