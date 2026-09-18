from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from jose import jwt, JWTError

from agents.interviewer import interview_response
from backend.api.auth import SECRET_KEY, ALGORITHM
from database.progress import initialize_database, save_progress
from fastapi import Request
from backend.core.rate_limit import limiter


router = APIRouter(
    prefix="/interview",
    tags=["Interview"],
)

security = HTTPBearer()


class InterviewStartRequest(BaseModel):
    topic: str


class InterviewAnswerRequest(BaseModel):
    topic: str
    previous_question: str
    student_answer: str


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


@router.post("/start")
def start_interview(
    request: InterviewStartRequest,
    user_id: int = Depends(get_current_user),
):
    if not request.topic.strip():
        raise HTTPException(
            status_code=400,
            detail="Interview topic cannot be empty.",
        )

    return {
        "topic": request.topic.strip(),
        "message": "Interview started.",
        "question": (
            f"Let's begin the interview on "
            f"{request.topic.strip()}. "
            f"Please explain the main concepts "
            f"you know about this topic."
        ),
    }


@router.post("/answer")
@limiter.limit("15/minute")
def submit_interview_answer(
    request: Request,
    interview_request: InterviewAnswerRequest,
    user_id: int = Depends(get_current_user),
):
    try:
        result = interview_response(
            topic=interview_request.topic.strip(),
            previous_question=interview_request.previous_question.strip(),
            student_answer=interview_request.student_answer.strip(),
            user_id=user_id,
        )

        initialize_database()

        save_progress(
            user_id=user_id,
            activity_type="interview",
            topic=interview_request.topic.strip(),
            score=result["score"],
            total=10,
        )

        return result

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Failed to process interview answer.",
        )