# Education Plus - Master Plan

## 1. Project Overview
Education Plus is a comprehensive educational platform integrating study management, note-taking, and AI-powered tools.
**Stack:** Next.js 16 (Frontend/Core), Python FastAPI (AI Microservice), MongoDB Atlas (Database).

## 2. Architecture
*   **Frontend**: Next.js App Router, React 19, TailwindCSS, Shadcn/UI.
*   **Core Backend**: Next.js Server Actions for CRUD (Auth, Profiles, Notes, Tasks).
*   **AI Microservice**: Python FastAPI server handling heavy compute tasks (Summarization, Transcription, Recommendations).
*   **Database**: MongoDB Atlas (Mongoose ODM).
*   **Storage**: GridFS or Cloud Storage for Audio/PDFs.

## 3. Theming ("Academic Clarity")
*   **Mode**: Light Mode focused.
*   **Colors**:
    *   Background: `Slate-50` (#f8fafc)
    *   Primary: `Indigo-600` (#4f46e5)
    *   Secondary: `Teal-500` (#14b8a6)
*   **Typography**: Inter or Plus Jakarta Sans.

## 4. Functional Requirements Implementation
| ID | Feature | Tech Implementation |
|----|---------|---------------------|
| FR-1 | Auth | NextAuth.js (Google/Credentials) |
| FR-2 | Profile | MongoDB User Schema |
| FR-3 | Subjects | Subject Schema + Relations |
| FR-4 | Notes | TipTap/Quill Editor + Auto-save |
| FR-5 | Summarization | Python API (HuggingFace Transformers) |
| FR-6 | Quiz Gen | Python API (NLP Question Generation) |
| FR-7 | Recommendations | Python API (Content-based Filtering) |
| FR-8 | PDF Export | jsPDF or Python ReportLab |
| FR-9 | Tasks | React DnD / Kanban Board |
| FR-10 | Weekly View | FullCalendar or Custom Grid |
| FR-11 | Study Tracker | Chart.js / Recharts |
| FR-12 | Pomodoro | React Client-side Timer |
| FR-13 | Audio/Transcript | MediaRecorder API -> Python Whisper |
| FR-14 | Whiteboard | HTML5 Canvas + Socket.io |
| FR-15 | Admin | Admin Role Middleware + Dashboard |
