
import os
import tempfile

import streamlit as st

from ingestion.loader import load_document
from ingestion.splitter import split_documents
from retrieval.vector_store import create_vector_store

from agents.tutor import tutor_answer
from agents.quiz import generate_quiz
from agents.interviewer import interview_response
from agents.planner import generate_learning_plan

from database.progress import (
    initialize_database,
    save_progress,
    get_progress,
)

from memory.conversation import (
    create_conversation,
    add_user_message,
    add_ai_message,
)

from evaluation.answer_evaluator import (
    evaluate_answer,
)

from evaluation.rag_evaluator import evaluate_rag

# ==================================================
# PAGE CONFIGURATION
# ==================================================

st.set_page_config(
    page_title="AI Learning Agent",
    page_icon="🤖",
    layout="wide",
)


# ==================================================
# INITIALIZE DATABASE
# ==================================================

initialize_database()


# ==================================================
# TITLE
# ==================================================

st.title("🤖 AI Learning & Interview Agent")

st.write(
    "Learn, practice, and prepare for interviews "
    "using your study material."
)


# ==================================================
# SESSION STATE
# ==================================================

if "quiz" not in st.session_state:
    st.session_state.quiz = None

if "user_answers" not in st.session_state:
    st.session_state.user_answers = {}

if "quiz_submitted" not in st.session_state:
    st.session_state.quiz_submitted = False

if "quiz_saved" not in st.session_state:
    st.session_state.quiz_saved = False

if "score" not in st.session_state:
    st.session_state.score = 0

if "unanswered" not in st.session_state:
    st.session_state.unanswered = 0

if "interview_started" not in st.session_state:
    st.session_state.interview_started = False

if "interview_question" not in st.session_state:
    st.session_state.interview_question = ""

if "interview_history" not in st.session_state:
    st.session_state.interview_history = []

if "interview_topic" not in st.session_state:
    st.session_state.interview_topic = ""

if "tutor_history" not in st.session_state:
    st.session_state.tutor_history = create_conversation()


# ==================================================
# DOCUMENT UPLOAD
# ==================================================

st.sidebar.header("📄 Study Material")

uploaded_file = st.sidebar.file_uploader(
    "Upload PDF, TXT, or DOCX",
    type=["pdf", "txt", "docx"],
)


if uploaded_file is not None:

    if st.sidebar.button("Process Document"):

        temp_file_path = None

        try:

            # Create temporary file
            with tempfile.NamedTemporaryFile(
                delete=False,
                suffix=os.path.splitext(
                    uploaded_file.name
                )[1],
            ) as temp_file:

                temp_file.write(
                    uploaded_file.getbuffer()
                )

                temp_file_path = temp_file.name


            with st.spinner(
                "Processing document..."
            ):

                # Load document
                documents = load_document(
                    temp_file_path
                )

                # Split document
                chunks = split_documents(
                    documents
                )

                # Store in Chroma
                create_vector_store(
                    chunks
                )


            st.sidebar.success(
                f"Document processed! "
                f"{len(chunks)} chunks created."
            )


        except Exception as e:

            st.sidebar.error(
                f"Error: {e}"
            )


        finally:

            if (
                temp_file_path
                and os.path.exists(temp_file_path)
            ):

                os.remove(temp_file_path)


# ==================================================
# AI TUTOR
# ==================================================


st.header("💬 AI Tutor")

question = st.text_input(
    "Ask a question about your study material:",
    key="tutor_question",
)

col1, col2 = st.columns(2)

with col1:
    ask_tutor = st.button(
        "Ask Tutor"
    )

with col2:
    clear_memory = st.button(
        "Clear Conversation"
    )

if clear_memory:
    st.session_state.tutor_history = (
        create_conversation()
    )
    st.success(
        "Conversation memory cleared."
    )
    st.rerun()


if ask_tutor:

    if not question.strip():

        st.warning(
            "Please enter a question."
        )

    else:

        try:

            with st.spinner(
                "AI Tutor is thinking..."
            ):

                answer = tutor_answer(
                    question=question,
                    history=(
                        st.session_state
                        .tutor_history
                    ),
                )

            add_user_message(
                st.session_state.tutor_history,
                question,
            )

            add_ai_message(
                st.session_state.tutor_history,
                answer,
            )

        except Exception as e:

            st.error(
                f"Something went wrong: {e}"
            )


if (
    st.session_state
    .tutor_history.messages
):

    st.markdown(
        "### 🧠 Conversation"
    )

    for message in (
        st.session_state
        .tutor_history
        .messages
    ):

        if message.type == "human":

            st.markdown(
                "**👤 You:**"
            )

            st.write(
                message.content
            )

        elif message.type == "ai":

            st.markdown(
                "**🤖 AI Tutor:**"
            )

            st.write(
                message.content
            )

