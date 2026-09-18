from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from jose import jwt

from database.users import (
    initialize_users_table,
    create_user,
    authenticate_user,
)

import os
from dotenv import load_dotenv

load_dotenv()


# =========================
# JWT Configuration
# =========================

SECRET_KEY = os.getenv("JWT_SECRET_KEY")

if not SECRET_KEY:
    raise ValueError("JWT_SECRET_KEY is not configured in the .env file.")

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


# =========================
# Request Models
# =========================

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# =========================
# JWT Helper
# =========================

def create_access_token(user_id: int):
    expire = datetime.now(
        timezone.utc
    ) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user_id),
        "exp": expire,
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


# =========================
# Register
# =========================

@router.post("/register")
def register_user(request: RegisterRequest):

    try:

        initialize_users_table()

        create_user(
            name=request.name,
            email=request.email,
            password=request.password,
        )

        user = authenticate_user(
            email=request.email,
            password=request.password,
        )

        if user is None:
            raise HTTPException(
                status_code=500,
                detail="Account created but authentication failed.",
            )

        token = create_access_token(
            user["id"]
        )

        return {
            "message": "Account created successfully.",
            "access_token": token,
            "token_type": "bearer",
            "user": user,
        }

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


# =========================
# Login
# =========================

@router.post("/login")
def login_user(request: LoginRequest):

    initialize_users_table()

    user = authenticate_user(
        email=request.email,
        password=request.password,
    )

    if user is None:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    token = create_access_token(
        user["id"]
    )

    return {
        "message": "Login successful.",
        "access_token": token,
        "token_type": "bearer",
        "user": user,
    }