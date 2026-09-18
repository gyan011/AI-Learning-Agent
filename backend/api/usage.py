from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

from backend.api.auth import SECRET_KEY, ALGORITHM
from database.usage import initialize_usage_table, get_usage_summary


router = APIRouter(
    prefix="/usage",
    tags=["Usage"],
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
def get_usage(
    user_id: int = Depends(get_current_user),
):
    try:
        initialize_usage_table()

        summary = get_usage_summary(user_id)

        return {
            "user_id": user_id,
            **summary,
        }

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve usage statistics.",
        )