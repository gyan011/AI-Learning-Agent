
import json
from langchain_core.prompts import ChatPromptTemplate

from config.settings import (
    GROQ_API_KEY,
    LLM_MODEL,
    TEMPERATURE,
)
from config.llm import get_llm

from retrieval.retriever import retrieve_documents


def create_rag_evaluation_prompt():
    """
    Create the prompt used by the RAG Evaluator.
    """

    return ChatPromptTemplate.from_messages(
        [
            (
                "system",
                """
You are a RAG evaluation expert.

Evaluate the quality of the retrieved context
for answering the user's question.

Evaluate these areas:

1. context_relevance
   - Is the retrieved context relevant to the question?

2. context_coverage
   - Does the context contain enough information
     to answer the question?

3. answer_groundedness
   - Is the provided answer supported by the context?

Give each score from 0 to 10.

Rules:
- Use ONLY the provided context.
- Do not use outside knowledge.
- Explain weaknesses clearly.
- Return ONLY valid JSON.
- Do not use Markdown.
- Do not add text before or after the JSON.

Return exactly:

{{
    "context_relevance": 9,
    "context_coverage": 8,
    "answer_groundedness": 10,
    "overall_score": 9,
    "strengths": [
        "The context directly discusses the topic."
    ],
    "weaknesses": [
        "Some details needed for the answer are missing."
    ],
    "recommendation": "Retrieve more specific chunks about the topic."
}}

Important:
- All scores must be integers from 0 to 10.
- strengths must be a list.
- weaknesses must be a list.
- recommendation must be a string.
- Do not include additional fields.

Question:
{question}

Retrieved Context:
{context}

Generated Answer:
{answer}
""",
            ),
            (
                "human",
                "Evaluate the RAG quality for this question and answer.",
            ),
        ]
    )


def validate_rag_evaluation(result):
    """
    Validate the RAG evaluation response.
    """

    required_fields = [
        "context_relevance",
        "context_coverage",
        "answer_groundedness",
        "overall_score",
        "strengths",
        "weaknesses",
        "recommendation",
    ]

    if not isinstance(result, dict):
        raise ValueError(
            "RAG evaluation must be a JSON object."
        )

    for field in required_fields:

        if field not in result:
            raise ValueError(
                f"RAG evaluation is missing "
                f"'{field}'."
            )

    score_fields = [
        "context_relevance",
        "context_coverage",
        "answer_groundedness",
        "overall_score",
    ]

    for field in score_fields:

        if not isinstance(
            result[field],
            int,
        ):
            raise ValueError(
                f"{field} must be an integer."
            )

        if result[field] < 0 or result[field] > 10:
            raise ValueError(
                f"{field} must be between 0 and 10."
            )

    for field in [
        "strengths",
        "weaknesses",
    ]:

        if not isinstance(
            result[field],
            list,
        ):
            raise ValueError(
                f"{field} must be a list."
            )

    if not isinstance(
        result["recommendation"],
        str,
    ):
        raise ValueError(
            "recommendation must be a string."
        )

    return True


def evaluate_rag(
    question: str,
    answer: str,
):
    """
    Evaluate the RAG retrieval and generated answer.
    """

    if not question or not question.strip():
        raise ValueError(
            "Question cannot be empty."
        )

    if not answer or not answer.strip():
        raise ValueError(
            "Answer cannot be empty."
        )

    documents = retrieve_documents(
        question
    )

    if not documents:
        raise ValueError(
            "No documents were retrieved."
        )

    context = "\n\n".join(
        document.page_content
        for document in documents
    )

    prompt = create_rag_evaluation_prompt()

    llm = get_llm()

    chain = prompt | llm

    response = chain.invoke(
        {
            "question": question,
            "context": context,
            "answer": answer,
        }
    )

    try:
        result = json.loads(
            response.content
        )

    except json.JSONDecodeError as e:
        raise ValueError(
            "LLM returned invalid JSON."
        ) from e

    validate_rag_evaluation(
        result
    )

    return result

