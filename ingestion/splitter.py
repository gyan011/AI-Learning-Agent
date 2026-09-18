from langchain_text_splitters import RecursiveCharacterTextSplitter

from config.settings import CHUNK_SIZE, CHUNK_OVERLAP


def split_documents(documents):
    """
    Split loaded documents into smaller chunks.

    Args:
        documents: List of LangChain Document objects.

    Returns:
        List of chunked Document objects.
    """

    if not documents:
        raise ValueError("No documents provided for splitting.")

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        length_function=len,
        separators=[
            "\n\n",
            "\n",
            ". ",
            " ",
            "",
        ],
    )

    chunks = text_splitter.split_documents(documents)

    return chunks

