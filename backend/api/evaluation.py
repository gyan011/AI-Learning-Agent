from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from jose import jwt, JWTError

from evaluation.answer_evaluator import evaluate_answer
from backend.api.auth import SECRET_KEY, ALGORITHM
from database.progress import initialize_database, save_progress
from fastapi import Request
from backend.core.rate_limit import limiter


router = APIRouter(
    prefix="/evaluation",
    tags=["Evaluation"],
)

security = HTTPBearer()


class EvaluationRequest(BaseModel):
    question: str
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


@router.post("/answer")
@limiter.limit("20/minute")
def evaluate_student_answer(
    request: Request,
    evaluation_request: EvaluationRequest,
    user_id: int = Depends(get_current_user),
):
    try:
        result = evaluate_answer(
            question=evaluation_request.question.strip(),
            student_answer=evaluation_request.student_answer.strip(),
            user_id=user_id,
        )

        initialize_database()

        save_progress(
            user_id=user_id,
            activity_type="evaluation",
            topic=evaluation_request.question.strip(),
            score=result["overall_score"],
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
            detail="Failed to evaluate answer.",
        )