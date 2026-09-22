from functools import lru_cache

from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PayloadSchemaType
from langchain_qdrant import QdrantVectorStore

from ingestion.embeddings import get_embeddings
from config.settings import (
    QDRANT_URL,
    QDRANT_API_KEY,
    QDRANT_COLLECTION_NAME,
)


BATCH_SIZE = 5


def get_qdrant_client():

    if not QDRANT_URL:
        raise RuntimeError("QDRANT_URL is not configured.")

    if not QDRANT_API_KEY:
        raise RuntimeError("QDRANT_API_KEY is not configured.")

    return QdrantClient(
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY,
    )


def ensure_collection():

    client = get_qdrant_client()

    collections = client.get_collections().collections

    exists = any(
        collection.name == QDRANT_COLLECTION_NAME
        for collection in collections
    )

    if not exists:

        embeddings = get_embeddings()

        test_embedding = embeddings.embed_query(
            "test embedding"
        )

        vector_size = len(test_embedding)

        client.create_collection(
            collection_name=QDRANT_COLLECTION_NAME,
            vectors_config=VectorParams(
                size=vector_size,
                distance=Distance.COSINE,
            ),
        )

    # Ensure user_id index exists
    client.create_payload_index(
        collection_name=QDRANT_COLLECTION_NAME,
        field_name="metadata.user_id",
        field_schema=PayloadSchemaType.KEYWORD,
    )

    return client


@lru_cache(maxsize=1)
def get_vector_store():

    ensure_collection()

    embeddings = get_embeddings()

    return QdrantVectorStore.from_existing_collection(
        embedding=embeddings,
        collection_name=QDRANT_COLLECTION_NAME,
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY,
    )


def create_vector_store(chunks, user_id: int):

    if not chunks:
        raise ValueError("No document chunks provided.")

    if user_id <= 0:
        raise ValueError("Invalid user ID.")

    ensure_collection()

    embeddings = get_embeddings()

    for chunk in chunks:
        chunk.metadata["user_id"] = str(user_id)

    client = get_qdrant_client()

    vector_store = QdrantVectorStore(
        client=client,
        collection_name=QDRANT_COLLECTION_NAME,
        embedding=embeddings,
    )

    # Add documents in small batches
    for start in range(0, len(chunks), BATCH_SIZE):

        batch = chunks[start:start + BATCH_SIZE]

        print(
            f"Adding Qdrant batch "
            f"{start + 1}-{start + len(batch)} "
            f"of {len(chunks)}"
        )

        vector_store.add_documents(batch)

    return vector_store