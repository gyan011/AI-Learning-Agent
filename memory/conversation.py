from langchain_community.chat_message_histories import (
    ChatMessageHistory,
)


def create_conversation():
    """
    Create a new conversation history.
    """

    return ChatMessageHistory()


def add_user_message(
    history,
    message: str,
):
    """
    Add a user message to the conversation.
    """

    if not message or not message.strip():
        raise ValueError(
            "User message cannot be empty."
        )

    history.add_user_message(
        message
    )


def add_ai_message(
    history,
    message: str,
):
    """
    Add an AI message to the conversation.
    """

    if not message or not message.strip():
        raise ValueError(
            "AI message cannot be empty."
        )

    history.add_ai_message(
        message
    )


def get_conversation_history(history):
    """
    Return all messages in the conversation.
    """

    return history.messages


def clear_conversation(history):
    """
    Clear all conversation messages.
    """

    history.clear()