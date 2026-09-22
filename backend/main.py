from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.auth import router as auth_router
from backend.api.tutor import router as tutor_router
from backend.api.progress import router as progress_router
from backend.api.quiz import router as quiz_router
from backend.api.interview import router as interview_router
from backend.api.planner import router as planner_router
from backend.api.evaluation import router as evaluation_router
from backend.api.documents import router as documents_router
from backend.api.usage import router as usage_router

import os
from dotenv import load_dotenv

from backend.core.rate_limit import limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from database.usage import initialize_usage_table
from database.documents import initialize_documents_table

import logging
import time

from fastapi import Request
from backend.core.logging_config import setup_logging

load_dotenv()

setup_logging()

logger = logging.getLogger("ai_learning_agent")

initialize_usage_table()
initialize_documents_table()


app = FastAPI(
    title="AI Learning Agent API",
    description="Backend API for the AI Learning & Interview Agent",
    version="1.0.0",
)

app.state.limiter = limiter

app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler,
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.perf_counter()

    try:
        response = await call_next(request)

        process_time = time.perf_counter() - start_time

        logger.info(
            "%s %s | status=%s | time=%.3fs",
            request.method,
            request.url.path,
            response.status_code,
            process_time,
        )

        return response

    except Exception:
        process_time = time.perf_counter() - start_time

        logger.exception(
            "%s %s | status=500 | time=%.3fs",
            request.method,
            request.url.path,
            process_time,
        )

        raise


# CORS
FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "https://ai-learning-agent-eight.vercel.app"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(tutor_router)
app.include_router(progress_router)
app.include_router(quiz_router)
app.include_router(interview_router)
app.include_router(planner_router)
app.include_router(evaluation_router)
app.include_router(documents_router)
app.include_router(usage_router)


@app.get("/")
def root():
    return {
        "message": "AI Learning Agent API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }