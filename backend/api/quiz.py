from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from jose import jwt, JWTError

from agents.quiz import generate_quiz
from database.progress import initialize_database, save_progress
from backend.api.auth import SECRET_KEY, ALGORITHM
from fastapi import Request
from backend.core.rate_limit import limiter


router = APIRouter(prefix="/quiz", tags=["Quiz"])

security = HTTPBearer()


class QuizRequest(BaseModel):
    topic: str
    num_questions: int = 5


class QuizResultRequest(BaseModel):
    topic: str
    score: float
    total: float


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


@router.post("/generate")
@limiter.limit("10/minute")
def create_quiz(
    request: Request,
    quiz_request: QuizRequest,
    user_id: int = Depends(get_current_user),
):
    try:
        quiz = generate_quiz(
            topic=quiz_request.topic,
            num_questions=quiz_request.num_questions,
            user_id=user_id,
        )

        return quiz

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Failed to generate quiz.",
        )


@router.post("/result")
def save_quiz_result(
    request: QuizResultRequest,
    user_id: int = Depends(get_current_user),
):
    try:
        initialize_database()

        save_progress(
            user_id=user_id,
            activity_type="quiz",
            topic=request.topic,
            score=request.score,
            total=request.total,
        )

        return {
            "message": "Quiz result saved successfully.",
            "score": request.score,
            "total": request.total,
            "percentage": (
                request.score / request.total
            ) * 100,
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Failed to save quiz result.",
        )