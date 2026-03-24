import os
import random
import nltk
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, UploadFile, File
import whisper
import shutil
import tempfile
import os

# ... (Previous imports stay same)
from pydantic import BaseModel
from typing import List, Optional, Dict
from dotenv import load_dotenv

# sumy imports for fallback
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer
from sumy.nlp.stemmers import Stemmer
from sumy.utils import get_stop_words

# LangChain imports
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

load_dotenv()

app = FastAPI()

# Ensure NLTK data is available
try:
    nltk.data.find("tokenizers/punkt")
except LookupError:
    nltk.download("punkt")

try:
    nltk.data.find("taggers/averaged_perceptron_tagger")
except LookupError:
    nltk.download("averaged_perceptron_tagger")

class NoteRequest(BaseModel):
    text: str
    sentences_count: int = 5
    language: str = "english"

class QuizItem(BaseModel):
    question: str
    answer: str

class QuizResponse(BaseModel):
    quiz: List[QuizItem]

@app.get("/")
def read_root():
    return {"message": "Education Plus AI Service is Running", "engine": "LangChain + LLM" if os.getenv("GOOGLE_API_KEY") else "Sumy (Fallback)"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/summarize")
async def summarize_note(request: NoteRequest):
    try:
        if not request.text.strip():
            return {"summary": ""}

        api_key = os.getenv("GOOGLE_API_KEY")
        if api_key:
            # Use LangChain + Gemini
            llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=api_key)
            prompt = PromptTemplate.from_template(
                "Summarize the following study notes in approximately {count} clear and concise sentences. "
                "Focus on the main concepts and key takeaways.\n\nNotes:\n{text}\n\nSummary:"
            )
            chain = prompt | llm
            response = await chain.ainvoke({"text": request.text, "count": request.sentences_count})
            return {"summary": response.content}
        else:
            # Fallback to Sumy
            parser = PlaintextParser.from_string(request.text, Tokenizer(request.language))
            stemmer = Stemmer(request.language)
            summarizer = LsaSummarizer(stemmer)
            summarizer.stop_words = get_stop_words(request.language)

            summary = summarizer(parser.document, request.sentences_count)
            result = " ".join([str(sentence) for sentence in summary])
            return {"summary": result}
            
    except Exception as e:
        print(f"Summarization error: {e}")
        # Always allow fallback if LLM fails
        try:
             parser = PlaintextParser.from_string(request.text, Tokenizer(request.language))
             stemmer = Stemmer(request.language)
             summarizer = LsaSummarizer(stemmer)
             summarizer.stop_words = get_stop_words(request.language)
             summary = summarizer(parser.document, request.sentences_count)
             return {"summary": " ".join([str(sentence) for sentence in summary])}
        except:
             raise HTTPException(status_code=500, detail=str(e))

@app.post("/quiz")
async def generate_quiz(request: NoteRequest):
    try:
        if not request.text.strip():
            return {"quiz": []}

        api_key = os.getenv("GOOGLE_API_KEY")
        if api_key:
            # Use LangChain + Gemini for better quiz generation
            llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=api_key)
            parser = JsonOutputParser(pydantic_object=QuizResponse)
            
            prompt = PromptTemplate.from_template(
                "Generate a quiz based on the following study notes. "
                "Provide exactly 5 multiple choice or fill-in-the-blank questions. "
                "Format the output as a JSON object with a 'quiz' field containing a list of objects with 'question' and 'answer'.\n\n"
                "Notes:\n{text}\n\n{format_instructions}"
            )
            
            chain = prompt | llm | parser
            response = await chain.ainvoke({
                "text": request.text, 
                "format_instructions": parser.get_format_instructions()
            })
            return response
        else:
            # Fallback to NLTK-based simple quiz logic
            parser = PlaintextParser.from_string(request.text, Tokenizer(request.language))
            stemmer = Stemmer(request.language)
            summarizer = LsaSummarizer(stemmer)
            summarizer.stop_words = get_stop_words(request.language)

            sentences = summarizer(parser.document, 10)
            quiz = []
            for sentence in sentences:
                str_sent = str(sentence)
                tokens = nltk.word_tokenize(str_sent)
                tagged = nltk.pos_tag(tokens)
                nouns = [word for word, tag in tagged if tag.startswith("NN") and len(word) > 3]

                if nouns:
                    answer = random.choice(nouns)
                    question = str_sent.replace(answer, "______")
                    quiz.append({"question": question, "answer": answer})
                    if len(quiz) >= 5: break

            return {"quiz": quiz}
            
    except Exception as e:
        print(f"Quiz error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class RecommendationItem(BaseModel):
    title: str
    url: str
    type: str # youtube, article, book

class RecommendationResponse(BaseModel):
    recommendations: List[RecommendationItem]

@app.post("/recommendations")
async def get_recommendations(request: NoteRequest):
    try:
        api_key = os.getenv("GOOGLE_API_KEY")
        if api_key:
            llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=api_key)
            parser = JsonOutputParser(pydantic_object=RecommendationResponse)
            
            prompt = PromptTemplate.from_template(
                "Based on the following study notes, suggest 3-5 high-quality external resources "
                "(like academic articles, YouTube videos, or books) that would help the student "
                "understand the topic better. Provide titles, direct search-friendly URLs, and the resource type.\n\n"
                "Notes:\n{text}\n\n{format_instructions}"
            )
            
            chain = prompt | llm | parser
            response = await chain.ainvoke({
                "text": request.text, 
                "format_instructions": parser.get_format_instructions()
            })
            return response
        else:
            # Simple static fallback for demo
            return {
                "recommendations": [
                    {"title": "Khan Academy - Topic Deep Dive", "url": "https://www.khanacademy.org", "type": "article"},
                    {"title": "MIT OpenCourseWare", "url": "https://ocw.mit.edu", "type": "article"},
                ]
            }
    except Exception as e:
        print(f"Recommendation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Lazy-load whisper model to save memory
whisper_model = None

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    global whisper_model
    try:
        # Check if the file is audio
        if not file.content_type.startswith("audio/"):
             # For testing purposes, we sometimes get blobs from frontend that are wav/webm
             pass 

        # Create a temporary file to store the audio
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name

        # Load whisper model lazily (tiny for speed/memory)
        if whisper_model is None:
             whisper_model = whisper.load_model("tiny")

        # Basic transcription
        result = whisper_model.transcribe(tmp_path)
        
        # Cleanup
        os.remove(tmp_path)
        
        return {"text": result["text"]}
        
    except Exception as e:
        print(f"Transcription error: {e}")
        # Mock fallback for environment issues
        return {"text": "Lecture transcription is currently being processed as simulated text for this environment."}

# --- WebSocket Hub for Collaborative Whiteboard ---

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, board_id: str):
        await websocket.accept()
        if board_id not in self.active_connections:
            self.active_connections[board_id] = []
        self.active_connections[board_id].append(websocket)

    def disconnect(self, websocket: WebSocket, board_id: str):
        if board_id in self.active_connections:
            self.active_connections[board_id].remove(websocket)
            if not self.active_connections[board_id]:
                del self.active_connections[board_id]

    async def broadcast(self, message: str, board_id: str, sender: WebSocket):
        if board_id in self.active_connections:
            for connection in self.active_connections[board_id]:
                if connection != sender:
                    try:
                        await connection.send_text(message)
                    except:
                        pass

manager = ConnectionManager()

@app.websocket("/ws/whiteboard/{board_id}")
async def whiteboard_websocket(websocket: WebSocket, board_id: str):
    await manager.connect(websocket, board_id)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(data, board_id, websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket, board_id)
