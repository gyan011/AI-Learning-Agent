import { useState } from "react";
import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Lightbulb,
  Target,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import { getLearningPlan } from "../services/api";


const Planner = () => {
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const generatePlan = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getLearningPlan();

      setPlan(data.plan);
    } catch (error) {
      setError(
        error.message ||
          "Failed to generate learning plan."
      );
    } finally {
      setLoading(false);
    }
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
                  Learning Planner
                </h1>

                <p className="text-xs text-slate-400">
                  Your personalized AI study plan
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


      <main className="mx-auto max-w-5xl px-6 py-10">

        {/* Hero */}
        <section className="mb-8 rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/[0.08] to-cyan-500/[0.04] p-8">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10">
                <Sparkles
                  size={24}
                  className="text-violet-300"
                />
              </div>

              <h2 className="text-3xl font-bold">
                Your AI Learning Plan
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-slate-400">
                Your recent quiz and interview performance
                is analyzed to identify strengths, weaknesses,
                and what you should study next.
              </p>

            </div>


            <button
              onClick={generatePlan}
              disabled={loading}
              className="flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-4 font-semibold transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
            >

              {loading ? (
                <>
                  <Clock3
                    size={18}
                    className="animate-spin"
                  />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Plan
                </>
              )}

            </button>

          </div>

        </section>


        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/5 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}


        {/* Empty State */}
        {!plan && !loading && !error && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10">
              <Target
                size={30}
                className="text-cyan-300"
              />
            </div>

            <h3 className="text-xl font-semibold">
              Ready to plan your next step?
            </h3>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400">
              Generate a personalized learning plan based
              on your completed quizzes and interviews.
            </p>

          </div>
        )}


        {/* Loading */}
        {loading && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
                <BrainCircuit
                  size={22}
                  className="animate-pulse text-violet-300"
                />
              </div>

              <div>
                <p className="font-medium">
                  AI is analyzing your progress...
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Reviewing your quiz and interview results.
                </p>
              </div>

            </div>

          </div>
        )}


        {/* Plan */}
        {plan && !loading && (
          <div className="space-y-5">

            {/* Overall */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                  <BrainCircuit
                    size={21}
                    className="text-violet-300"
                  />
                </div>

                <h3 className="text-lg font-semibold">
                  AI Analysis
                </h3>

              </div>

              <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-li:text-slate-300">
                <ReactMarkdown>
                  {plan}
                </ReactMarkdown>
              </div>

            </div>


            {/* Study Actions */}
            <div className="grid gap-5 md:grid-cols-3">

              <div className="rounded-3xl border border-emerald-400/10 bg-emerald-400/[0.04] p-6">

                <CheckCircle2
                  size={22}
                  className="mb-4 text-emerald-400"
                />

                <h3 className="font-semibold">
                  Strong Areas
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Continue practicing topics where your
                  performance is already strong.
                </p>

              </div>


              <div className="rounded-3xl border border-orange-400/10 bg-orange-400/[0.04] p-6">

                <Target
                  size={22}
                  className="mb-4 text-orange-300"
                />

                <h3 className="font-semibold">
                  Weak Areas
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Focus more time on concepts where your
                  quiz or interview performance needs improvement.
                </p>

              </div>


              <div className="rounded-3xl border border-cyan-400/10 bg-cyan-400/[0.04] p-6">

                <BookOpen
                  size={22}
                  className="mb-4 text-cyan-300"
                />

                <h3 className="font-semibold">
                  Recommended Topics
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Follow the AI-generated topics and use
                  them as your next study targets.
                </p>

              </div>

            </div>


            {/* Next Action */}
            <div className="rounded-3xl border border-violet-400/20 bg-gradient-to-r from-violet-500/[0.08] to-cyan-500/[0.05] p-7">

              <div className="flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                  <Lightbulb
                    size={22}
                    className="text-violet-300"
                  />
                </div>

                <div>

                  <h3 className="font-semibold">
                    Your Next Action
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    Follow the recommended topics and
                    complete another quiz or interview to
                    update your learning plan.
                  </p>

                </div>

              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
};


export default Planner;