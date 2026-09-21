from functools import lru_cache

from langchain_huggingface import HuggingFaceEndpointEmbeddings

from config.settings import EMBEDDING_MODEL, HF_TOKEN


@lru_cache(maxsize=1)
def get_embeddings():

    if not HF_TOKEN:
        raise RuntimeError("HF_TOKEN is not configured.")

    return HuggingFaceEndpointEmbeddings(
        model=EMBEDDING_MODEL,
        task="feature-extraction",
        huggingfacehub_api_token=HF_TOKEN,
    )