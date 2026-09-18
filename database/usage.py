import sqlite3
from pathlib import Path

from database.progress import get_connection


def initialize_usage_table():
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS llm_usage (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            feature TEXT NOT NULL,
            model TEXT NOT NULL,
            input_tokens INTEGER NOT NULL DEFAULT 0,
            output_tokens INTEGER NOT NULL DEFAULT 0,
            total_tokens INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL
        )
        """
    )

    connection.commit()
    connection.close()


def save_usage(
    user_id: int,
    feature: str,
    model: str,
    input_tokens: int = 0,
    output_tokens: int = 0,
    total_tokens: int = 0,
):
    if user_id <= 0:
        raise ValueError("Invalid user ID.")

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO llm_usage (
            user_id,
            feature,
            model,
            input_tokens,
            output_tokens,
            total_tokens,
            created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
        """,
        (
            user_id,
            feature,
            model,
            input_tokens,
            output_tokens,
            total_tokens,
        ),
    )

    connection.commit()
    connection.close()


def get_user_usage(user_id: int):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT
            feature,
            model,
            input_tokens,
            output_tokens,
            total_tokens,
            created_at
        FROM llm_usage
        WHERE user_id = ?
        ORDER BY id DESC
        """,
        (user_id,),
    )

    records = cursor.fetchall()
    connection.close()

    return records

def get_usage_summary(user_id: int):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT
            COUNT(*),
            COALESCE(SUM(input_tokens), 0),
            COALESCE(SUM(output_tokens), 0),
            COALESCE(SUM(total_tokens), 0)
        FROM llm_usage
        WHERE user_id = ?
        """,
        (user_id,),
    )

    summary = cursor.fetchone()

    cursor.execute(
        """
        SELECT
            feature,
            COUNT(*),
            COALESCE(SUM(total_tokens), 0)
        FROM llm_usage
        WHERE user_id = ?
        GROUP BY feature
        ORDER BY COUNT(*) DESC
        """,
        (user_id,),
    )

    feature_records = cursor.fetchall()

    connection.close()

    return {
        "total_requests": summary[0],
        "input_tokens": summary[1],
        "output_tokens": summary[2],
        "total_tokens": summary[3],
        "features": [
            {
                "feature": record[0],
                "requests": record[1],
                "total_tokens": record[2],
            }
            for record in feature_records
        ],
    }