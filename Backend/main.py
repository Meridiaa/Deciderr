import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
from typing import List

# Load environment variables (your API key)
load_dotenv()

# Initialize the FastAPI app
app = FastAPI()

# Configure CORS so your React frontend can talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the AI client, pointing to OpenRouter
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

# --- Data Models ---
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

# --- API Endpoints ---
@app.get("/")
def read_root():
    return {"message": "DecideForMe backend is running!"}

@app.post("/chat")
async def chat(request: ChatRequest):
    system_prompt = """
    You are DecideForMe, an intelligent decision-making assistant.
    Your goal is to help users make decisions by asking clarifying questions
    and providing reasoned recommendations.
    The user will describe their situation. Ask one relevant follow-up question
    at a time to better understand their needs, preferences, and constraints.
    Do not provide a final recommendation until you have asked at least 2-3 questions.
    Be conversational, empathetic, and helpful.
    """

    messages_for_ai = [{"role": "system", "content": system_prompt}]
    for msg in request.messages:
        messages_for_ai.append({"role": msg.role, "content": msg.content})

    try:
        response = client.chat.completions.create(
            model="openrouter/free",
            messages=messages_for_ai,
        )
        ai_reply = response.choices[0].message.content
        return {"reply": ai_reply}
    except Exception as e:
        return {"reply": f"Sorry, I encountered an error: {str(e)}"}