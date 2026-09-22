
# 🤖 AI Learning Agent

A full-stack Generative AI learning and interview preparation platform built with **React, FastAPI, LangChain, Groq, Hugging Face, Qdrant, PostgreSQL, Supabase Storage, and Docker**.

## ✨ Features

- 🔐 JWT Authentication with PBKDF2 password hashing
- 📄 Upload PDF, TXT, DOCX documents
- 🧠 RAG-based AI Tutor using Qdrant
- 🤗 Hugging Face hosted embeddings (`all-MiniLM-L6-v2`, 384 dimensions)
- 🎤 AI Interview practice
- 📝 AI Quiz generator
- 📊 Answer evaluation
- 📅 Personalized learning planner
- 📈 Progress tracking
- 📉 LLM usage tracking
- ☁️ Supabase Storage for documents
- 🗄️ PostgreSQL for persistent data
- 🐳 Docker support

## 🏗 Architecture

Frontend (React + Tailwind) → FastAPI → Groq LLM

FastAPI also connects to:

- PostgreSQL (users, progress, usage, documents)
- Qdrant Cloud (vectors)
- Hugging Face (embeddings)
- Supabase Storage (files)

## 🛠 Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Lucide React

### Backend
- FastAPI
- Uvicorn
- LangChain
- Groq
- SlowAPI
- python-jose

### AI
- Groq LLM
- Hugging Face Embeddings
- Retrieval-Augmented Generation (RAG)

### Cloud
- Render
- Vercel
- Supabase
- Qdrant Cloud

## 📂 Project Structure

```text
AI-Learning-Agent/
│
├── agents/
│   ├── interviewer.py
│   ├── planner.py
│   ├── quiz.py
│   └── tutor.py
│
├── backend/
│   ├── __init__.py
│   ├── main.py
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── documents.py
│   │   ├── evaluation.py
│   │   ├── interview.py
│   │   ├── planner.py
│   │   ├── progress.py
│   │   ├── quiz.py
│   │   ├── tutor.py
│   │   └── usage.py
│   │
│   └── core/
│       ├── __init__.py
│       ├── rate_limit.py
│       └── logging_config.py
│
├── config/
│   ├── settings.py
│   └── llm.py
│
├── database/
│   ├── users.py
│   ├── documents.py
│   ├── progress.py
│   └── usage.py
│
├── evaluation/
│   ├── answer_evaluator.py
│   └── rag_evaluator.py
│
├── ingestion/
│   ├── embeddings.py
│   ├── loader.py
│   ├── splitter.py
│   └── ...
│
├── retrieval/
│   ├── retriever.py
│   └── vector_store.py
│
├── utils/
│   ├── storage.py
│   └── usage_tracker.py
│
├── memory/
│
├── prompts/
│
├── data/
│   ├── chroma_db/
│   ├── progress.db
│   └── uploads/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── DashboardNavbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Documents.jsx
│   │   │   ├── Evaluation.jsx
│   │   │   ├── Interview.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Planner.jsx
│   │   │   ├── Quiz.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Tutor.jsx
│   │   │   └── Usage.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── vite.config.js
│   └── package.json
│
├── load_test/
│   └── locustfile.py
│
├── .env
├── .env.example
├── .gitignore
├── .dockerignore
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── requirements-prod.txt
├── README.md
└── app.py
```

## 🔄 RAG Pipeline

```text
User uploads document
        ↓
Document Loader
        ↓
Text Extraction
        ↓
Text Splitter
        ↓
Hugging Face Embeddings
        ↓
384-dimensional vectors
        ↓
Qdrant Cloud
        ↓
User asks question
        ↓
Query Embedding
        ↓
Qdrant Similarity Search
        ↓
User ID Filter
        ↓
Relevant Document Chunks
        ↓
Groq LLM
        ↓
AI Generated Answer
```

## 🔐 Authentication

- Register
- Login
- JWT token generation
- Protected API routes

Authorization header:

```text
Authorization: Bearer <token>
```

## 📄 Document Processing

Supported formats:

- PDF
- TXT
- DOCX

Maximum file size:

```text
10 MB
```

Processing steps:

1. Validate file
2. Temporary storage
3. Extract text
4. Split into chunks
5. Generate embeddings
6. Store vectors in Qdrant
7. Upload original file to Supabase Storage
8. Save metadata in PostgreSQL

## 🗄 Database Tables

### users

- id
- name
- email
- password_hash

### documents

- id
- document_uuid
- user_id
- original_filename
- storage_path

### progress

- user_id
- topic
- score
- percentage

### llm_usage

- feature
- model
- total_tokens

## 🔎 Qdrant

Collection:

```text
ai_learning_documents
```

Configuration:

- Vector size: **384**
- Distance: **Cosine**

Metadata stored:

- user_id
- filename
- document_uuid

## ☁ Supabase Storage

Files are stored as:

```text
documents/
└── user_id/
    └── uuid_filename.pdf
```

## 🌐 API Routes

### Authentication

- POST `/auth/register`
- POST `/auth/login`

### Documents

- POST `/documents/upload`
- GET `/documents`
- DELETE `/documents/{id}`

### Tutor

- POST `/tutor/ask`

### Quiz

- POST `/quiz`

### Interview

- POST `/interview`

### Planner

- GET `/planner`

### Evaluation

- POST `/evaluation`

### Progress

- GET `/progress`

### Usage

- GET `/usage`

### Health

- GET `/health`

## ⚙ Environment Variables

```env
FRONTEND_URL=http://localhost:5173

SECRET_KEY=your-secret-key
ALGORITHM=HS256

DATABASE_URL=postgresql://...

GROQ_API_KEY=your-groq-api-key

HF_TOKEN=your-huggingface-token
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2

QDRANT_URL=https://your-qdrant-url
QDRANT_API_KEY=your-qdrant-api-key
QDRANT_COLLECTION_NAME=ai_learning_documents

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your-secret-key
SUPABASE_STORAGE_BUCKET=documents
```

## 🚀 Local Setup

Clone:

```bash
git clone https://github.com/YOUR_USERNAME/AI-Learning-Agent.git
cd AI-Learning-Agent
```

Create virtual environment:

```bash
python -m venv venv
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run backend:

```bash
uvicorn backend.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

## ⚛ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## 🐳 Docker

Build:

```bash
docker build -t ai-learning-agent .
```

Run:

```bash
docker run -p 8000:8000 --env-file .env ai-learning-agent
```

Docker Compose:

```bash
docker compose up --build
```

## 🚀 Production

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | Supabase PostgreSQL |
| Storage | Supabase Storage |
| Vector DB | Qdrant Cloud |
| Embeddings | Hugging Face |
| LLM | Groq |

## 📈 Performance

- Hosted embeddings reduce backend memory usage.
- Batched Qdrant insertion.
- Cached embedding client.
- Cached vector store.
- User-specific vector filtering.

## 🔒 Security

- JWT Authentication
- PBKDF2 Password Hashing
- User-specific RAG retrieval
- Private Supabase Storage
- File validation
- Rate limiting

## 🧪 Load Testing

Locust is included.

Run:

```bash
locust -f load_test/locustfile.py
```

Dashboard:

```text
http://localhost:8089
```

## 👨‍💻 Author

**Gyan Ranjan**

B.Tech Student | Generative AI | Machine Learning | NLP | RAG | LangChain | Full Stack AI Development

## 📄 License

Educational and Portfolio Project.
