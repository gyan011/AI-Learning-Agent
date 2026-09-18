from config.settings import LLM_MODEL
from database.usage import save_usage


def track_llm_usage(
    response,
    user_id: int,
    feature: str,
):
    usage = getattr(response, "usage_metadata", None)

    if not usage:
        return

    input_tokens = usage.get("input_tokens", 0)
    output_tokens = usage.get("output_tokens", 0)
    total_tokens = usage.get(
        "total_tokens",
        input_tokens + output_tokens,
    )

    save_usage(
        user_id=user_id,
        feature=feature,
        model=LLM_MODEL,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        total_tokens=total_tokens,
    )