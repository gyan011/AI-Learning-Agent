import os

from dotenv import load_dotenv

load_dotenv()


GROQ_API_KEY = os.getenv("GROQ_API_KEY")

HF_TOKEN = os.getenv("HF_TOKEN")


LLM_MODEL = os.getenv(
    "LLM_MODEL",
    "openai/gpt-oss-20b"
)

TEMPERATURE = float(
    os.getenv("TEMPERATURE", "0.2")
)


EMBEDDING_MODEL = os.getenv(
    "EMBEDDING_MODEL",
    "sentence-transformers/all-MiniLM-L6-v2"
)


CHROMA_PATH = os.getenv(
    "CHROMA_PATH",
    "./data/chroma_db"
)


CHUNK_SIZE = int(
    os.getenv("CHUNK_SIZE", "1000")
)

CHUNK_OVERLAP = int(
    os.getenv("CHUNK_OVERLAP", "150")
)

RETRIEVAL_K = int(
    os.getenv("RETRIEVAL_K", "4")
)


MAX_FILE_SIZE_MB = int(
    os.getenv("MAX_FILE_SIZE_MB", "10")
)


MAX_QUESTIONS_PER_MINUTE = int(
    os.getenv("MAX_QUESTIONS_PER_MINUTE", "10")
)

MAX_CONCURRENT_REQUESTS = int(
    os.getenv("MAX_CONCURRENT_REQUESTS", "10")
)