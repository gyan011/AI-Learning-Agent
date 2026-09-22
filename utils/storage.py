from functools import lru_cache

from supabase import create_client, Client

from config.settings import (
    SUPABASE_URL,
    SUPABASE_SECRET_KEY,
    SUPABASE_STORAGE_BUCKET,
)


@lru_cache(maxsize=1)
def get_supabase_client() -> Client:

    if not SUPABASE_URL:
        raise RuntimeError("SUPABASE_URL is not configured.")

    if not SUPABASE_SECRET_KEY:
        raise RuntimeError(
            "SUPABASE_SECRET_KEY is not configured."
        )

    return create_client(
        SUPABASE_URL,
        SUPABASE_SECRET_KEY,
    )


def upload_file(file_path: str, storage_path: str):

    client = get_supabase_client()

    with open(file_path, "rb") as file:
        return (
            client.storage
            .from_(SUPABASE_STORAGE_BUCKET)
            .upload(
                path=storage_path,
                file=file,
                file_options={
                    "upsert": "true",
                },
            )
        )


def delete_file(storage_path: str):

    client = get_supabase_client()

    return (
        client.storage
        .from_(SUPABASE_STORAGE_BUCKET)
        .remove([storage_path])
    )


def download_file(storage_path: str):

    client = get_supabase_client()

    return (
        client.storage
        .from_(SUPABASE_STORAGE_BUCKET)
        .download(storage_path)
    )