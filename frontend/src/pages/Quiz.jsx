import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  generateQuiz,
  saveQuizResult,
} from "../services/api";

import AnimatedBackground from "../components/AnimatedBackground";
import { useAuth } from "../context/AuthContext";

const Quiz = () => {
  const { user } = useAuth();

  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);

  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setQuiz(null);
      setAnswers({});
      setCurrentQuestion(0);
      setSubmitted(false);

      const data = await generateQuiz(
        topic.trim(),
        Number(numQuestions)
      );

      setQuiz(data);
    } catch (error) {
      setError(
        error.message ||
          "Failed to generate quiz. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (answerIndex) => {
    if (submitted) {
      return;
    }

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion]: answerIndex,
    }));
  };

  const nextQuestion = () => {
    if (!quiz) return;

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((previous) => previous - 1);
    }
  };

    const handleSubmitQuiz = async () => {
      if (!quiz) return;

      const finalScore = calculateScore();

      setSubmitted(true);

      try {
          await saveQuizResult(
          topic.trim(),
          finalScore,
          quiz.questions.length
          );
      } catch (error) {
          console.error("Failed to save quiz result:", error);
      }
    };

  const restartQuiz = () => {
    setQuiz(null);
    setAnswers({});
    setCurrentQuestion(0);
    setSubmitted(false);
    setError("");
  };

  const calculateScore = () => {
    if (!quiz) return 0;

    return quiz.questions.reduce(
      (score, question, index) => {
        return (
          score +
          (answers[index] === question.correct_answer
            ? 1
            : 0)
        );
      },
      0
    );
  };

  const score = calculateScore();
  

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

      <AnimatedBackground />

      <div className="relative z-10 min-h-screen">

        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-white/10 bg-slate-950/70 px-5 backdrop-blur-xl sm:px-8">

          <div className="flex items-center gap-4">

            <Link
              to="/dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div className="h-7 w-px bg-white/10" />

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500">
                <BrainCircuit className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-sm font-semibold">
                  Smart Quiz
                </h1>

                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[11px] text-slate-500">
                    AI Powered
                  </span>
                </div>
              </div>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">
              <p className="text-xs text-slate-300">
                {user?.name || "Learner"}
              </p>

              <p className="text-[10px] text-slate-600">
                Learning Mode
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 text-sm font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "L"}
            </div>

          </div>

        </header>

        <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">

          {/* Setup */}
          {!quiz && (
            <QuizSetup
              topic={topic}
              setTopic={setTopic}
              numQuestions={numQuestions}
              setNumQuestions={setNumQuestions}
              handleGenerate={handleGenerate}
              loading={loading}
              error={error}
            />
          )}

          {/* Quiz */}
          {quiz && !submitted && (
            <QuizQuestion
              quiz={quiz}
              currentQuestion={currentQuestion}
              answers={answers}
              selectAnswer={selectAnswer}
              previousQuestion={previousQuestion}
              nextQuestion={nextQuestion}
              handleSubmitQuiz={handleSubmitQuiz}
            />
          )}

          {/* Results */}
          {quiz && submitted && (
            <QuizResults
              quiz={quiz}
              score={score}
              answers={answers}
              restartQuiz={restartQuiz}
              topic={topic}
            />
          )}

        </main>
      </div>
    </div>
  );
};


/* =========================
   Quiz Setup
========================= */

