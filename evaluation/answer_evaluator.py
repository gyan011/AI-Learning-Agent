
import json
from langchain_core.prompts import ChatPromptTemplate

from config.settings import (
    GROQ_API_KEY,
    LLM_MODEL,
    TEMPERATURE,
)
from config.llm import get_llm

from retrieval.retriever import retrieve_documents
from utils.usage_tracker import track_llm_usage


def create_evaluator_prompt():
    """
    Create the prompt used by the Answer Evaluator.
    """

    return ChatPromptTemplate.from_messages(
        [
            (
                "system",
                """
You are an AI answer evaluator.

Evaluate the student's answer using ONLY
the provided study material.

Evaluate these four areas:

1. correctness
2. relevance
3. completeness
4. clarity

Rules:
- Give each category a score from 0 to 10.
- Give an overall score from 0 to 10.
- Identify concepts answered correctly.
- Identify missing or incorrect concepts.
- Give specific improvement feedback.
- Do not invent information.
- Return ONLY valid JSON.
- Do not use Markdown.
- Do not add text before or after the JSON.

Return exactly this structure:

{{
    "correctness": 8,
    "relevance": 9,
    "completeness": 7,
    "clarity": 8,
    "overall_score": 8,
    "correct_points": [
        "Correct concept"
    ],
    "missing_or_incorrect": [
        "Missing concept"
    ],
    "feedback": "Specific feedback for improvement"
}}

Important:
- All scores must be integers from 0 to 10.
- correct_points must be a list.
- missing_or_incorrect must be a list.
- feedback must be a string.
- Do not include additional fields.

Study Material:
{context}
""",
            ),
            (
                "human",
                """
Question:
{question}

Student Answer:
{student_answer}
""",
            ),
        ]
    )


def validate_evaluation(result):
    """
    Validate the evaluator response.
    """

    required_fields = [
        "correctness",
        "relevance",
        "completeness",
        "clarity",
        "overall_score",
        "correct_points",
        "missing_or_incorrect",
        "feedback",
    ]

    if not isinstance(result, dict):
        raise ValueError(
            "Evaluation response must be a JSON object."
        )

    for field in required_fields:
        if field not in result:
            raise ValueError(
                f"Evaluation response is missing "
                f"'{field}'."
            )

    score_fields = [
        "correctness",
        "relevance",
        "completeness",
        "clarity",
        "overall_score",
    ]

    for field in score_fields:

        if not isinstance(result[field], int):
            raise ValueError(
                f"{field} must be an integer."
            )

        if result[field] < 0 or result[field] > 10:
            raise ValueError(
                f"{field} must be between 0 and 10."
            )

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

    if not isinstance(
        result["feedback"],
        str,
    ):
        raise ValueError(
            "feedback must be a string."
        )

    return True


def evaluate_answer(
    question: str,
    student_answer: str,
    user_id: int,
):
    """
    Evaluate a student's answer using RAG context.
    """

    if not question or not question.strip():
        raise ValueError(
            "Question cannot be empty."
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
    
    documents = retrieve_documents(question, user_id)

    if not documents:
        raise ValueError(
            "No relevant study material found."
        )

    context = "\n\n".join(
        document.page_content
        for document in documents
    )

    prompt = create_evaluator_prompt()

    llm = get_llm()

    chain = prompt | llm

    response = chain.invoke(
        {
            "context": context,
            "question": question,
            "student_answer": student_answer,
        }
    )
    
    track_llm_usage(
        response=response,
        user_id=user_id,
        feature="evaluation",
    )

    try:
        result = json.loads(
            response.content
        )

    except json.JSONDecodeError as e:
        raise ValueError(
            "LLM returned invalid JSON. "
            "Please try again."
        ) from e

    validate_evaluation(
        result
    )

    return result

