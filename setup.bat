@echo off
REM Real-Time Audio Transcription - Complete Setup for Windows
REM This batch script sets up and runs the entire system

echo.
echo ========================================
echo 🎤 Real-Time Audio Transcription Setup
echo ========================================
echo.

REM Step 1: AI Service Setup
echo 📦 Step 1: Setting up AI Service...
cd /d ai-service

if not exist "venv" (
    echo   Creating virtual environment...
    python -m venv venv
)

echo   Activating virtual environment and installing dependencies...
call venv\Scripts\activate.bat

pip install -r requirements.txt

cd ..

REM Step 2: Start AI Service
echo.
echo 🚀 Step 2: Starting AI Service in new window...
start "AI Service" cmd /k "cd ai-service && call venv\Scripts\activate.bat && uvicorn main:app --reload --port 8000 --host 0.0.0.0"

echo   ✅ AI Service started
echo   📡 WebSocket endpoint: ws://localhost:8000/ws/transcribe
echo   ⏳ Waiting 3 seconds for service to start...
timeout /t 3 /nobreak

REM Step 3: Start Frontend
echo.
echo 🌐 Step 3: Starting Frontend...
cd /d frontend

if not exist "node_modules" (
    echo   Installing frontend dependencies...
    call npm install
)

echo.
echo   Starting dev server...
call npm run dev

pause