const QuizSetup = ({
  topic,
  setTopic,
  numQuestions,
  setNumQuestions,
  handleGenerate,
  loading,
  error,
}) => {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">

      <div className="w-full max-w-2xl">

        {/* Heading */}
        <div className="mb-8 text-center">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-2xl shadow-violet-600/30">

            <BrainCircuit className="h-8 w-8" />

          </div>

          <div className="mb-3 flex items-center justify-center gap-2 text-sm text-violet-400">
            <Sparkles className="h-4 w-4" />
            AI-generated assessment
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Test your{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              knowledge
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
            Choose a topic and let AI generate a personalized
            quiz from your learning material.
          </p>

        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-violet-950/30 backdrop-blur-2xl sm:p-8">

          <form
            onSubmit={handleGenerate}
            className="space-y-6"
          >

            {/* Topic */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                What do you want to practice?
              </label>

              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Attention Mechanism"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
              />

            </div>

            {/* Number */}
            <div>

              <label className="mb-3 block text-sm font-medium text-slate-300">
                Number of questions
              </label>

              <div className="grid grid-cols-4 gap-3">

                {[5, 10, 15, 20].map((number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() =>
                      setNumQuestions(number)
                    }
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                      numQuestions === number
                        ? "border-violet-500/50 bg-violet-500/15 text-violet-300"
                        : "border-white/10 bg-white/[0.03] text-slate-500 hover:border-white/20 hover:text-slate-300"
                    }`}
                  >
                    {number}
                  </button>
                ))}

              </div>

            </div>

            {/* Info */}
            <div className="grid gap-3 sm:grid-cols-3">

              <InfoItem
                icon="🧠"
                title="AI Generated"
              />

              <InfoItem
                icon="📚"
                title="RAG Powered"
              />

              <InfoItem
                icon="🎯"
                title="Instant Score"
              />

            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Generate */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-3.5 font-semibold shadow-lg shadow-violet-600/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Generating quiz...
                </>
              ) : (
                <>
                  Generate Quiz
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

          </form>

        </div>

      </div>
    </div>
  );
};


/* =========================
   Question
========================= */

const QuizQuestion = ({
  quiz,
  currentQuestion,
  answers,
  selectAnswer,
  previousQuestion,
  nextQuestion,
  handleSubmitQuiz,
}) => {
  const question = quiz.questions[currentQuestion];

  const totalQuestions = quiz.questions.length;

  const progress =
    ((currentQuestion + 1) / totalQuestions) * 100;

  const isLast =
    currentQuestion === totalQuestions - 1;

  return (
    <div className="mx-auto max-w-3xl">

      {/* Top */}
      <div className="mb-6 flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-violet-400">
            Question {currentQuestion + 1}
            <span className="text-slate-600">
              {" "}
              / {totalQuestions}
            </span>
          </p>
        </div>

        <span className="text-xs text-slate-600">
          {Math.round(progress)}% complete
        </span>

      </div>

      {/* Progress bar */}
      <div className="mb-8 h-1.5 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      {/* Question card */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-violet-950/20 backdrop-blur-2xl sm:p-8">

        <div className="mb-8">

          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
            <BrainCircuit className="h-5 w-5" />
          </div>

          <h2 className="text-xl font-semibold leading-8 text-slate-100 sm:text-2xl">
            {question.question}
          </h2>

        </div>

        {/* Options */}
        <div className="space-y-3">

          {question.options.map(
            (option, index) => {
              const selected =
                answers[currentQuestion] === index;

              return (
                <button
                  key={index}
                  onClick={() =>
                    selectAnswer(index)
                  }
                  className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                    selected
                      ? "border-violet-500/50 bg-violet-500/10"
                      : "border-white/10 bg-white/[0.02] hover:border-violet-400/30 hover:bg-white/[0.05]"
                  }`}
                >

                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${
                      selected
                        ? "bg-violet-600 text-white"
                        : "bg-white/5 text-slate-500 group-hover:text-slate-300"
                    }`}
                  >
                    {String.fromCharCode(
                      65 + index
                    )}
                  </div>

                  <span
                    className={`text-sm leading-6 ${
                      selected
                        ? "text-white"
                        : "text-slate-400"
                    }`}
                  >
                    {option}
                  </span>

                  {selected && (
                    <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-violet-400" />
                  )}

                </button>
              );
            }
          )}

        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">

          <button
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-400 transition hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>

          {isLast ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={
                Object.keys(answers).length !==
                totalQuestions
              }
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-violet-600/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Submit Quiz
              <CheckCircle2 className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              disabled={
                answers[currentQuestion] ===
                undefined
              }
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          )}

        </div>

      </div>

      {/* Answer count */}
      <p className="mt-4 text-center text-xs text-slate-700">
        {Object.keys(answers).length} of{" "}
        {totalQuestions} questions answered
      </p>

    </div>
  );
};


/* =========================
   Results
========================= */

const QuizResults = ({
  quiz,
  score,
  answers,
  restartQuiz,
  topic,
}) => {
  const total = quiz.questions.length;

  const percentage = Math.round(
    (score / total) * 100
  );

  const getMessage = () => {
    if (percentage >= 90) {
      return "Excellent work! You really know this topic.";
    }

    if (percentage >= 70) {
      return "Great job! Keep practicing to master this topic.";
    }

    if (percentage >= 50) {
      return "Good attempt! Review the explanations and try again.";
    }

    return "Keep learning! Review the material and try again.";
  };

  return (
    <div className="mx-auto max-w-4xl">

      {/* Result header */}
      <div className="mb-8 text-center">

        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 shadow-2xl shadow-violet-600/30">

          <Trophy className="h-9 w-9" />

        </div>

        <p className="text-sm text-violet-400">
          Quiz completed
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          Your Score
        </h2>

        <div className="mt-4 text-5xl font-bold">
          <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            {percentage}%
          </span>
        </div>

        <p className="mt-3 text-sm text-slate-500">
          {score} out of {total} correct • {topic}
        </p>

        <p className="mt-2 text-sm text-slate-400">
          {getMessage()}
        </p>

      </div>

      {/* Actions */}
      <div className="mb-8 flex justify-center">

        <button
          onClick={restartQuiz}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-3 text-sm font-semibold shadow-lg shadow-violet-600/20 transition hover:-translate-y-0.5"
        >
          <RotateCcw className="h-4 w-4" />
          Take Another Quiz
        </button>

      </div>

      {/* Review */}
      <div className="space-y-4">

        <h3 className="text-lg font-semibold">
          Review Answers
        </h3>

        {quiz.questions.map(
          (question, index) => {
            const correct =
              answers[index] ===
              question.correct_answer;

            return (
              <div
                key={index}
                className={`rounded-2xl border p-5 ${
                  correct
                    ? "border-emerald-400/10 bg-emerald-400/[0.03]"
                    : "border-red-400/10 bg-red-400/[0.03]"
                }`}
              >

                <div className="flex gap-4">

                  <div className="shrink-0 pt-0.5">

                    {correct ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400" />
                    )}

                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-sm font-medium leading-6 text-slate-200">
                      {index + 1}.{" "}
                      {question.question}
                    </p>

                    <p className="mt-3 text-xs text-slate-500">
                      Your answer:
                    </p>

                    <p
                      className={`mt-1 text-sm ${
                        correct
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {question.options[
                        answers[index]
                      ] || "Not answered"}
                    </p>

                    {!correct && (
                      <>
                        <p className="mt-3 text-xs text-slate-500">
                          Correct answer:
                        </p>

                        <p className="mt-1 text-sm text-emerald-400">
                          {
                            question.options[
                              question.correct_answer
                            ]
                          }
                        </p>
                      </>
                    )}

                    <div className="mt-4 rounded-xl bg-black/20 p-3">

                      <p className="text-xs font-medium text-slate-500">
                        Explanation
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        {question.explanation}
                      </p>

                    </div>

                  </div>

                </div>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
};


/* =========================
   Info Item
========================= */

const InfoItem = ({
  icon,
  title,
}) => {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">

      <div className="text-lg">
        {icon}
      </div>

      <p className="mt-1 text-xs text-slate-500">
        {title}
      </p>

    </div>
  );
};

export default Quiz;