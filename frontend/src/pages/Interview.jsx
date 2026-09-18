import { useState } from "react";
import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Send,
  Sparkles,
  Trophy,
  User,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  startInterview,
  submitInterviewAnswer,
} from "../services/api";


const Interview = () => {
  const [topic, setTopic] = useState("");

  const [started, setStarted] = useState(false);
  const [question, setQuestion] = useState("");

  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async (e) => {
    e.preventDefault();

    if (!topic.trim()) {
      setError("Please enter an interview topic.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);
      setAnswer("");

      const data = await startInterview(topic.trim());

      setQuestion(data.question);
      setStarted(true);
    } catch (error) {
      setError(
        error.message ||
          "Failed to start interview. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!answer.trim()) {
      setError("Please enter your answer.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await submitInterviewAnswer({
        topic: topic.trim(),
        previous_question: question,
        student_answer: answer.trim(),
      });

      setResult(data);
      setQuestion(data.next_question);
      setAnswer("");
    } catch (error) {
      setError(
        error.message ||
          "Failed to evaluate your answer."
      );
    } finally {
      setLoading(false);
    }
  };


  const resetInterview = () => {
    setTopic("");
    setStarted(false);
    setQuestion("");
    setAnswer("");
    setResult(null);
    setError("");
  };


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
                  AI Interviewer
                </h1>

                <p className="text-xs text-slate-400">
                  Practice with your AI interviewer
                </p>
              </div>
            </div>
          </div>

          {started && (
            <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Interview Active
            </div>
          )}

        </div>
      </header>


      <main className="mx-auto max-w-5xl px-6 py-10">

        {/* Setup */}
        {!started && (
          <div className="mx-auto max-w-2xl">

            <div className="mb-8 text-center">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 ring-1 ring-white/10">
                <Sparkles
                  size={30}
                  className="text-violet-300"
                />
              </div>

              <h2 className="text-3xl font-bold">
                Start Your AI Interview
              </h2>

              <p className="mt-3 text-slate-400">
                Test your knowledge with an interactive
                AI-powered technical interview.
              </p>

            </div>


            <form
              onSubmit={handleStart}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl"
            >

              <label className="mb-3 block text-sm font-medium text-slate-300">
                Interview Topic
              </label>

              <input
                type="text"
                value={topic}
                onChange={(e) =>
                  setTopic(e.target.value)
                }
                placeholder="e.g. Transformers, Python, Machine Learning"
                className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-5 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20"
              />

              {error && (
                <p className="mt-3 text-sm text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-4 font-semibold transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Clock3
                      size={18}
                      className="animate-spin"
                    />
                    Starting Interview...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Start Interview
                  </>
                )}
              </button>

            </form>

          </div>
        )}


        {/* Interview */}
        {started && (
          <div className="space-y-6">

            {/* Topic */}
            <div className="flex flex-wrap items-center justify-between gap-3">

              <div>
                <p className="text-sm text-slate-500">
                  Interview Topic
                </p>

                <h2 className="text-xl font-semibold">
                  {topic}
                </h2>
              </div>

              <button
                onClick={resetInterview}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10"
              >
                End Interview
              </button>

            </div>


            {/* Question */}
            <div className="rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/[0.08] to-cyan-500/[0.04] p-7">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20">
                  <BrainCircuit
                    size={21}
                    className="text-violet-300"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-violet-300">
                    AI Interviewer
                  </p>

                  <p className="text-xs text-slate-500">
                    Technical Question
                  </p>
                </div>

              </div>

              <p className="text-xl leading-8 text-slate-100">
                {question}
              </p>

            </div>


            {/* Answer */}
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
            >

              <div className="mb-4 flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/10">
                  <User
                    size={18}
                    className="text-cyan-300"
                  />
                </div>

                <span className="font-medium">
                  Your Answer
                </span>

              </div>

              <textarea
                value={answer}
                onChange={(e) =>
                  setAnswer(e.target.value)
                }
                rows={7}
                placeholder="Explain your answer in detail..."
                className="w-full resize-none rounded-2xl border border-white/10 bg-slate-900/80 p-5 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/10"
              />

              {error && (
                <p className="mt-3 text-sm text-red-400">
                  {error}
                </p>
              )}

              <div className="mt-4 flex justify-end">

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 font-semibold transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
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
                      Submit Answer
                      <Send size={17} />
                    </>
                  )}
                </button>

              </div>

            </form>


            {/* Evaluation */}
            {result && (
              <div className="space-y-5">

                {/* Score */}
                <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.05] p-6">

                  <div className="flex flex-wrap items-center justify-between gap-5">

                    <div className="flex items-center gap-4">

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10">
                        <Trophy
                          size={27}
                          className="text-emerald-300"
                        />
                      </div>

                      <div>
                        <p className="text-sm text-slate-400">
                          Your Score
                        </p>

                        <p className="text-3xl font-bold">
                          {result.score}
                          <span className="text-lg text-slate-500">
                            /10
                          </span>
                        </p>
                      </div>

                    </div>

                    <div className="text-right">

                      <p className="text-sm text-slate-500">
                        Evaluation
                      </p>

                      <p className="max-w-xl text-sm text-slate-300">
                        {result.evaluation}
                      </p>

                    </div>

                  </div>

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
                        What You Got Right
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


                {/* Improvement */}
                <div className="rounded-3xl border border-violet-400/10 bg-violet-500/[0.04] p-6">

                  <div className="mb-4 flex items-center gap-3">

                    <Sparkles
                      size={20}
                      className="text-violet-300"
                    />

                    <h3 className="font-semibold">
                      How to Improve
                    </h3>

                  </div>

                  <p className="text-sm leading-7 text-slate-300">
                    {result.improvement}
                  </p>

                </div>

              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
};


export default Interview;