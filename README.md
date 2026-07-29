# 🧠 StudyFlow AI

**StudyFlow AI** is an intelligent, modern educational platform designed to transform static notes and documents into highly structured, interactive learning experiences. It dynamically generates comprehensive summaries, targeted AI recommendations, interactive flashcards, and adaptive, timed quizzes to accelerate knowledge retention.

---

## ✨ Key Features
- **Dynamic Quiz Engine**: Test your knowledge with dynamically generated Multiple Choice and True/False questions, complete with a countdown timer and instant AI-driven explanations.
- **Smart Summarization**: Automatically extracts core concepts into a clean, side-by-side Comprehensive Summary and Key Takeaways layout.
- **Interactive Flashcards**: Seamlessly lock in terminology with beautiful, responsive flashcards.
- **Premium UI/UX**: Fully responsive, fluid design supporting seamlessly transitionable Light and Dark modes.

---

## 🚀 Setup & Installation

To run this project locally, simply execute the following commands from the root directory:

```bash
# Install dependencies for both the backend and frontend
npm install

# Boot up both the backend and frontend servers concurrently
npm start
```
*Note: The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3001`.*

### Environment Variables
This application utilizes Groq's LLM engine to power its AI features. You must provide an API key. 
Create a `.env` file in the `backend/` directory:
```env
GROQ_API_KEY=your_groq_api_key_here
```

---

## 🤖 AI Usage Note

Honesty and transparency are core to my development process. Throughout the creation of this project, I leveraged AI assistants (specifically Google's advanced coding assistant) to accelerate delivery. I used AI for:
1. **Styling & Scaffolding:** Rapidly scaffolding React components and applying Tailwind CSS utility classes to achieve a polished, modern aesthetic.
2. **Prompt Engineering:** Iterating on the Groq LLM system prompts in the Node.js backend to ensure the JSON outputs for the dynamic quizzes and flashcards were consistently structured.
3. **Targeted Debugging:** Quickly diagnosing and resolving React state discrepancies (such as timer unmounting issues) and handling asynchronous data flows.

All core component architecture, system design, feature scoping, and business logic decisions were driven entirely by me to ensure a robust and cohesive product.

---

## 🚧 Current Limitations
- **Client-Side Parsing:** PDF extraction is currently handled on the client side. Very large documents may cause browser performance issues or hit the Groq LLM token limits during generation.
- **Session Persistence:** Study sessions are currently saved locally using `localStorage`. If a user clears their browser cache or switches devices, their history will not persist.
- **Static Knowledge Scope:** The AI relies exclusively on the provided text. It does not search the live web for additional context if the provided notes are too sparse.

---

## ⏱️ Estimated Time Spent
- **Planning, Architecture, & Design System:** ~1.5 hours
- **Frontend (UI/UX, Tailwind, State Management):** ~3.0 hours
- **Backend (Express API, LLM Integration):** ~2.0 hours
- **Testing, Debugging, & Polish:** ~1.5 hours
- **Total Time Spent:** ~8 hours
