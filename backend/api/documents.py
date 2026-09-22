from pathlib import Path
import uuid

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Request,
)
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

from backend.api.auth import SECRET_KEY, ALGORITHM
from backend.core.rate_limit import limiter

from ingestion.loader import load_document
from ingestion.splitter import split_documents

from retrieval.vector_store import create_vector_store

from database.documents import (
    save_document,
    get_user_documents,
    get_document,
    delete_document_record,
)

from utils.storage import (
    upload_file,
    delete_file,
)


router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)

security = HTTPBearer()

TEMP_UPLOAD_DIR = Path("data/uploads")
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
    temporary_file_path = None

    try:

        # -----------------------------
        # Validate file
        # -----------------------------

        if not file.filename:
            raise HTTPException(
                status_code=400,
                detail="No file selected.",
            )

        original_filename = Path(file.filename).name
        extension = Path(original_filename).suffix.lower()

        if extension not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file type. Use PDF, TXT, or DOCX.",
            )

        # -----------------------------
        # Generate unique filenames
        # -----------------------------

        safe_filename = f"{uuid.uuid4().hex}{extension}"

        document_uuid = uuid.uuid4().hex

        # -----------------------------
        # Temporary local storage
        # -----------------------------

        user_temp_dir = TEMP_UPLOAD_DIR / str(user_id)

        user_temp_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

        temporary_file_path = (
            user_temp_dir / safe_filename
        )

        # -----------------------------
        # Save uploaded file temporarily
        # -----------------------------

        file_size = 0

        with open(
            temporary_file_path,
            "wb",
        ) as buffer:

            while chunk := await file.read(
                1024 * 1024
            ):

                file_size += len(chunk)

                if file_size > MAX_FILE_SIZE:

                    temporary_file_path.unlink(
                        missing_ok=True
                    )

                    raise HTTPException(
                        status_code=400,
                        detail="File size must be less than 10 MB.",
                    )

                buffer.write(chunk)

        # -----------------------------
        # Load document
        # -----------------------------

        documents = load_document(
            str(temporary_file_path)
        )

        if not documents:
            raise HTTPException(
                status_code=400,
                detail="Could not extract content from the document.",
            )

        # -----------------------------
        # Add metadata
        # -----------------------------

        for document in documents:

            document.metadata["filename"] = (
                original_filename
            )

            document.metadata["document_uuid"] = (
                document_uuid
            )

        # -----------------------------
        # Split document
        # -----------------------------

        chunks = split_documents(
            documents
        )

        if not chunks:
            raise HTTPException(
                status_code=400,
                detail="Could not create document chunks.",
            )

        # -----------------------------
        # Store vectors in Qdrant
        # -----------------------------

        create_vector_store(
            chunks=chunks,
            user_id=user_id,
        )

        # -----------------------------
        # Upload original file
        # to Supabase Storage
        # -----------------------------

        storage_path = (
            f"{user_id}/{safe_filename}"
        )

        upload_file(
            file_path=str(
                temporary_file_path
            ),
            storage_path=storage_path,
        )

        # -----------------------------
        # Save document mapping
        # -----------------------------

        document_id = save_document(
            user_id=user_id,
            document_uuid=document_uuid,
            original_filename=original_filename,
            storage_path=storage_path,
        )

        # -----------------------------
        # Delete temporary file
        # -----------------------------

        temporary_file_path.unlink(
            missing_ok=True
        )

        return {
            "message": (
                "Document uploaded and "
                "processed successfully."
            ),
            "document_id": document_id,
            "document_uuid": document_uuid,
            "filename": original_filename,
            "user_id": user_id,
            "chunks_created": len(chunks),
        }

    except HTTPException:
        raise

    except Exception as e:
        import traceback

        traceback.print_exc()

        if temporary_file_path:
            temporary_file_path.unlink(missing_ok=True)

        raise HTTPException(
            status_code=500,
            detail=f"Document processing failed: {type(e).__name__}: {str(e)}"
        )


@router.get("")
def list_documents(
    user_id: int = Depends(get_current_user),
):
    try:

        records = get_user_documents(
            user_id
        )

        documents = []

        for record in records:

            document_id = record[0]
            document_uuid = record[1]
            filename = record[2]
            storage_path = record[3]
            created_at = record[4]

            documents.append(
                {
                    "id": document_id,
                    "document_uuid": document_uuid,
                    "filename": filename,
                    "storage_path": storage_path,
                    "created_at": created_at,
                }
            )

        return {
            "user_id": user_id,
            "documents": documents,
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                f"Failed to retrieve documents: {str(e)}"
            ),
        )


@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    user_id: int = Depends(get_current_user),
):
    try:

        # -----------------------------
        # Get document
        # -----------------------------

        document = get_document(
            user_id=user_id,
            document_id=document_id,
        )

        if document is None:
            raise HTTPException(
                status_code=404,
                detail="Document not found.",
            )

        (
            db_document_id,
            document_uuid,
            original_filename,
            storage_path,
            created_at,
        ) = document

        # -----------------------------
        # Delete from Supabase Storage
        # -----------------------------

        delete_file(
            storage_path
        )

        # -----------------------------
        # Delete database record
        # -----------------------------

        delete_document_record(
            user_id=user_id,
            document_id=document_id,
        )

        return {
            "message": "Document deleted successfully.",
            "document_id": db_document_id,
            "document_uuid": document_uuid,
            "filename": original_filename,
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                f"Failed to delete document: {str(e)}"
            ),
        )