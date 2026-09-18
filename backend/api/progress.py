from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

from database.progress import (
    initialize_database,
    get_progress,
)

from backend.api.auth import SECRET_KEY, ALGORITHM


router = APIRouter(
    prefix="/progress",
    tags=["Progress"],
)

security = HTTPBearer()


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


@router.get("")
def fetch_progress(
    user_id: int = Depends(get_current_user),
):
    try:
        initialize_database()

        records = get_progress(user_id)

        progress = []

        for record in records:
            progress.append(
                {
                    "activity_type": record[0],
                    "topic": record[1],
                    "score": record[2],
                    "total": record[3],
                    "percentage": record[4],
                    "created_at": record[5],
                }
            )

        return {
            "user_id": user_id,
            "progress": progress,
        }

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve progress.",
        )