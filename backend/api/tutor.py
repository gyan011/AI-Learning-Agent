from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from jose import jwt, JWTError

from agents.tutor import tutor_answer
from backend.api.auth import SECRET_KEY, ALGORITHM
from backend.core.rate_limit import limiter


router = APIRouter(
    prefix="/tutor",
    tags=["Tutor"],
)

security = HTTPBearer()


class HistoryMessage(BaseModel):
    role: str
    content: str


class TutorRequest(BaseModel):
    question: str
    history: list[HistoryMessage] = []


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token.",
            )

        return int(user_id)

    except (JWTError, ValueError):
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token.",
        )


@router.post("/ask")
@limiter.limit("20/minute")
def ask_tutor(
    request: Request,
    tutor_request: TutorRequest,
    user_id: int = Depends(get_current_user),
):
    try:
        history_text = "\n".join(
            f"{message.role}: {message.content}"
            for message in tutor_request.history
        )

        if not history_text:
            history_text = "No previous conversation."

        answer = tutor_answer(
            question=tutor_request.question.strip(),
            user_id=user_id,
            history=history_text,
        )

        return {
            "answer": answer,
        }

    except Exception as e:
        error_message = str(e)

        print(f"TUTOR ERROR: {type(e).__name__}: {error_message}")

        # Groq rate-limit error
        if "429" in error_message or "rate_limit_exceeded" in error_message:
            raise HTTPException(
                status_code=429,
                detail="AI service rate limit reached. Please try again shortly.",
            )

        # Other unexpected errors
        raise HTTPException(
            status_code=500,
            detail="Failed to generate tutor response.",
        )