
import json

from config.settings import (
    GROQ_API_KEY,
    LLM_MODEL,
    TEMPERATURE,
)
from config.llm import get_llm

from prompts.interview_prompt import (
    create_interview_prompt
)

from retrieval.retriever import (
    retrieve_documents
)
from utils.usage_tracker import track_llm_usage


def validate_interview_result(result):
    """
    Validate the structure of the interview response.
    """

    if not isinstance(result, dict):
        raise ValueError(
            "Interview response must be a JSON object."
        )

    required_fields = [
        "evaluation",
        "score",
        "correct_points",
        "missing_or_incorrect",
        "improvement",
        "next_question",
    ]

    for field in required_fields:

        if field not in result:
            raise ValueError(
                f"Interview response is missing "
                f"'{field}'."
            )

    # Validate score
    score = result["score"]

    if not isinstance(score, int):
        raise ValueError(
            "Interview score must be an integer."
        )

    if score < 0 or score > 10:
        raise ValueError(
            "Interview score must be between 0 and 10."
        )

    # Validate lists
    if not isinstance(
        result["correct_points"],
        list,
    ):
        raise ValueError(
            "correct_points must be a list."
        )

    if not isinstance(
        result["missing_or_incorrect"],
        list,
    ):
        raise ValueError(
            "missing_or_incorrect must be a list."
        )

    # Validate strings
    string_fields = [
        "evaluation",
        "improvement",
        "next_question",
    ]

    for field in string_fields:

        if not isinstance(
            result[field],
            str,
        ):
            raise ValueError(
                f"{field} must be a string."
            )

        if not result[field].strip():
            raise ValueError(
                f"{field} cannot be empty."
            )

    return True


def interview_response(
    topic: str,
    previous_question: str,
    student_answer: str,
    user_id: int,
):
    """
    Evaluate a student's answer and generate
    the next interview question.
    """

    if not topic or not topic.strip():
        raise ValueError(
            "Interview topic cannot be empty."
        )

    if (
        not previous_question
        or not previous_question.strip()
    ):
        raise ValueError(
            "Previous question cannot be empty."
        )

    if (
        not student_answer
        or not student_answer.strip()
    ):
        raise ValueError(
            "Student answer cannot be empty."
        )

    if user_id <= 0:
        raise ValueError("Invalid user ID.")
    # Retrieve relevant study material
    documents = retrieve_documents(topic, user_id)


    if not documents:
        raise ValueError(
            "No relevant study material found."
        )

    # Build context
    context = "\n\n".join(
        document.page_content
        for document in documents
    )

    # Create prompt
    prompt = create_interview_prompt()

    # Create LLM
    llm = get_llm()

    # Create chain
    chain = prompt | llm

    # Generate response
    response = chain.invoke(
        {
            "context": context,
            "topic": topic,
            "previous_question": previous_question,
            "student_answer": student_answer,
        }
    )
    
    track_llm_usage(
        response=response,
        user_id=user_id,
        feature="interview",
    )

    # Parse JSON
    try:

        result = json.loads(
            response.content
        )

    except json.JSONDecodeError as e:

        raise ValueError(
            "LLM returned invalid JSON. "
            "Please try again."
        ) from e

    # Validate response
    validate_interview_result(
        result
    )

    return result

