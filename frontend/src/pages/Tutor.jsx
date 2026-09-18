import { useState } from "react";
import {
  ArrowLeft,
  Bot,
  BrainCircuit,
  ChevronRight,
  Loader2,
  MessageSquare,
  Send,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import AnimatedBackground from "../components/AnimatedBackground";
import { askTutor } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Tutor = () => {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) {
      return;
    }

    const userMessage = {
      role: "user",
      content: trimmedQuestion,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const data = await askTutor(trimmedQuestion, messages);

      const aiMessage = {
        role: "assistant",
        content: data.answer,
      };

      setMessages((previous) => [
        ...previous,
        aiMessage,
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            error.message ||
            "Sorry, I couldn't generate an answer.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

      <AnimatedBackground />

      <div className="relative z-10 flex min-h-screen flex-col">

        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-slate-950/70 px-5 backdrop-blur-xl sm:px-8">

          {/* Left */}
          <div className="flex items-center gap-4">

            <Link
              to="/dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div className="hidden h-7 w-px bg-white/10 sm:block" />

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-lg shadow-violet-600/20">
                <BrainCircuit className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-sm font-semibold">
                  AI Tutor
                </h1>

                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[11px] text-slate-500">
                    Online
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-4">

            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">
                  Clear chat
                </span>
              </button>
            )}

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 text-sm font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "L"}
            </div>

          </div>
        </header>

        {/* Main */}
        <main className="flex min-h-0 flex-1 flex-col">

          {messages.length === 0 ? (
            <WelcomeScreen
              user={user}
              setQuestion={setQuestion}
            />
          ) : (
            <ChatMessages
              messages={messages}
              loading={loading}
            />
          )}

          {/* Input */}
          <div className="shrink-0 border-t border-white/10 bg-slate-950/80 px-4 py-4 backdrop-blur-xl sm:px-8">

            <form
              onSubmit={handleSubmit}
              className="mx-auto max-w-4xl"
            >

              <div className="relative rounded-2xl border border-white/10 bg-white/[0.05] shadow-2xl shadow-violet-950/20 transition focus-within:border-violet-500/40">

                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      !e.shiftKey
                    ) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="Ask your AI tutor anything..."
                  rows={1}
                  disabled={loading}
                  className="max-h-32 min-h-14 w-full resize-none bg-transparent px-5 py-4 pr-16 text-sm text-white outline-none placeholder:text-slate-600 disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={!question.trim() || loading}
                  className="absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-600/20 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>

              </div>

              <p className="mt-2 text-center text-[10px] text-slate-700">
                AI Tutor can make mistakes. Verify important information.
                Press Enter to send • Shift + Enter for new line.
              </p>

            </form>

          </div>

        </main>
      </div>
    </div>
  );
};


/* =========================
   Welcome Screen
========================= */

const WelcomeScreen = ({
  user,
  setQuestion,
}) => {
  const suggestions = [
    {
      icon: "🧠",
      title: "Explain attention",
      text: "Explain the attention mechanism in simple terms.",
    },
    {
      icon: "🤖",
      title: "What is RAG?",
      text: "What is Retrieval Augmented Generation?",
    },
    {
      icon: "💻",
      title: "Learn Python",
      text: "Teach me Python functions with examples.",
    },
    {
      icon: "🎯",
      title: "Interview prep",
      text: "Help me prepare for an AI/ML interview.",
    },
  ];

  return (
    <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-5 py-10">

      <div className="w-full max-w-4xl">

        {/* Hero */}
        <div className="mx-auto max-w-2xl text-center">

          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-2xl shadow-violet-600/30">

            <Bot className="h-8 w-8" />

          </div>

          <div className="mb-3 flex items-center justify-center gap-2 text-sm text-violet-400">

            <Sparkles className="h-4 w-4" />

            AI-powered learning

          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">

            What do you want to{" "}

            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              learn?
            </span>

          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">

            Hi {user?.name?.split(" ")[0] || "Learner"}! Ask me anything
            about your learning material, concepts, code, or interview
            preparation.

          </p>

        </div>

        {/* Suggestions */}
        <div className="mt-10 grid gap-3 sm:grid-cols-2">

          {suggestions.map((suggestion) => (
            <button
              key={suggestion.title}
              onClick={() => setQuestion(suggestion.text)}
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-violet-400/20 hover:bg-white/[0.07]"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-xl">
                  {suggestion.icon}
                </div>

                <div className="min-w-0 flex-1">

                  <p className="text-sm font-medium text-slate-300">
                    {suggestion.title}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-600">
                    {suggestion.text}
                  </p>

                </div>

                <ChevronRight className="h-4 w-4 text-slate-700 transition group-hover:translate-x-1 group-hover:text-violet-400" />

              </div>

            </button>
          ))}

        </div>

      </div>
    </div>
  );
};


/* =========================
   Chat Messages
========================= */

const ChatMessages = ({
  messages,
  loading,
}) => {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-8 sm:px-8">

      <div className="mx-auto max-w-4xl space-y-7">

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 sm:gap-4 ${
              message.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >

            {/* AI avatar */}
            {message.role === "assistant" && (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-lg shadow-violet-600/20">
                <Bot className="h-5 w-5" />
              </div>
            )}

            {/* Message */}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[75%] ${
                message.role === "user"
                  ? "rounded-br-md bg-gradient-to-r from-violet-600 to-violet-500 text-white"
                  : message.error
                    ? "rounded-bl-md border border-red-500/20 bg-red-500/10 text-red-400"
                    : "rounded-bl-md border border-white/10 bg-white/[0.05] text-slate-300"
              }`}
            >

              {message.role === "assistant" ? (
                <div className="prose prose-invert max-w-none text-sm leading-7 prose-headings:text-white prose-p:text-slate-300 prose-p:my-2 prose-strong:text-white prose-code:text-cyan-300 prose-pre:border prose-pre:border-white/10 prose-pre:bg-black/30">
                  <ReactMarkdown>
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-6">
                  {message.content}
                </p>
              )}

            </div>

            {/* User avatar */}
            {message.role === "user" && (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]">
                <User className="h-5 w-5 text-slate-400" />
              </div>
            )}

          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div className="flex gap-3 sm:gap-4">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500">
              <Bot className="h-5 w-5" />
            </div>

            <div className="rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.05] px-5 py-4">

              <div className="flex items-center gap-1.5">

                <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400" />

                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-violet-400"
                  style={{ animationDelay: "100ms" }}
                />

                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-cyan-400"
                  style={{ animationDelay: "200ms" }}
                />

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Tutor;