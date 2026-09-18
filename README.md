# AI Learning Agent

An AI-powered learning and interview preparation platform that helps users learn from their own study materials, generate quizzes, practice interviews, evaluate answers, and track their learning progress.

The application combines **RAG (Retrieval-Augmented Generation)**, **LLMs**, multiple AI agents, authentication, progress tracking, usage tracking, and a modern **React + FastAPI** architecture.

---

## 🚀 Features

### 📚 AI Tutor
Ask questions about uploaded study materials.

- PDF, DOCX and TXT document support
- RAG-based question answering
- User-specific document retrieval
- Conversational context
- Answers grounded in uploaded study material

### 🧠 AI Quiz Generator
Generate quizzes from your study material.

- Automatic question generation
- Multiple questions per topic
- Score calculation
- Progress tracking

### 🎤 AI Interview Agent
Practice technical interviews with an AI interviewer.

- AI-generated interview questions
- Interactive answer submission
- Interview evaluation
- Score tracking

### 📝 Answer Evaluation
Evaluate technical answers using an LLM.

- Answer analysis
- Score generation
- Feedback
- Improvement suggestions
- Evaluation history

### 🗺️ Learning Planner
Generate a personalized learning plan based on previous learning activity and progress.

### 📊 Progress Dashboard
Track learning performance through:

- Average score
- Completed activities
- Topics studied
- Quiz performance
- Interview performance
- Recent activities

### 📄 Document Management

Users can:

- Upload documents
- View uploaded documents
- Delete documents
- Store documents per user

Supported formats:

- PDF
- DOCX
- TXT

### 🔐 Authentication

Secure user authentication using:

- User registration
- Login
- Password hashing
- JWT authentication
- Protected API endpoints
- User-specific data isolation

### 📈 Usage Tracking

Track LLM usage for each user:

- Input tokens
- Output tokens
- Total tokens
- API requests
- Feature-wise usage

### 🛡️ Rate Limiting

AI endpoints include request limits to prevent excessive API usage.

Example limits:

| Feature | Limit |
|---|---:|
| Tutor | 20 requests/min |
| Quiz | 10 requests/min |
| Interview | 15 requests/min |
| Evaluation | 20 requests/min |
| Document Upload | 10 requests/min |

### 🐳 Docker Support

The application can run using Docker Compose.

Architecture:

```text
React Frontend
      │
      ▼
   FastAPI
      │
      ├── AI Agents
      ├── RAG Pipeline
      ├── Authentication
      ├── Progress Tracking
      └── Usage Tracking
      │
      ▼
   ChromaDB
      │
      ▼
  Groq LLM