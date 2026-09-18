import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileText,
  MessageSquareText,
  Play,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

import { Link } from "react-router-dom";


const Home = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* ================= BACKGROUND ================= */}

      <div className="fixed inset-0 -z-10 overflow-hidden">

        <div className="absolute inset-0 bg-slate-950" />

        <div className="absolute left-[-15%] top-[-15%] h-[650px] w-[650px] rounded-full bg-violet-600/20 blur-[140px]" />

        <div className="absolute right-[-10%] top-[10%] h-[600px] w-[600px] rounded-full bg-cyan-500/15 blur-[140px]" />

        <div className="absolute bottom-[-20%] left-[30%] h-[500px] w-[500px] rounded-full bg-fuchsia-600/10 blur-[140px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.055]"
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
            backgroundSize: "60px 60px",
          }}
        />

        {/* Animated stars */}
        <div className="absolute left-[15%] top-[25%] h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_20px_5px_rgba(34,211,238,0.4)]" />

        <div className="absolute left-[40%] top-[15%] h-1 w-1 animate-pulse rounded-full bg-violet-400 shadow-[0_0_15px_5px_rgba(139,92,246,0.4)]" />

        <div className="absolute right-[20%] top-[30%] h-1.5 w-1.5 animate-pulse rounded-full bg-fuchsia-400 shadow-[0_0_20px_5px_rgba(217,70,239,0.4)]" />

        <div className="absolute bottom-[25%] left-[20%] h-1 w-1 animate-pulse rounded-full bg-cyan-400" />

      </div>


      {/* ================= NAVBAR ================= */}

      <nav className="relative z-20 border-b border-white/[0.06] bg-slate-950/60 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          {/* Logo */}

          <Link
            to="/"
            className="flex items-center gap-3"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-gradient-to-br from-violet-600/80 to-cyan-500/80 shadow-lg shadow-violet-600/20">

              <BrainCircuit className="h-5 w-5" />

            </div>

            <div>

              <h1 className="font-bold tracking-wide">
                LearnAI
              </h1>

              <p className="text-[10px] uppercase tracking-widest text-slate-500">
                AI Learning Agent
              </p>

            </div>

          </Link>


          {/* Navigation */}

          <div className="hidden items-center gap-8 md:flex">

            <a
              href="#features"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              How it works
            </a>

            <a
              href="#technology"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Technology
            </a>

          </div>


          {/* Auth buttons */}

          <div className="flex items-center gap-3">

            <Link
              to="/login"
              className="hidden rounded-xl px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white sm:block"
            >
              Sign in
            </Link>

            <Link
              to="/signup"
              className="rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold shadow-lg shadow-violet-600/20 transition hover:-translate-y-0.5 hover:shadow-violet-600/30"
            >
              Get Started
            </Link>

          </div>

        </div>

      </nav>


      {/* ================= HERO ================= */}

      <main>

        <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 lg:pb-32 lg:pt-28">

          <div className="grid items-center gap-16 lg:grid-cols-2">


            {/* Hero text */}

            <div>

              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-300 backdrop-blur-xl">

                <Sparkles className="h-4 w-4" />

                AI-powered personalized learning

              </div>


              <h2 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">

                Your knowledge.

                <br />

                <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Supercharged by AI.
                </span>

              </h2>


              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">

                Learn from your own study material, practice
                with intelligent quizzes, simulate technical
                interviews, and get a personalized learning
                roadmap.

              </p>


              {/* CTA */}

              <div className="mt-9 flex flex-wrap gap-4">

                <Link
                  to="/signup"
                  className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3.5 font-semibold shadow-xl shadow-violet-600/20 transition hover:-translate-y-1"
                >

                  Start Learning

                  <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />

                </Link>


                <a
                  href="#how-it-works"
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 font-medium text-slate-300 backdrop-blur-xl transition hover:bg-white/[0.08]"
                >

                  <Play className="h-4 w-4" />

                  See how it works

                </a>

              </div>


              {/* Trust points */}

              <div className="mt-9 flex flex-wrap gap-5">

                {[
                  "RAG-powered",
                  "AI Agents",
                  "Personalized",
                ].map((item) => (

                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm text-slate-500"
                  >

                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />

                    {item}

                  </div>

                ))}

              </div>

            </div>


            {/* AI visual */}

            <div className="relative flex min-h-[500px] items-center justify-center">

              {/* Outer glow */}

              <div className="absolute h-80 w-80 rounded-full bg-violet-600/20 blur-[100px]" />


              {/* Rotating ring */}

              <div className="absolute h-[390px] w-[390px] rounded-full border border-violet-400/10 animate-[spin_30s_linear_infinite]" />

              <div className="absolute h-[310px] w-[310px] rounded-full border border-cyan-400/10 animate-[spin_20s_linear_infinite_reverse]" />


              {/* Central AI */}

              <div className="relative z-10 flex h-36 w-36 items-center justify-center rounded-[2.5rem] border border-white/20 bg-white/[0.08] shadow-2xl shadow-violet-600/30 backdrop-blur-2xl">

                <div className="absolute inset-3 rounded-[2rem] bg-gradient-to-br from-violet-600/30 to-cyan-500/20" />

                <BrainCircuit className="relative h-16 w-16 text-cyan-300" />

              </div>


              {/* Floating cards */}

              <FloatingCard
                className="left-0 top-16"
                icon={<MessageSquareText />}
                title="AI Tutor"
                text="Ask anything"
              />

              <FloatingCard
                className="right-0 top-24"
                icon={<Target />}
                title="Smart Quiz"
                text="Test your skills"
              />

              <FloatingCard
                className="bottom-20 left-8"
                icon={<Trophy />}
                title="Progress"
                text="82% mastery"
              />

              <FloatingCard
                className="bottom-12 right-4"
                icon={<Sparkles />}
                title="AI Interview"
                text="Practice now"
              />


              {/* Nodes */}

              <div className="absolute left-[18%] top-[30%] h-3 w-3 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_25px_8px_rgba(34,211,238,0.3)]" />

              <div className="absolute right-[18%] top-[38%] h-3 w-3 animate-pulse rounded-full bg-violet-400 shadow-[0_0_25px_8px_rgba(139,92,246,0.3)]" />

              <div className="absolute bottom-[25%] left-[30%] h-2 w-2 animate-pulse rounded-full bg-fuchsia-400" />

            </div>

          </div>

        </section>


        {/* ================= FEATURES ================= */}

        <section
          id="features"
          className="border-y border-white/[0.06] bg-white/[0.015] py-24"
        >

          <div className="mx-auto max-w-7xl px-6">

            <div className="mx-auto max-w-2xl text-center">

              <p className="text-sm font-medium uppercase tracking-widest text-violet-400">
                Everything you need
              </p>

              <h3 className="mt-3 text-3xl font-bold sm:text-4xl">
                One AI workspace.
                <br />
                <span className="text-slate-500">
                  Complete learning system.
                </span>
              </h3>

            </div>


            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

              <FeatureCard
                icon={<MessageSquareText />}
                title="AI Tutor"
                description="Ask questions and receive contextual explanations from your study material."
              />

              <FeatureCard
                icon={<Target />}
                title="Smart Quiz"
                description="Generate personalized quizzes that test understanding rather than memorization."
              />

              <FeatureCard
                icon={<Zap />}
                title="AI Interview"
                description="Practice technical interviews and receive instant feedback on your answers."
              />

              <FeatureCard
                icon={<Trophy />}
                title="Learning Planner"
                description="Discover your weak areas and get an intelligent plan for what to study next."
              />

            </div>

          </div>

        </section>


        {/* ================= HOW IT WORKS ================= */}

        <section
          id="how-it-works"
          className="mx-auto max-w-7xl px-6 py-24"
        >

          <div className="grid items-center gap-16 lg:grid-cols-2">

            <div>

              <p className="text-sm font-medium uppercase tracking-widest text-cyan-400">
                How it works
              </p>

              <h3 className="mt-3 text-4xl font-bold">
                Turn your study material
                <br />
                into an AI learning system.
              </h3>

              <p className="mt-5 leading-7 text-slate-400">
                Upload your documents and LearnAI uses
                Retrieval-Augmented Generation to ground
                responses in your own material.
              </p>

            </div>


            <div className="space-y-4">

              <Step
                number="01"
                icon={<FileText />}
                title="Upload your material"
                text="Add PDFs, notes, or learning documents."
              />

              <Step
                number="02"
                icon={<BrainCircuit />}
                title="AI understands your content"
                text="Documents are chunked, embedded, and stored in a vector database."
              />

              <Step
                number="03"
                icon={<MessageSquareText />}
                title="Learn with AI"
                text="Tutor, quiz, and interview agents retrieve relevant knowledge and generate responses."
              />

              <Step
                number="04"
                icon={<Target />}
                title="Improve continuously"
                text="Your results are evaluated to identify weaknesses and recommend what to study next."
              />

            </div>

          </div>

        </section>


        {/* ================= TECHNOLOGY ================= */}

        <section
          id="technology"
          className="border-y border-white/[0.06] bg-white/[0.015] py-24"
        >

          <div className="mx-auto max-w-7xl px-6 text-center">

            <p className="text-sm font-medium uppercase tracking-widest text-violet-400">
              Built with modern AI
            </p>

            <h3 className="mt-3 text-3xl font-bold">
              Under the hood
            </h3>

            <div className="mt-12 flex flex-wrap justify-center gap-3">

              {[
                "React",
                "Tailwind CSS",
                "FastAPI",
                "LangChain",
                "Groq",
                "Chroma",
                "Hugging Face",
                "RAG",
                "AI Agents",
              ].map((technology) => (

                <div
                  key={technology}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm text-slate-300 backdrop-blur-xl transition hover:-translate-y-1 hover:border-violet-400/30 hover:bg-violet-500/10"
                >
                  {technology}
                </div>

              ))}

            </div>

          </div>

        </section>


        {/* ================= CTA ================= */}

        <section className="mx-auto max-w-5xl px-6 py-28">

          <div className="relative overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-600/20 via-slate-900 to-cyan-500/10 p-10 text-center shadow-2xl shadow-violet-950/30 sm:p-16">

            <div className="absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 rounded-full bg-violet-500/20 blur-[100px]" />

            <Sparkles className="relative mx-auto h-8 w-8 text-violet-300" />

            <h3 className="relative mt-5 text-3xl font-bold sm:text-4xl">
              Ready to learn differently?
            </h3>

            <p className="relative mx-auto mt-4 max-w-xl text-slate-400">
              Turn your study material into an intelligent,
              personalized learning experience.
            </p>

            <Link
              to="/signup"
              className="relative mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-slate-950 transition hover:-translate-y-1"
            >
              Create your account

              <ArrowRight className="h-5 w-5" />

            </Link>

          </div>

        </section>

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="border-t border-white/[0.06]">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-slate-600 sm:flex-row">

          <div className="flex items-center gap-2">

            <BrainCircuit className="h-4 w-4" />

            LearnAI

          </div>

          <p>
            AI Learning Agent • RAG + AI Agents
          </p>

        </div>

      </footer>

    </div>
  );
};


/* ================= COMPONENTS ================= */

const FloatingCard = ({
  className,
  icon,
  title,
  text,
}) => {
  return (
    <div
      className={`absolute z-20 w-44 rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/[0.1] ${className}`}
    >

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">

          {icon}

        </div>

        <div>

          <p className="text-sm font-semibold">
            {title}
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            {text}
          </p>

        </div>

      </div>

    </div>
  );
};


const FeatureCard = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-violet-400/20 hover:bg-white/[0.06]">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/20 to-cyan-500/20 text-violet-300 transition group-hover:scale-110">

        {icon}

      </div>

      <h4 className="mt-5 font-semibold">
        {title}
      </h4>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
};


const Step = ({
  number,
  icon,
  title,
  text,
}) => {
  return (
    <div className="flex gap-5 rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition hover:border-cyan-400/20">

      <div className="shrink-0">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">

          {icon}

        </div>

      </div>

      <div>

        <div className="flex items-center gap-3">

          <span className="text-xs font-semibold text-violet-400">
            {number}
          </span>

          <h4 className="font-semibold">
            {title}
          </h4>

        </div>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {text}
        </p>

      </div>

    </div>
  );
};


export default Home;