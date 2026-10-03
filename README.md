# DecideForMe: AI-Powered Intelligent Decision & Planning Assistant

**DecideForMe** is a fullstack web application that helps users make complex decisions by asking personalized follow-up questions, narrowing down options, and providing well-reasoned recommendations based on constraints and budget.

🔗 **[Live Demo](https://decide-for-me-frontend.onrender.com)** (Replace with your frontend Render URL)

## ✨ Features
- **Conversational AI:** Uses natural language processing to understand user situations.
- **Smart Follow-up Questions:** The AI asks for missing information (budget, preferences, constraints) before making a recommendation.
- **Personalized Recommendations:** Compares options based on the user's unique priorities.
- **Modern UI:** A clean, responsive chat interface built with React and TypeScript.

## 🧰 Tech Stack

**Frontend:**
- React (with TypeScript)
- Axios (for API communication)
- CSS3

**Backend:**
- Python 3
- FastAPI (REST API framework)
- Uvicorn (ASGI server)
- OpenAI Python SDK (integrated with OpenRouter)

**AI & Deployment:**
- OpenRouter API (Free tier)
- Render.com (Frontend Static Site & Backend Web Service)

## 🏗️ How It Works
1. The user opens the React frontend and describes a decision they need to make.
2. The frontend sends the chat history to the FastAPI backend via Axios.
3. The backend forwards the conversation to the OpenRouter LLM with a custom system prompt instructing it to act as a decision-making assistant.
4. The AI asks clarifying questions and eventually provides a structured recommendation.
5. The response is sent back to the frontend and displayed in the chat interface.

## 🚀 Running Locally

### 1. Clone the repository
```bash
git clone https://github.com/Meridiaa/Deciderr.git
cd Deciderr