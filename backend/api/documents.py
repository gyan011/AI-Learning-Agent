from pathlib import Path
import shutil
import uuid

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

from backend.api.auth import SECRET_KEY, ALGORITHM
from ingestion.loader import load_document
from ingestion.splitter import split_documents
from retrieval.vector_store import create_vector_store, get_vector_store
from fastapi import Request
from backend.core.rate_limit import limiter


router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)

security = HTTPBearer()

UPLOAD_DIR = Path("data/uploads")
MAX_FILE_SIZE = 10 * 1024 * 1024

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".txt",
    ".docx",
}


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


@router.post("/upload")
@limiter.limit("10/minute")
async def upload_document(
    request: Request,
    file: UploadFile = File(...),
    user_id: int = Depends(get_current_user),
):
    try:
        if not file.filename:
            raise HTTPException(
                status_code=400,
                detail="No file selected.",
            )

        filename = Path(file.filename).name
        extension = Path(filename).suffix.lower()

        if extension not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file type. Use PDF, TXT, or DOCX.",
            )

        user_upload_dir = UPLOAD_DIR / str(user_id)
        user_upload_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

        foriginal_filename = Path(file.filename).name
        safe_filename = f"{uuid.uuid4().hex}{extension}"
        file_path = user_upload_dir / safe_filename

        file_size = 0

        with open(file_path, "wb") as buffer:
            while chunk := await file.read(1024 * 1024):
                file_size += len(chunk)

                if file_size > MAX_FILE_SIZE:
                    buffer.close()
                    file_path.unlink(missing_ok=True)

                    raise HTTPException(
                        status_code=400,
                        detail="File size must be less than 10 MB.",
                    )

                buffer.write(chunk)

        documents = load_document(str(file_path))

        if not documents:
            raise HTTPException(
                status_code=400,
                detail="Could not extract content from the document.",
            )

        for document in documents:
            document.metadata["filename"] = filename

        chunks = split_documents(documents)

        if not chunks:
            raise HTTPException(
                status_code=400,
                detail="Could not create document chunks.",
            )

        create_vector_store(
            chunks=chunks,
            user_id=user_id,
        )

        return {
            "message": "Document uploaded and processed successfully.",
            "filename": filename,
            "user_id": user_id,
            "chunks_created": len(chunks),
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Document processing failed: {str(e)}",
        )


@router.get("")
def list_documents(
    user_id: int = Depends(get_current_user),
):
    try:
        user_upload_dir = UPLOAD_DIR / str(user_id)

        if not user_upload_dir.exists():
            return {
                "user_id": user_id,
                "documents": [],
            }

        documents = []

        for file_path in user_upload_dir.iterdir():
            if file_path.is_file():
                documents.append(
                    {
                        "filename": file_path.name,
                        "size": file_path.stat().st_size,
                    }
                )

        return {
            "user_id": user_id,
            "documents": documents,
        }

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve documents.",
        )


@router.delete("/{filename}")
def delete_document(
    filename: str,
    user_id: int = Depends(get_current_user),
):
    try:
        filename = Path(filename).name
        file_path = UPLOAD_DIR / str(user_id) / filename

        if not file_path.exists():
            raise HTTPException(
                status_code=404,
                detail="Document not found.",
            )

        vector_store = get_vector_store()

        vector_store._collection.delete(
            where={
                "$and": [
                    {"user_id": str(user_id)},
                    {"filename": filename},
                ]
            }
        )

        file_path.unlink()

        return {
            "message": "Document deleted successfully.",
            "filename": filename,
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete document: {str(e)}",
        )