# ==================================================
# INTERACTIVE QUIZ
# ==================================================

st.divider()

st.header("📝 Interactive Quiz")

topic = st.text_input(
    "Enter a quiz topic:",
    placeholder="Example: Transformers",
    key="quiz_topic",
)


num_questions = st.slider(
    "Number of questions",
    min_value=1,
    max_value=20,
    value=5,
    key="quiz_number",
)


# --------------------------------------------------
# Generate Quiz
# --------------------------------------------------

if st.button("Generate Quiz"):

    if not topic.strip():

        st.warning(
            "Please enter a topic."
        )

    else:

        try:

            with st.spinner(
                "Generating quiz..."
            ):

                quiz = generate_quiz(
                    topic=topic,
                    num_questions=num_questions,
                )


            # Store quiz
            st.session_state.quiz = quiz

            # Reset answers
            st.session_state.user_answers = {}

            # Reset submission
            st.session_state.quiz_submitted = False

            # Reset score
            st.session_state.score = 0

            # Reset unanswered
            st.session_state.unanswered = 0

            # Reset database save flag
            st.session_state.quiz_saved = False


        except Exception as e:

            st.error(
                f"Something went wrong: {e}"
            )


# --------------------------------------------------
# Display Quiz
# --------------------------------------------------

if st.session_state.quiz is not None:

    quiz = st.session_state.quiz

    questions = quiz["questions"]

    st.markdown(
        f"### 📚 Quiz: {topic}"
    )


    for index, question_data in enumerate(
        questions
    ):

        st.markdown(
            f"#### Question {index + 1}"
        )

        st.write(
            question_data["question"]
        )


        selected_answer = st.radio(
            "Choose an answer:",
            question_data["options"],
            key=f"question_{index}",
            index=None,
        )


        st.session_state.user_answers[
            index
        ] = selected_answer


    # ----------------------------------------------
    # Submit Quiz
    # ----------------------------------------------

    if st.button("Submit Quiz"):

        score = 0

        unanswered = 0


        for index, question_data in enumerate(
            questions
        ):

            user_answer = (
                st.session_state.user_answers.get(
                    index
                )
            )


            correct_index = question_data[
                "correct_answer"
            ]


            correct_answer = question_data[
                "options"
            ][correct_index]


            if user_answer is None:

                unanswered += 1

            elif user_answer == correct_answer:

                score += 1


        # Store result
        st.session_state.score = score

        st.session_state.unanswered = (
            unanswered
        )

        st.session_state.quiz_submitted = True


        # ------------------------------------------
        # Save quiz progress
        # ------------------------------------------

        if not st.session_state.quiz_saved:

            save_progress(
                activity_type="quiz",
                topic=topic,
                score=score,
                total=len(questions),
            )

            st.session_state.quiz_saved = True


# --------------------------------------------------
# Quiz Results
# --------------------------------------------------

if st.session_state.quiz_submitted:

    quiz = st.session_state.quiz

    questions = quiz["questions"]

    score = st.session_state.score

    unanswered = st.session_state.unanswered

    total = len(questions)


    percentage = (
        score / total
    ) * 100


    st.divider()

    st.subheader("📊 Quiz Result")


    st.metric(
        "Score",
        f"{score}/{total}",
    )


    st.write(
        f"Percentage: {percentage:.1f}%"
    )


    if unanswered > 0:

        st.warning(
            f"{unanswered} question(s) "
            "were unanswered."
        )


    if percentage >= 80:

        st.success(
            "🎉 Excellent performance!"
        )

    elif percentage >= 60:

        st.info(
            "👍 Good job! Keep practicing."
        )

    else:

        st.warning(
            "📖 Keep studying and try again."
        )


    # ----------------------------------------------
    # Question Review
    # ----------------------------------------------

    st.subheader(
        "📋 Question Review"
    )


    for index, question_data in enumerate(
        questions
    ):

        user_answer = (
            st.session_state.user_answers.get(
                index
            )
        )


        correct_index = question_data[
            "correct_answer"
        ]


        correct_answer = question_data[
            "options"
        ][correct_index]


        st.markdown(
            f"**Question {index + 1}:** "
            f"{question_data['question']}"
        )


        if user_answer == correct_answer:

            st.success(
                f"✅ Correct: {correct_answer}"
            )

        elif user_answer is None:

            st.error(
                f"❌ Not answered. "
                f"Correct answer: "
                f"{correct_answer}"
            )

        else:

            st.error(
                f"❌ Your answer: "
                f"{user_answer}"
            )

            st.success(
                f"Correct answer: "
                f"{correct_answer}"
            )


        st.info(
            f"💡 {question_data['explanation']}"
        )


