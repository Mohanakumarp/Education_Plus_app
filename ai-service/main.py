from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import nltk
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer
from sumy.nlp.stemmers import Stemmer
from sumy.utils import get_stop_words

app = FastAPI()

import random

# Ensure NLTK data is available
try:
    nltk.data.find("tokenizers/punkt")
except LookupError:
    nltk.download("punkt")
    try:
        nltk.download("punkt_tab")
    except:
        pass

try:
    nltk.data.find("taggers/averaged_perceptron_tagger")
except LookupError:
    nltk.download("averaged_perceptron_tagger")
    try:
        nltk.download("averaged_perceptron_tagger_eng")
    except:
        pass


class NoteRequest(BaseModel):
    text: str
    sentences_count: int = 5
    language: str = "english"


@app.get("/")
def read_root():
    return {"message": "Education Plus AI Service is Running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/summarize")
def summarize_note(request: NoteRequest):
    try:
        if not request.text.strip():
            return {"summary": ""}

        parser = PlaintextParser.from_string(request.text, Tokenizer(request.language))
        stemmer = Stemmer(request.language)
        summarizer = LsaSummarizer(stemmer)
        summarizer.stop_words = get_stop_words(request.language)

        summary = summarizer(parser.document, request.sentences_count)
        result = " ".join([str(sentence) for sentence in summary])

        return {"summary": result}
    except Exception as e:
        # Fallback or error
        print(f"Summarization error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/quiz")
def generate_quiz(request: NoteRequest):
    try:
        if not request.text.strip():
            return {"quiz": []}

        parser = PlaintextParser.from_string(request.text, Tokenizer(request.language))
        stemmer = Stemmer(request.language)
        summarizer = LsaSummarizer(stemmer)
        summarizer.stop_words = get_stop_words(request.language)

        # Get key sentences
        sentences = summarizer(parser.document, 10)

        quiz = []
        for sentence in sentences:
            str_sent = str(sentence)
            tokens = nltk.word_tokenize(str_sent)
            tagged = nltk.pos_tag(tokens)

            # Find nouns (NN, NNS, NNP)
            nouns = [
                word for word, tag in tagged if tag.startswith("NN") and len(word) > 3
            ]

            if nouns:
                answer = random.choice(nouns)
                # Simple replace (case insensitive would be better but keep it simple)
                question = str_sent.replace(answer, "______")

                quiz.append({"question": question, "answer": answer})

        return {"quiz": quiz}
    except Exception as e:
        print(f"Quiz error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
