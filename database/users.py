
import hashlib
import hmac
import secrets
import sqlite3

from pathlib import Path


DATABASE_PATH = Path("data/progress.db")


def get_connection():
    """
    Create and return a database connection.
    """

    DATABASE_PATH.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    return sqlite3.connect(
        DATABASE_PATH
    )


def initialize_users_table():
    """
    Create the users table if it does not exist.
    """

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            password_salt TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        """
    )

    connection.commit()
    connection.close()


def hash_password(password: str, salt: bytes):
    """
    Hash a password using PBKDF2-HMAC-SHA256.
    """

    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        100000,
    )

    return password_hash.hex()


def create_user(
    name: str,
    email: str,
    password: str,
):
    """
    Create a new user account.
    """

    if not name or not name.strip():
        raise ValueError(
            "Name cannot be empty."
        )

    if not email or not email.strip():
        raise ValueError(
            "Email cannot be empty."
        )

    if not password or len(password) < 8:
        raise ValueError(
            "Password must contain at least 8 characters."
        )

    email = email.strip().lower()

    salt = secrets.token_bytes(16)

    password_hash = hash_password(
        password,
        salt,
    )

    connection = get_connection()
    cursor = connection.cursor()

    try:

        cursor.execute(
            """
            INSERT INTO users (
                name,
                email,
                password_hash,
                password_salt,
                created_at
            )
            VALUES (?, ?, ?, ?, datetime('now'))
            """,
            (
                name.strip(),
                email,
                password_hash,
                salt.hex(),
            ),
        )

        connection.commit()

    except sqlite3.IntegrityError:

        raise ValueError(
            "An account with this email already exists."
        )

    finally:

        connection.close()


def authenticate_user(
    email: str,
    password: str,
):
    """
    Authenticate a user using email and password.

    Returns:
        User information if authentication succeeds.
        None otherwise.
    """

    if not email or not email.strip():
        return None

    if not password:
        return None

    email = email.strip().lower()

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT
            id,
            name,
            email,
            password_hash,
            password_salt
        FROM users
        WHERE email = ?
        """,
        (email,),
    )

    user = cursor.fetchone()

    connection.close()

    if user is None:
        return None

    user_id = user[0]
    name = user[1]
    user_email = user[2]
    stored_hash = user[3]
    stored_salt = user[4]

    salt = bytes.fromhex(
        stored_salt
    )

    password_hash = hash_password(
        password,
        salt,
    )

    if not hmac.compare_digest(
        password_hash,
        stored_hash,
    ):
        return None

    return {
        "id": user_id,
        "name": name,
        "email": user_email,
    }


def get_user_by_id(user_id: int):
    """
    Get basic user information by ID.
    """

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT id, name, email
        FROM users
        WHERE id = ?
        """,
        (user_id,),
    )

    user = cursor.fetchone()

    connection.close()

    if user is None:
        return None

    return {
        "id": user[0],
        "name": user[1],
        "email": user[2],
    }

