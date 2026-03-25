#!/bin/bash

# Real-Time Audio Transcription - Complete Setup Script
# This script sets up and runs the entire system

echo "🎤 Real-Time Audio Transcription Setup"
echo "======================================"
echo ""

# Check if running on Windows
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    IS_WINDOWS=true
else
    IS_WINDOWS=false
fi

# Step 1: AI Service Setup
echo "📦 Step 1: Setting up AI Service..."
cd ai-service

if [ "$IS_WINDOWS" = true ]; then
    if [ ! -d "venv" ]; then
        echo "  Creating virtual environment..."
        python -m venv venv
    fi
    echo "  Activating virtual environment..."
    source venv/Scripts/activate
else
    if [ ! -d "venv" ]; then
        echo "  Creating virtual environment..."
        python3 -m venv venv
    fi
    echo "  Activating virtual environment..."
    source venv/bin/activate
fi

echo "  Installing dependencies..."
pip install -r requirements.txt

cd ..

# Step 2: Start AI Service in background
echo ""
echo "🚀 Step 2: Starting AI Service..."
if [ "$IS_WINDOWS" = true ]; then
    start cmd /k "cd ai-service && venv\Scripts\activate && uvicorn main:app --reload --port 8000 --host 0.0.0.0"
else
    cd ai-service
    source venv/bin/activate
    uvicorn main:app --reload --port 8000 --host 0.0.0.0 &
    AI_PID=$!
    cd ..
fi

echo "  ✅ AI Service started on http://localhost:8000"
echo "  📡 WebSocket endpoint: ws://localhost:8000/ws/transcribe"

# Step 3: Start Frontend
echo ""
echo "🌐 Step 3: Starting Frontend..."
cd frontend

if command -v npm &> /dev/null; then
    echo "  Installing frontend dependencies..."
    npm install
    echo ""
    echo "  Starting dev server..."
    npm run dev
else
    echo "  ❌ npm not found. Please ensure Node.js is installed."
    exit 1
fi
