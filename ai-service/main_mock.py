"""
FastAPI WebSocket server - Lightweight version with mock transcription
Use this while resolving dependency issues
For production, use faster-whisper or openai-whisper once dependencies are resolved
"""

from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json

app = FastAPI(title="Audio Transcription Service (Mock)")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TranscriptionSession:
    """Simple session manager"""
    
    def __init__(self):
        self.audio_chunks = 0
        
    def add_chunk(self):
        self.audio_chunks += 1
    
    def reset(self):
        self.audio_chunks = 0


@app.websocket("/ws/transcribe")
async def websocket_transcribe(websocket: WebSocket):
    """WebSocket endpoint - mock transcription for testing"""
    await websocket.accept()
    session = TranscriptionSession()
    
    try:
        while True:
            data = await websocket.receive()
            
            if "text" in data:
                message = json.loads(data["text"])
                
                if message.get("type") == "end_stream":
                    print(f"✅ Received {session.audio_chunks} audio chunks")
                    
                    # Mock transcription - replace with real Whisper once dependencies work
                    mock_text = f"Mock transcription from {session.audio_chunks} audio chunks"
                    
                    await websocket.send_json({
                        "text": mock_text,
                        "complete": True,
                    })
                    
                    session.reset()
                    
            elif "bytes" in data:
                session.add_chunk()
                
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close()


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "mode": "mock",
        "message": "Mock transcription service - real Whisper coming soon"
    }


@app.on_event("startup")
async def startup_event():
    print("=" * 60)
    print("⚠️  MOCK TRANSCRIPTION SERVICE STARTED")
    print("=" * 60)
    print("📡 WebSocket: ws://localhost:8000/ws/transcribe")
    print("")
    print("⚡ This is a MOCK service for testing the WebSocket connection.")
    print("   It will accept audio chunks and return placeholder text.")
    print("")
    print("To enable real Whisper transcription:")
    print("1. Resolve dependency issues in requirements.txt")
    print("2. Uncomment faster-whisper code in main.py")
    print("3. Restart service")
    print("=" * 60)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)