# ==================================================
# AI INTERVIEW
# ==================================================

st.divider()

st.header("🎤 AI Interview")


interview_topic = st.text_input(
    "Enter interview topic:",
    placeholder="Example: Transformers",
    key="interview_topic_input",
)


# --------------------------------------------------
# Start Interview
# --------------------------------------------------

if st.button("Start Interview"):

    if not interview_topic.strip():

        st.warning(
            "Please enter an interview topic."
        )

    else:

        st.session_state.interview_started = True

        st.session_state.interview_topic = (
            interview_topic
        )

        st.session_state.interview_history = []

        st.session_state.interview_question = (
            f"Explain the basic concept of "
            f"{interview_topic}."
        )


# --------------------------------------------------
# Interview Interface
# --------------------------------------------------

if st.session_state.interview_started:

    st.markdown(
        f"### 🎯 Topic: "
        f"{st.session_state.interview_topic}"
    )


    st.markdown(
        "### 🤖 Interviewer"
    )


    st.info(
        st.session_state.interview_question
    )


    student_answer = st.text_area(
        "Your answer:",
        height=150,
        key=(
            f"interview_answer_"
            f"{len(st.session_state.interview_history)}"
        ),
    )


    # ----------------------------------------------
    # Submit Interview Answer
    # ----------------------------------------------

    if st.button(
        "Submit Interview Answer"
    ):

        if not student_answer.strip():

            st.warning(
                "Please provide an answer."
            )

        else:

            try:

                with st.spinner(
                    "Evaluating your answer..."
                ):

                    result = interview_response(
                        topic=(
                            st.session_state
                            .interview_topic
                        ),
                        previous_question=(
                            st.session_state
                            .interview_question
                        ),
                        student_answer=student_answer,
                    )


                # ----------------------------------
                # Save interview history
                # ----------------------------------

                st.session_state.interview_history.append(
                    {
                        "question": (
                            st.session_state
                            .interview_question
                        ),
                        "answer": student_answer,
                        "result": result,
                    }
                )


                # ----------------------------------
                # Save interview progress
                # ----------------------------------

                save_progress(
                    activity_type="interview",
                    topic=(
                        st.session_state
                        .interview_topic
                    ),
                    score=result["score"],
                    total=10,
                )


                # ----------------------------------
                # Update next question
                # ----------------------------------

                st.session_state.interview_question = (
                    result["next_question"]
                )


                st.rerun()


            except Exception as e:

                st.error(
                    f"Interview error: {e}"
                )


# --------------------------------------------------
# Interview History
# --------------------------------------------------

if st.session_state.interview_history:

    st.divider()

    st.subheader(
        "📋 Interview History"
    )


    for index, item in enumerate(
        st.session_state.interview_history
    ):

        result = item["result"]


        st.markdown(
            f"### Question {index + 1}"
        )


        st.write(
            item["question"]
        )


        st.markdown(
            "**Your Answer:**"
        )


        st.write(
            item["answer"]
        )


        st.markdown(
            f"### 📊 Score: "
            f"{result['score']}/10"
        )


        st.markdown(
            "**📝 Evaluation**"
        )


        st.write(
            result["evaluation"]
        )


        st.markdown(
            "**✅ Correct Points**"
        )


        for point in result[
            "correct_points"
        ]:

            st.write(
                f"• {point}"
            )


        st.markdown(
            "**❌ Missing or Incorrect**"
        )


        for point in result[
            "missing_or_incorrect"
        ]:

            st.write(
                f"• {point}"
            )


        st.markdown(
            "**💡 Improvement**"
        )


        st.write(
            result["improvement"]
        )


        st.markdown(
            "**🤖 Next Question**"
        )


        st.info(
            result["next_question"]
        )

## AI Answer Evaluation

st.divider()
st.header("📝 AI Answer Evaluation")

st.write(
    "Submit your answer and get detailed AI feedback "
    "based on your study material."
)

evaluation_question = st.text_input(
    "Question:",
    placeholder="Example: What is self-attention?",
    key="evaluation_question",
)

evaluation_answer = st.text_area(
    "Your Answer:",
    height=150,
    placeholder="Write your answer here...",
    key="evaluation_answer",
)

