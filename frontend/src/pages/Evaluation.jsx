import { useState } from "react";
import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import { evaluateAnswer } from "../services/api";


const Evaluation = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleEvaluate = async (e) => {
    e.preventDefault();

    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }

    if (!answer.trim()) {
      setError("Please enter your answer.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const data = await evaluateAnswer(
        question.trim(),
        answer.trim()
      );

      setResult(data);
    } catch (error) {
      setError(
        error.message ||
          "Failed to evaluate your answer."
      );
    } finally {
      setLoading(false);
    }
  };


  const resetEvaluation = () => {
    setQuestion("");
    setAnswer("");
    setResult(null);
    setError("");
  };


  const scorePercentage = result
    ? result.overall_score * 10
    : 0;


  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div className="flex items-center gap-4">

            <Link
              to="/dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10"
            >
              <ArrowLeft size={20} />
            </Link>

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500">
                <BrainCircuit size={22} />
              </div>

              <div>
                <h1 className="font-semibold">
                  Answer Evaluation
                </h1>

                <p className="text-xs text-slate-400">
                  Improve your answers with AI
                </p>
              </div>

            </div>

          </div>


          <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">

            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            AI Online

          </div>

        </div>

      </header>


      <main className="mx-auto max-w-6xl px-6 py-10">

        {/* Hero */}
        <div className="mb-8">

          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10">

            <Sparkles
              size={25}
              className="text-violet-300"
            />

          </div>

          <h2 className="text-3xl font-bold">
            Evaluate Your Knowledge
          </h2>

          <p className="mt-3 max-w-2xl text-slate-400">
            Submit a question and your answer. The AI
            will evaluate correctness, relevance,
            completeness, and clarity using your study
            material.
          </p>

        </div>


        <div className="grid gap-6 lg:grid-cols-2">

          {/* Input */}
          <form
            onSubmit={handleEvaluate}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
          >

            <div className="mb-6 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">

                <MessageSquareText
                  size={21}
                  className="text-cyan-300"
                />

              </div>

              <div>

                <h3 className="font-semibold">
                  Your Response
                </h3>

                <p className="text-xs text-slate-500">
                  Enter the question and your answer
                </p>

              </div>

            </div>


            <label className="mb-2 block text-sm font-medium text-slate-300">
              Question
            </label>

            <textarea
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              rows={4}
              placeholder="e.g. What is the attention mechanism?"
              className="mb-5 w-full resize-none rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-white outline-none placeholder:text-slate-500 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10"
            />


            <label className="mb-2 block text-sm font-medium text-slate-300">
              Your Answer
            </label>

            <textarea
              value={answer}
              onChange={(e) =>
                setAnswer(e.target.value)
              }
              rows={9}
              placeholder="Write your answer here..."
              className="w-full resize-none rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/10"
            />


            {error && (
              <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}


            <div className="mt-5 flex gap-3">

              <button
                type="submit"
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-3 font-semibold transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
              >

                {loading ? (
                  <>
                    <Clock3
                      size={18}
                      className="animate-spin"
                    />
                    Evaluating...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Evaluate Answer
                  </>
                )}

              </button>


              {(question || answer || result) && (
                <button
                  type="button"
                  onClick={resetEvaluation}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-slate-300 transition hover:bg-white/10"
                >
                  Clear
                </button>
              )}

            </div>

          </form>


          {/* Result */}
          <div>

            {!result && !loading && (
              <div className="flex min-h-[520px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">

                <div>

                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10">

                    <Target
                      size={30}
                      className="text-violet-300"
                    />

                  </div>

                  <h3 className="text-xl font-semibold">
                    Your Evaluation Will Appear Here
                  </h3>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                    Submit your answer and the AI will
                    provide detailed feedback and a score.
                  </p>

                </div>

              </div>
            )}


            {loading && (
              <div className="flex min-h-[520px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03]">

                <div className="text-center">

                  <BrainCircuit
                    size={40}
                    className="mx-auto mb-5 animate-pulse text-violet-300"
                  />

                  <p className="font-medium">
                    AI is evaluating your answer...
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Comparing your response with the study material.
                  </p>

                </div>

              </div>
            )}


            {result && !loading && (
              <div className="space-y-5">

                {/* Overall Score */}
                <div className="rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/[0.08] to-cyan-500/[0.04] p-6">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-sm text-slate-400">
                        Overall Score
                      </p>

                      <p className="mt-1 text-5xl font-bold">
                        {result.overall_score}
                        <span className="text-xl text-slate-500">
                          /10
                        </span>
                      </p>

                    </div>


                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-violet-400/30">

                      <span className="text-lg font-bold">
                        {scorePercentage}%
                      </span>

                    </div>

                  </div>

                  <p className="mt-5 text-sm leading-6 text-slate-300">
                    {result.feedback}
                  </p>

                </div>


                {/* Category Scores */}
                <div className="grid grid-cols-2 gap-3">

                  <ScoreCard
                    title="Correctness"
                    score={result.correctness}
                  />

                  <ScoreCard
                    title="Relevance"
                    score={result.relevance}
                  />

                  <ScoreCard
                    title="Completeness"
                    score={result.completeness}
                  />

                  <ScoreCard
                    title="Clarity"
                    score={result.clarity}
                  />

                </div>


                {/* Correct Points */}
                {result.correct_points?.length > 0 && (
                  <div className="rounded-3xl border border-emerald-400/10 bg-white/[0.03] p-6">

                    <div className="mb-4 flex items-center gap-3">

                      <CheckCircle2
                        size={20}
                        className="text-emerald-400"
                      />

                      <h3 className="font-semibold">
                        Correct Points
                      </h3>

                    </div>

                    <ul className="space-y-2">

                      {result.correct_points.map(
                        (point, index) => (
                          <li
                            key={index}
                            className="text-sm leading-6 text-slate-300"
                          >
                            • {point}
                          </li>
                        )
                      )}

                    </ul>

                  </div>
                )}


                {/* Missing */}
                {result.missing_or_incorrect?.length > 0 && (
                  <div className="rounded-3xl border border-red-400/10 bg-white/[0.03] p-6">

                    <div className="mb-4 flex items-center gap-3">

                      <XCircle
                        size={20}
                        className="text-red-400"
                      />

                      <h3 className="font-semibold">
                        Missing or Incorrect
                      </h3>

                    </div>

                    <ul className="space-y-2">

                      {result.missing_or_incorrect.map(
                        (point, index) => (
                          <li
                            key={index}
                            className="text-sm leading-6 text-slate-300"
                          >
                            • {point}
                          </li>
                        )
                      )}

                    </ul>

                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      </main>

    </div>
  );
};


const ScoreCard = ({ title, score }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">

      <p className="text-xs text-slate-500">
        {title}
      </p>

      <div className="mt-2 flex items-end justify-between">

        <p className="text-2xl font-bold">
          {score}
          <span className="text-sm text-slate-500">
            /10
          </span>
        </p>

        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">

          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
            style={{
              width: `${score * 10}%`,
            }}
          />

        </div>

      </div>

    </div>
  );
};


export default Evaluation;