from retrieval.vector_store import get_vector_store
from config.settings import RETRIEVAL_K


def get_retriever(user_id: int):
    """
    Create a retriever that only searches
    documents belonging to the specified user.
    """

    if user_id <= 0:
        raise ValueError(
            "Invalid user ID."
        )

    vector_store = get_vector_store()

    retriever = vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={
            "k": RETRIEVAL_K,
            "filter": {
                "user_id": str(user_id)
            },
        },
    )

    return retriever


def retrieve_documents(
    query: str,
    user_id: int,
):
    """
    Retrieve documents belonging only to
    the authenticated user.
    """

    if not query or not query.strip():
        raise ValueError(
            "Query cannot be empty."
        )

    if user_id <= 0:
        raise ValueError(
            "Invalid user ID."
        )

    retriever = get_retriever(user_id)

    documents = retriever.invoke(
        query
    )

    return documents