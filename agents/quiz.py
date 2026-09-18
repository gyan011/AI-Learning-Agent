import json

from config.settings import (
    GROQ_API_KEY,
    LLM_MODEL,
    TEMPERATURE,
)
from config.llm import get_llm

from prompts.quiz_prompt import create_quiz_prompt
from retrieval.retriever import retrieve_documents
from utils.usage_tracker import track_llm_usage


def validate_quiz(quiz_data, num_questions):
    """
    Validate the structure of the generated quiz.
    """

    if not isinstance(quiz_data, dict):
        raise ValueError(
            "Quiz response must be a JSON object."
        )

    if "questions" not in quiz_data:
        raise ValueError(
            "Quiz response does not contain questions."
        )

    questions = quiz_data["questions"]

    if not isinstance(questions, list):
        raise ValueError(
            "Questions must be a list."
        )

    if len(questions) != num_questions:
        raise ValueError(
            f"Expected {num_questions} questions, "
            f"but received {len(questions)}."
        )

    for index, question in enumerate(questions):

        if not isinstance(question, dict):
            raise ValueError(
                f"Question {index + 1} is invalid."
            )

        required_fields = [
            "question",
            "options",
            "correct_answer",
            "explanation",
        ]

        for field in required_fields:

            if field not in question:
                raise ValueError(
                    f"Question {index + 1} "
                    f"is missing '{field}'."
                )

        options = question["options"]

        if not isinstance(options, list):
            raise ValueError(
                f"Options for question "
                f"{index + 1} must be a list."
            )

        if len(options) != 4:
            raise ValueError(
                f"Question {index + 1} "
                f"must have exactly 4 options."
            )

        correct_answer = question["correct_answer"]

        if not isinstance(correct_answer, int):
            raise ValueError(
                f"Correct answer for question "
                f"{index + 1} must be an integer."
            )

        if correct_answer not in range(4):
            raise ValueError(
                f"Correct answer for question "
                f"{index + 1} must be between 0 and 3."
            )

    return True


def generate_quiz(
    topic: str,
    num_questions: int = 5,
    user_id: int = None,
):
    """
    Generate and validate a structured quiz.

    Args:
        topic: Topic for the quiz.
        num_questions: Number of questions.

    Returns:
        Dictionary containing quiz questions.
    """

    if not topic or not topic.strip():
        raise ValueError(
            "Topic cannot be empty."
        )

    if num_questions < 1:
        raise ValueError(
            "Number of questions must be at least 1."
        )

    if num_questions > 20:
        raise ValueError(
            "Maximum 20 questions allowed at once."
        )

    # Retrieve study material
    if user_id is None:
        raise ValueError(
            "User authentication is required."
        )

    documents = retrieve_documents(
        topic,
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

    # Create prompt
    prompt = create_quiz_prompt()

    # Create LLM
    llm = get_llm()
    
    # Create chain
    chain = prompt | llm

    # Generate quiz
    response = chain.invoke(
        {
            "context": context,
            "topic": topic,
            "num_questions": num_questions,
        }
    )
    
    track_llm_usage(
        response=response,
        user_id=user_id,
        feature="quiz",
    )

    # Parse JSON
    try:
        quiz_data = json.loads(
            response.content
        )

    except json.JSONDecodeError as e:
        raise ValueError(
            "LLM returned invalid JSON. "
            "Please try generating the quiz again."
        ) from e

    # Validate quiz
    validate_quiz(
        quiz_data,
        num_questions,
    )

    return quiz_data