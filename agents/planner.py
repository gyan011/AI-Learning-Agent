
from langchain_core.prompts import ChatPromptTemplate

from config.settings import (
    GROQ_API_KEY,
    LLM_MODEL,
    TEMPERATURE,
)
from config.llm import get_llm

from database.progress import get_progress


def create_planner_prompt():
    return ChatPromptTemplate.from_messages(
        [
            (
                "system",
                """
You are an AI Learning Planner.

Analyze the student's learning progress and
create a personalized study recommendation.

Rules:
1. Identify strong and weak areas.
2. Consider quiz and interview performance.
3. Recommend topics that need more practice.
4. Suggest a practical next study action.
5. Keep the recommendation concise.
6. Do not invent progress data.

Student Progress:
{progress}

Return the response using this structure:

Overall Performance:
<brief summary>

Strong Areas:
- <area>

Weak Areas:
- <area>

Recommended Topics:
1. <topic>
2. <topic>
3. <topic>

Next Action:
<what the student should do next>
""",
            ),
            (
                "human",
                "Analyze my learning progress and create my study plan.",
            ),
        ]
    )


def generate_learning_plan(user_id: int):
    records = get_progress(user_id)

    if not records:
        return (
            "No learning progress found yet. "
            "Complete a quiz or interview first."
        )

    progress_data = []

    for record in records:
        (
            activity_type,
            topic,
            score,
            total,
            percentage,
            created_at,
        ) = record

        progress_data.append(
            {
                "activity": activity_type,
                "topic": topic,
                "score": score,
                "total": total,
                "percentage": round(
                    percentage,
                    1,
                ),
                "date": created_at,
            }
        )

    llm = get_llm()

    prompt = create_planner_prompt()

    chain = prompt | llm

    response = chain.invoke(
        {
            "progress": str(progress_data),
        }
    )

    return response.content