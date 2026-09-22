from database.progress import get_connection


def initialize_documents_table():
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS documents (
                    id SERIAL PRIMARY KEY,
                    document_uuid TEXT NOT NULL UNIQUE,
                    user_id INTEGER NOT NULL,
                    original_filename TEXT NOT NULL,
                    storage_path TEXT NOT NULL UNIQUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)

        connection.commit()

    finally:
        connection.close()


def save_document(
    user_id: int,
    document_uuid: str,
    original_filename: str,
    storage_path: str,
):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO documents (
                    user_id,
                    document_uuid,
                    original_filename,
                    storage_path
                )
                VALUES (%s, %s, %s, %s)
                RETURNING id
            """, (
                user_id,
                document_uuid,
                original_filename,
                storage_path,
            ))

            document_id = cursor.fetchone()[0]

        connection.commit()

        return document_id

    finally:
        connection.close()


def get_user_documents(user_id: int):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT
                    id,
                    document_uuid,
                    original_filename,
                    storage_path,
                    created_at
                FROM documents
                WHERE user_id = %s
                ORDER BY id DESC
            """, (user_id,))

            return cursor.fetchall()

    finally:
        connection.close()


def get_document(
    user_id: int,
    document_id: int,
):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT
                    id,
                    document_uuid,
                    original_filename,
                    storage_path,
                    created_at
                FROM documents
                WHERE id = %s
                AND user_id = %s
            """, (
                document_id,
                user_id,
            ))

            return cursor.fetchone()

    finally:
        connection.close()


def delete_document_record(
    user_id: int,
    document_id: int,
):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                DELETE FROM documents
                WHERE id = %s
                AND user_id = %s
            """, (
                document_id,
                user_id,
            ))

        connection.commit()

    finally:
        connection.close()