if st.button("Evaluate Answer"):

    if not evaluation_question.strip():

        st.warning(
            "Please enter a question."
        )

    elif not evaluation_answer.strip():

        st.warning(
            "Please enter your answer."
        )

    else:

        try:

            with st.spinner(
                "Evaluating your answer..."
            ):

                result = evaluate_answer(
                    question=evaluation_question,
                    student_answer=evaluation_answer,
                )

            st.subheader(
                "📊 Evaluation Result"
            )

            col1, col2, col3, col4, col5 = (
                st.columns(5)
            )

            with col1:
                st.metric(
                    "Correctness",
                    f"{result['correctness']}/10",
                )

            with col2:
                st.metric(
                    "Relevance",
                    f"{result['relevance']}/10",
                )

            with col3:
                st.metric(
                    "Completeness",
                    f"{result['completeness']}/10",
                )

            with col4:
                st.metric(
                    "Clarity",
                    f"{result['clarity']}/10",
                )

            with col5:
                st.metric(
                    "Overall",
                    f"{result['overall_score']}/10",
                )

            st.markdown(
                "### ✅ Correct Points"
            )

            for point in result[
                "correct_points"
            ]:
                st.write(
                    f"• {point}"
                )

            st.markdown(
                "### ❌ Missing or Incorrect"
            )

            for point in result[
                "missing_or_incorrect"
            ]:
                st.write(
                    f"• {point}"
                )

            st.markdown(
                "### 💡 Feedback"
            )

            st.info(
                result["feedback"]
            )

        except Exception as e:

            st.error(
                f"Evaluation error: {e}"
            )


# RAG Evaluation

st.divider()
st.header("🔎 RAG Evaluation")

st.write(
    "Evaluate retrieval quality and determine whether "
    "the generated answer is supported by the context."
)

rag_question = st.text_input(
    "Question:",
    placeholder="Example: What is self-attention?",
    key="rag_question",
)

rag_answer = st.text_area(
    "Generated Answer:",
    height=150,
    placeholder="Paste the generated answer here...",
    key="rag_answer",
)

if st.button("Evaluate RAG"):

    if not rag_question.strip():

        st.warning(
            "Please enter a question."
        )

    elif not rag_answer.strip():

        st.warning(
            "Please enter an answer."
        )

    else:

        try:

            with st.spinner(
                "Evaluating RAG quality..."
            ):

                result = evaluate_rag(
                    question=rag_question,
                    answer=rag_answer,
                )

            st.subheader(
                "📊 RAG Evaluation Result"
            )

            col1, col2, col3, col4 = (
                st.columns(4)
            )

            with col1:
                st.metric(
                    "Context Relevance",
                    f"{result['context_relevance']}/10",
                )

            with col2:
                st.metric(
                    "Context Coverage",
                    f"{result['context_coverage']}/10",
                )

            with col3:
                st.metric(
                    "Groundedness",
                    f"{result['answer_groundedness']}/10",
                )

            with col4:
                st.metric(
                    "Overall",
                    f"{result['overall_score']}/10",
                )

            st.markdown(
                "### ✅ Strengths"
            )

            for strength in result[
                "strengths"
            ]:
                st.write(
                    f"• {strength}"
                )

            st.markdown(
                "### ⚠️ Weaknesses"
            )

            for weakness in result[
                "weaknesses"
            ]:
                st.write(
                    f"• {weakness}"
                )

            st.markdown(
                "### 💡 Recommendation"
            )

            st.info(
                result["recommendation"]
            )

        except Exception as e:

            st.error(
                f"RAG evaluation error: {e}"
            )


# ==================================================
# LEARNING PROGRESS
# ==================================================

st.divider()

st.header("📈 Learning Progress")


records = get_progress()


if records:

    for record in records:

        (
            activity_type,
            topic_name,
            score,
            total,
            percentage,
            created_at,
        ) = record


        st.write(
            f"**{activity_type.title()}** | "
            f"{topic_name} | "
            f"{score:g}/{total:g} | "
            f"{percentage:.1f}% | "
            f"{created_at}"
        )

else:

    st.info(
        "No learning progress recorded yet."
    )


st.divider()
st.header("🧠 AI Learning Planner")

st.write(
    "Get a personalized study plan based on your "
    "quiz and interview performance."
)

if st.button("Generate Learning Plan"):

    try:
        with st.spinner(
            "Analyzing your learning progress..."
        ):
            learning_plan = generate_learning_plan()

        st.markdown(
            "### 🎯 Your Personalized Study Plan"
        )

        st.write(learning_plan)

    except Exception as e:
        st.error(
            f"Something went wrong: {e}"
        )

# ==================================================
# FOOTER
# ==================================================

st.divider()

st.caption(
    "AI Learning Agent • "
    "RAG + AI Tutor + Quiz + Interview + Progress"
)
