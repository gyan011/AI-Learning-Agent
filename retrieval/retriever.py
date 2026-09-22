from functools import lru_cache

from langchain_qdrant import QdrantVectorStore

from ingestion.embeddings import get_embeddings
from config.settings import (
    QDRANT_URL,
    QDRANT_API_KEY,
    QDRANT_COLLECTION_NAME,
    RETRIEVAL_K,
)


@lru_cache(maxsize=1)
def get_vector_store():

    if not QDRANT_URL:
        raise RuntimeError("QDRANT_URL is not configured.")

    if not QDRANT_API_KEY:
        raise RuntimeError("QDRANT_API_KEY is not configured.")

    embeddings = get_embeddings()

    return QdrantVectorStore.from_existing_collection(
        embedding=embeddings,
        collection_name=QDRANT_COLLECTION_NAME,
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY,
    )


def retrieve_documents(
    query: str,
    user_id: int,
):
    """
    Retrieve relevant documents for a specific user.
    """

    if not query or not query.strip():
        raise ValueError("Query cannot be empty.")

    if user_id <= 0:
        raise ValueError("Invalid user ID.")

    vector_store = get_vector_store()

    results = vector_store.similarity_search(
        query,
        k=RETRIEVAL_K,
        filter={
            "must": [
                {
                    "key": "metadata.user_id",
                    "match": {
                        "value": str(user_id),
                    },
                }
            ]
        },
    )

    return results