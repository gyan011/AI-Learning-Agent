import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  BrainCircuit,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const getPasswordStrength = () => {
    const password = form.password;

    if (!password) {
      return {
        label: "",
        width: "0%",
      };
    }

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) {
      return {
        label: "Weak",
        width: "25%",
      };
    }

    if (score === 2) {
      return {
        label: "Medium",
        width: "50%",
      };
    }

    if (score === 3) {
      return {
        label: "Strong",
        width: "75%",
      };
    }

    return {
      label: "Very strong",
      width: "100%",
    };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agree) {
      setError(
        "Please accept the Terms of Service and Privacy Policy."
      );
      return;
    }

    try {
      setError("");

      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      navigate("/dashboard");

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* ================= BACKGROUND ================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-slate-950" />

        <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-violet-600/20 blur-[110px] animate-pulse" />

        <div className="absolute -right-32 top-1/4 h-[420px] w-[420px] rounded-full bg-cyan-500/15 blur-[110px] animate-pulse" />

        <div className="absolute bottom-[-220px] left-1/3 h-[450px] w-[450px] rounded-full bg-fuchsia-600/10 blur-[110px]" />

        {/* Grid */}

        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(255,255,255,0.4) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,0.4) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "55px 55px",
          }}
        />

        {/* Floating Nodes */}

        <div className="absolute left-[12%] top-[20%] h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_25px_8px_rgba(34,211,238,0.2)] animate-pulse" />

        <div className="absolute left-[24%] top-[70%] h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_25px_8px_rgba(139,92,246,0.2)] animate-pulse" />

        <div className="absolute right-[16%] top-[25%] h-2 w-2 rounded-full bg-fuchsia-400 shadow-[0_0_25px_8px_rgba(217,70,239,0.2)] animate-pulse" />

        <div className="absolute right-[28%] bottom-[20%] h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_25px_8px_rgba(34,211,238,0.2)] animate-pulse" />

        {/* Connecting Lines */}

        <div className="absolute left-[13%] top-[21%] h-px w-[14%] rotate-[18deg] bg-gradient-to-r from-cyan-400/30 to-violet-400/10" />

        <div className="absolute left-[25%] top-[70%] h-px w-[17%] rotate-[-20deg] bg-gradient-to-r from-violet-400/20 to-fuchsia-400/10" />

        <div className="absolute right-[17%] top-[26%] h-px w-[16%] rotate-[25deg] bg-gradient-to-r from-fuchsia-400/20 to-cyan-400/10" />
      </div>

      {/* ================= MAIN ================= */}

      <main className="relative z-10 min-h-screen px-5 py-3">

        {/* ================= HEADER ================= */}

        <div className="mx-auto flex max-w-6xl items-center justify-between">

          <Link
            to="/"
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-lg shadow-violet-500/20">
              <BrainCircuit size={21} />
            </div>

            <span className="text-lg font-bold tracking-tight">
              Learn<span className="text-cyan-400">AI</span>
            </span>
          </Link>

        </div>

        {/* ================= CONTENT ================= */}

        <div className="mx-auto grid min-h-[calc(100vh-60px)] max-w-6xl items-start gap-10 pt-2 lg:grid-cols-2">

          {/* ================= LEFT SIDE ================= */}

          <div className="hidden lg:block pt-16">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs text-violet-300">
              <Sparkles size={13} />
              Start your AI-powered journey
            </div>

            <h1 className="max-w-xl text-4xl font-bold leading-tight xl:text-5xl">
              Turn learning into an{" "}

              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                intelligent experience.
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-6 text-slate-400">
              Create your account and unlock an AI learning environment
              designed to help you understand, practice, and improve faster.
            </p>

            {/* AI Journey */}

            <div className="relative mt-8 h-52 w-full max-w-lg">

              {/* Central Brain */}

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">

                <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-violet-400/30 bg-violet-500/10 shadow-[0_0_60px_rgba(139,92,246,0.25)] backdrop-blur-xl">

                  <BrainCircuit
                    size={40}
                    className="text-violet-300"
                  />

                </div>

              </div>

              {/* Orbit */}

              <div className="absolute left-1/2 top-1/2 h-40 w-72 -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-[50%] border border-cyan-400/20" />

              <div className="absolute left-1/2 top-1/2 h-40 w-72 -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-[50%] border border-violet-400/20" />

              {/* AI Tutor */}

              <div className="absolute left-2 top-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 backdrop-blur-xl">

                <p className="text-[10px] text-slate-500">
                  AI TUTOR
                </p>

                <p className="text-xs font-semibold text-cyan-300">
                  Learn smarter
                </p>

              </div>

              {/* Quiz */}

              <div className="absolute right-2 top-8 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 backdrop-blur-xl">

                <p className="text-[10px] text-slate-500">
                  QUIZ
                </p>

                <p className="text-xs font-semibold text-violet-300">
                  Test knowledge
                </p>

              </div>

              {/* Interview */}

              <div className="absolute bottom-2 left-16 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 backdrop-blur-xl">

                <p className="text-[10px] text-slate-500">
                  INTERVIEW
                </p>

                <p className="text-xs font-semibold text-fuchsia-300">
                  Build confidence
                </p>

              </div>

              {/* Planner */}

              <div className="absolute bottom-4 right-12 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 backdrop-blur-xl">

                <p className="text-[10px] text-slate-500">
                  PLANNER
                </p>

                <p className="text-xs font-semibold text-cyan-300">
                  Stay on track
                </p>

              </div>

            </div>
          </div>

          {/* ================= SIGNUP CARD ================= */}

          <div className="mx-auto w-full max-w-md lg:-mt-10">

            <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">

              {/* Header */}

              <div className="mb-4">

                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-400/20 text-violet-300 ring-1 ring-white/10">
                  <User size={20} />
                </div>

                <h2 className="text-2xl font-bold">
                  Create your account
                </h2>

                <p className="mt-1.5 text-sm text-slate-400">
                  Start your personalized AI learning journey.
                </p>

              </div>

              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="space-y-3"
              >

                {/* Name */}

                <div>

                  <label className="mb-1.5 block text-xs font-medium text-slate-300">
                    Full name
                  </label>

                  <div className="relative">

                    <User
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="w-full rounded-xl border border-white/10 bg-black/20 py-2 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/10"
                    />

                  </div>

                </div>

                {/* Email */}

                <div>

                  <label className="mb-1.5 block text-xs font-medium text-slate-300">
                    Email address
                  </label>

                  <div className="relative">

                    <Mail
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-white/10 bg-black/20 py-2 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                    />

                  </div>

                </div>

                {/* Password */}

                <div>

                  <label className="mb-1.5 block text-xs font-medium text-slate-300">
                    Password
                  </label>

                  <div className="relative">

                    <Lock
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      className="w-full rounded-xl border border-white/10 bg-black/20 py-2 pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>

                  </div>

                  {/* Password Strength */}

                  {form.password && (
                    <div className="mt-2">

                      <div className="mb-1 flex justify-between text-[10px]">

                        <span className="text-slate-500">
                          Password strength
                        </span>

                        <span className="text-slate-300">
                          {strength.label}
                        </span>

                      </div>

                      <div className="h-1 overflow-hidden rounded-full bg-white/10">

                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300"
                          style={{
                            width: strength.width,
                          }}
                        />

                      </div>

                    </div>
                  )}

                </div>

                {/* Confirm Password */}

                <div>

                  <label className="mb-1.5 block text-xs font-medium text-slate-300">
                    Confirm password
                  </label>

                  <div className="relative">

                    <Lock
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type={showConfirm ? "text" : "password"}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="w-full rounded-xl border border-white/10 bg-black/20 py-2 pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                    >
                      {showConfirm ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>

                  </div>

                </div>

                {/* Error */}

                {error && (
                  <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-300">
                    {error}
                  </div>
                )}

                {/* Terms */}

                <label className="flex cursor-pointer items-start gap-2.5 text-xs text-slate-400">

                  <button
                    type="button"
                    onClick={() => setAgree(!agree)}
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                      agree
                        ? "border-violet-400 bg-violet-500 text-white"
                        : "border-white/20 bg-white/5"
                    }`}
                  >
                    {agree && <Check size={11} />}
                  </button>

                  <span>
                    I agree to the{" "}
                    <span className="text-violet-300">
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="text-cyan-300">
                      Privacy Policy
                    </span>
                  </span>

                </label>

                {/* Submit */}

                <button
                  type="submit"
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition duration-300 hover:scale-[1.01] hover:shadow-violet-500/30"
                >
                  Create account

                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />

                </button>

              </form>

              {/* Footer */}

              <p className="mt-3 text-center text-xs text-slate-500">

                Already learning with LearnAI?{" "}

                <Link
                  to="/login"
                  className="font-medium text-cyan-400 hover:text-cyan-300"
                >
                  Sign in
                </Link>

              </p>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Signup;