import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ArrowRight,
  BrainCircuit,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
} from "lucide-react";

import AnimatedBackground from "../components/AnimatedBackground";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      await login({
        email: form.email,
        password: form.password,
      });

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <AnimatedBackground />

      {/* Logo */}
      <Link
        to="/"
        className="absolute left-6 top-6 z-[50] flex cursor-pointer items-center gap-3 sm:left-10 sm:top-8"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/10 shadow-lg backdrop-blur-xl transition hover:scale-105">
          <BrainCircuit className="h-6 w-6 text-cyan-400" />
        </div>

        <div>
          <h1 className="font-semibold tracking-wide">
            LearnAI
          </h1>

          <p className="text-xs text-slate-500">
            AI Learning Agent
          </p>
        </div>
      </Link>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-5 py-6">
        <div className="grid w-full max-w-6xl items-center gap-16 lg:grid-cols-2">

          {/* Left content */}
          <section className="hidden lg:block">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-300 backdrop-blur-xl">
              <Sparkles className="h-4 w-4" />
              AI-powered learning
            </div>

            <h2 className="max-w-xl text-6xl font-bold leading-[1.05] tracking-tight">
              Learn smarter.
              <br />

              <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Grow faster.
              </span>
            </h2>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">
              Study with an AI tutor, test your knowledge,
              practice technical interviews, and follow a
              personalized learning path.
            </p>

            {/* Feature cards */}
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">

              <Feature
                icon="🤖"
                title="AI Tutor"
              />

              <Feature
                icon="🧠"
                title="Smart Quiz"
              />

              <Feature
                icon="🎤"
                title="Interview"
              />

            </div>
          </section>

          {/* Login card */}
          <section className="mx-auto w-full max-w-md">

            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-violet-950/40 backdrop-blur-2xl sm:p-7">

              {/* Card heading */}
              <div className="mb-5">

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-xl shadow-violet-600/20">
                  <Sparkles className="h-7 w-7" />
                </div>

                <h2 className="text-2xl font-bold tracking-tight">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Continue your learning journey.
                </p>

              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Email */}
                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Email
                  </label>

                  <div className="relative">

                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="w-full rounded-xl border border-white/10 bg-black/20 py-3.5 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
                    />

                  </div>
                </div>

                {/* Password */}
                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label className="text-sm font-medium text-slate-300">
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs text-violet-400 transition hover:text-violet-300"
                    >
                      Forgot password?
                    </button>

                  </div>

                  <div className="relative">

                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="w-full rounded-xl border border-white/10 bg-black/20 py-3.5 pl-12 pr-12 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>

                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-3.5 font-semibold shadow-lg shadow-violet-600/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-600/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Sign in"}

                  {!loading && (
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  )}
                </button>

              </form>

              {/* Divider */}
              <div className="my-5 flex items-center gap-4">

                <div className="h-px flex-1 bg-white/10" />

                <span className="text-xs text-slate-600">
                  OR
                </span>

                <div className="h-px flex-1 bg-white/10" />

              </div>

              {/* Signup */}
              <p className="text-center text-sm text-slate-400">

                Don't have an account?{" "}

                <Link
                  to="/signup"
                  className="font-medium text-violet-400 transition hover:text-violet-300"
                >
                  Create account
                </Link>

              </p>

            </div>

            <p className="mt-6 text-center text-xs text-slate-600">
              RAG • AI Agents • Personalized Learning
            </p>

          </section>
        </div>
      </main>
    </div>
  );
};

const Feature = ({ icon, title }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:bg-white/[0.07]">

      <div className="text-2xl">
        {icon}
      </div>

      <p className="mt-3 text-sm font-medium text-slate-300">
        {title}
      </p>

    </div>
  );
};

export default Login;