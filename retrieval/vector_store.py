from functools import lru_cache

from langchain_chroma import Chroma

from ingestion.embeddings import get_embeddings
from config.settings import CHROMA_PATH


COLLECTION_NAME = "ai_learning_documents"


@lru_cache(maxsize=1)
def get_vector_store():
    embeddings = get_embeddings()

    return Chroma(
        collection_name=COLLECTION_NAME,
        embedding_function=embeddings,
        persist_directory=CHROMA_PATH,
    )


def create_vector_store(chunks, user_id: int):
    if not chunks:
        raise ValueError("No document chunks provided.")

    if user_id <= 0:
        raise ValueError("Invalid user ID.")

    for chunk in chunks:
        chunk.metadata["user_id"] = str(user_id)

    vector_store = get_vector_store()

    vector_store.add_documents(chunks)

    return vector_store