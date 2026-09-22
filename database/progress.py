from datetime import datetime
from zoneinfo import ZoneInfo

import psycopg

from config.settings import DATABASE_URL


def get_connection():
    """
    Create and return a PostgreSQL database connection.
    """

    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL is not configured.")

    return psycopg.connect(DATABASE_URL)


def initialize_database():
    """
    Create the progress table if it does not exist.
    """

    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS progress (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER NOT NULL,
                    activity_type TEXT NOT NULL,
                    topic TEXT NOT NULL,
                    score DOUBLE PRECISION NOT NULL,
                    total DOUBLE PRECISION NOT NULL,
                    percentage DOUBLE PRECISION NOT NULL,
                    created_at TEXT NOT NULL
                )
                """
            )

        connection.commit()

    finally:
        connection.close()


def get_current_time():
    """
    Get the current time in India Standard Time.
    """

    india_timezone = ZoneInfo("Asia/Kolkata")

    current_time = datetime.now(india_timezone)

    return current_time.strftime("%Y-%m-%d %H:%M:%S")


def save_progress(
    user_id: int,
    activity_type: str,
    topic: str,
    score: float,
    total: float,
):
    """
    Save a user's quiz or interview result.
    """

    if user_id <= 0:
        raise ValueError("Invalid user ID.")

    if not activity_type.strip():
        raise ValueError("Activity type cannot be empty.")

    if not topic.strip():
        raise ValueError("Topic cannot be empty.")

    if total <= 0:
        raise ValueError("Total must be greater than zero.")

    percentage = (score / total) * 100

    created_at = get_current_time()

    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO progress (
                    user_id,
                    activity_type,
                    topic,
                    score,
                    total,
                    percentage,
                    created_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    user_id,
                    activity_type,
                    topic,
                    score,
                    total,
                    percentage,
                    created_at,
                ),
            )

        connection.commit()

    finally:
        connection.close()


def get_progress(user_id: int):
    """
    Retrieve progress records for a specific user.
    """

    if user_id <= 0:
        raise ValueError("Invalid user ID.")

    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    activity_type,
                    topic,
                    score,
                    total,
                    percentage,
                    created_at
                FROM progress
                WHERE user_id = %s
                ORDER BY id DESC
                """,
                (user_id,),
            )

            records = cursor.fetchall()

        return records

    finally:
        connection.close()


def get_topic_progress(
    user_id: int,
    topic: str,
):
    """
    Retrieve progress for a specific user and topic.
    """

    if user_id <= 0:
        raise ValueError("Invalid user ID.")

    if not topic.strip():
        raise ValueError("Topic cannot be empty.")

    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    activity_type,
                    topic,
                    score,
                    total,
                    percentage,
                    created_at
                FROM progress
                WHERE user_id = %s
                AND topic = %s
                ORDER BY id DESC
                """,
                (user_id, topic),
            )

            records = cursor.fetchall()

        return records

    finally:
        connection.close()