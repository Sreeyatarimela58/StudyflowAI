# 🧠 StudyFlow AI

StudyFlow AI is an intelligent, modern study assistant designed to transform your notes and documents into highly structured, interactive learning sessions. It dynamically generates comprehensive summaries, targeted AI recommendations, interactive flashcards, and adaptive quizzes (Multiple Choice & True/False) to help you lock in knowledge faster.

## 🚀 Setup & Usage

To run this project locally, simply run these commands from the root directory:

```bash
# Install dependencies for both backend and frontend
npm install

# Start both the backend and frontend servers simultaneously
npm start
```
*Note: The frontend will run on `http://localhost:5173` and the backend on `http://localhost:3001`.*

### Environment Variables
You will need a Groq API key to power the AI features. Create a `.env` file in the `backend/` directory:
```
GROQ_API_KEY=your_api_key_here
```

## 🤖 AI Usage Note
Throughout this project, I utilized AI assistants (specifically Google's advanced coding assistant) to help me:
1. **Accelerate Styling:** Rapidly build and style React components using Tailwind CSS to achieve a premium, modern dark/light mode UI.
2. **Backend Prompts:** Iterate on the Groq LLM prompts in the backend to ensure the JSON outputs for quizzes and flashcards were consistently structured and accurate.
3. **Debugging:** Quickly resolve React state bugs (like timer unmounts) and handle asynchronous data flows effectively.

The core logic, component architecture, and design decisions were guided and structured by me to create a cohesive learning tool.

## 🚧 Limitations
- **File Parsing:** Currently, PDF parsing is handled on the client side. Very large PDFs may cause browser performance issues or hit the Groq LLM token limits during generation.
- **Session Persistence:** Study sessions are saved locally using `localStorage`. If you clear your browser cache or switch devices, your history will not carry over. (A future update could integrate a database like MongoDB or Firebase).
- **Static API:** The AI relies entirely on the provided text. It cannot search the live web for additional context if the provided notes are too sparse.

## ⏱️ Time Spent
- **Planning & Architecture:** ~2 hours
- **Frontend (UI/UX, Tailwind, State Management):** ~5 hours
- **Backend (API, LLM Prompt Engineering):** ~3 hours
- **Testing, Debugging & Refinement:** ~2 hours
- **Total:** ~12 hours
