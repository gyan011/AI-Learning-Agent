from functools import lru_cache

from langchain_groq import ChatGroq

from config.settings import (
    GROQ_API_KEY,
    LLM_MODEL,
    TEMPERATURE,
)


@lru_cache(maxsize=1)
def get_llm():
    if not GROQ_API_KEY:
        raise ValueError(
            "GROQ_API_KEY is not configured. Add it to your .env file."
        )

    return ChatGroq(
        model=LLM_MODEL,
        temperature=TEMPERATURE,
        api_key=GROQ_API_KEY,
    )