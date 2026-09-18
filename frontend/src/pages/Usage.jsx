import { useEffect, useState } from "react";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  BrainCircuit,
  Coins,
  MessageSquare,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getUsage } from "../services/api";

const Usage = () => {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsage = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getUsage();
      setUsage(data);
    } catch (err) {
      setError(err.message || "Failed to load usage statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsage();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="rounded-xl border border-white/10 bg-white/5 p-2.5 transition hover:bg-white/10"
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <h1 className="text-3xl font-bold">
                AI Usage Analytics
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Monitor your AI requests and token consumption.
              </p>
            </div>
          </div>

          <button
            onClick={loadUsage}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium transition hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading && !usage ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex items-center gap-3 text-slate-400">
              <RefreshCw size={20} className="animate-spin" />
              Loading analytics...
            </div>
          </div>
        ) : usage ? (
          <>
            {/* Summary Cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                  <Activity size={22} />
                </div>

                <p className="text-sm text-slate-400">
                  Total Requests
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {usage.total_requests}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-400/10 text-purple-400">
                  <Coins size={22} />
                </div>

                <p className="text-sm text-slate-400">
                  Total Tokens
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {usage.total_tokens.toLocaleString()}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-400/10 text-blue-400">
                  <MessageSquare size={22} />
                </div>

                <p className="text-sm text-slate-400">
                  Input Tokens
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {usage.input_tokens.toLocaleString()}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                  <Sparkles size={22} />
                </div>

                <p className="text-sm text-slate-400">
                  Output Tokens
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {usage.output_tokens.toLocaleString()}
                </p>
              </div>

            </div>

            {/* Feature Usage */}
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">

              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-cyan-400/10 p-3 text-cyan-400">
                  <BarChart3 size={21} />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">
                    Usage by Feature
                  </h2>

                  <p className="text-sm text-slate-400">
                    See which AI tools consume the most tokens.
                  </p>
                </div>
              </div>

              {usage.features.length === 0 ? (
                <div className="py-12 text-center">
                  <BrainCircuit
                    size={40}
                    className="mx-auto mb-4 text-slate-600"
                  />

                  <p className="text-slate-400">
                    No AI usage recorded yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {usage.features.map((item) => (
                    <div
                      key={item.feature}
                      className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-white/5 p-2.5">
                            <BrainCircuit size={19} />
                          </div>

                          <div>
                            <p className="font-semibold capitalize">
                              {item.feature}
                            </p>

                            <p className="text-xs text-slate-500">
                              {item.requests} request
                              {item.requests !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold">
                            {item.total_tokens.toLocaleString()}
                          </p>

                          <p className="text-xs text-slate-500">
                            tokens
                          </p>
                        </div>
                      </div>

                      {/* Usage bar */}
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-cyan-400"
                          style={{
                            width: `${Math.min(
                              (item.total_tokens /
                                Math.max(usage.total_tokens, 1)) *
                                100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}

      </div>
    </div>
  );
};

export default Usage;