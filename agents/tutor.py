
from langchain_core.prompts import ChatPromptTemplate
import time

from config.settings import (
    GROQ_API_KEY,
    LLM_MODEL,
    TEMPERATURE,
)
from config.llm import get_llm

from retrieval.retriever import retrieve_documents
from utils.usage_tracker import track_llm_usage


def create_tutor_prompt():
    """
    Create the prompt used by the AI Tutor.
    """

    return ChatPromptTemplate.from_messages(
        [
            (
                "system",
                """
You are an AI tutor.

Your job is to teach the student using the
provided study material and conversation history.

Rules:
1. Use the provided study material as your primary source.
2. Use conversation history to understand previous questions.
3. If the answer is not supported by the study material,
   clearly say that you don't have enough information.
4. Explain concepts clearly.
5. Use examples when helpful.
6. Adjust explanations for a student.
7. Do not invent facts.
8. If the student asks a follow-up question, use the
   previous conversation to understand what they mean.

Study Material:
{context}

Conversation History:
{history}
""",
            ),
            (
                "human",
                "{question}",
            ),
        ]
    )


def tutor_answer(
    question: str,
    user_id: int,
    history=None,
):
    """
    Generate an answer using the authenticated user's
    retrieved documents and conversation history.
    """

    if not question or not question.strip():
        raise ValueError(
            "Question cannot be empty."
        )

    if user_id <= 0:
        raise ValueError(
            "Invalid user ID."
        )

    documents = retrieve_documents(
        question,
        user_id,
    )

    if not documents:
        raise ValueError(
            "No relevant study material found."
        )

    context = "\n\n".join(
        document.page_content
        for document in documents
    )

    if history:
        history_text = history
    else:
        history_text = "No previous conversation."

    prompt = create_tutor_prompt()

    llm = get_llm()

    chain = prompt | llm

    
    max_retries = 3

    for attempt in range(max_retries):
        try:
            response = chain.invoke(
                {
                    "context": context,
                    "history": history_text,
                    "question": question,
                }
            )
            break

        except Exception as e:
            error_message = str(e)

            if "429" not in error_message and "rate_limit_exceeded" not in error_message:
                raise

            if attempt == max_retries - 1:
                raise

            wait_time = 2 ** attempt

            print(
                f"Groq rate limit reached. "
                f"Retrying in {wait_time}s..."
            )

            time.sleep(wait_time)
    
    track_llm_usage(
        response=response,
        user_id=user_id,
        feature="tutor",
    )

    return response.content