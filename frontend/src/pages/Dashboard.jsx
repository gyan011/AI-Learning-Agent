import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  BrainCircuit,
  BookOpen,
  CheckCircle2,
  Clock3,
  Flame,
  LayoutDashboard,
  MessageSquare,
  Mic2,
  MoreHorizontal,
  Play,
  Target,
  Trophy,
  X,
  RefreshCw,
  Map,
  ClipboardCheck,
  FileText,
} from "lucide-react";

import { getProgress } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [showAllProgress, setShowAllProgress] = useState(false);
  const [showProgressMenu, setShowProgressMenu] = useState(false);

  // =====================================================
  // LOAD PROGRESS
  // =====================================================

  const loadProgress = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getProgress();

      setProgress(data.progress || []);
    } catch (error) {
      console.error("Failed to load progress:", error);
      setError(error.message || "Failed to load progress.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalActivities = progress.length;

  const averageScore =
    totalActivities > 0
      ? Math.round(
          progress.reduce(
            (sum, item) =>
              sum + Number(item.percentage || 0),
            0
          ) / totalActivities
        )
      : 0;

  const uniqueTopics = new Set(
    progress.map((item) => item.topic)
  ).size;

  const quizActivities = progress.filter(
    (item) =>
      item.activity_type?.toLowerCase() === "quiz"
  ).length;

  const interviewActivities = progress.filter(
    (item) =>
      item.activity_type?.toLowerCase() === "interview"
  ).length;

  const recentActivities = progress.slice(0, 5);

  const displayedProgress = showAllProgress
    ? progress
    : progress.slice(0, 5);

  // =====================================================
  // CONTINUE LEARNING
  // =====================================================

  const nextLearningRoute = useMemo(() => {
    if (progress.length === 0) {
      return "/planner";
    }

    const latestActivity = progress[0];

    const activityType =
      latestActivity?.activity_type?.toLowerCase();

    if (activityType === "quiz") {
      return "/interview";
    }

    if (activityType === "interview") {
      return "/tutor";
    }

    if (activityType === "evaluation") {
      return "/planner";
    }

    if (activityType === "tutor") {
      return "/quiz";
    }

    return "/planner";
  }, [progress]);

  // =====================================================
  // ACTIVITY NAVIGATION
  // =====================================================

  const getActivityRoute = (activityType) => {
    const type = activityType?.toLowerCase();

    switch (type) {
      case "quiz":
        return "/quiz";

      case "interview":
        return "/interview";

      case "evaluation":
        return "/evaluation";

      case "tutor":
        return "/tutor";

      default:
        return "/planner";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">

        {/* ================================================= */}
        {/* SIDEBAR */}
        {/* ================================================= */}

        <Sidebar />

        {/* ================================================= */}
        {/* MAIN */}
        {/* ================================================= */}

        <main className="min-w-0 flex-1 lg:ml-72">

          {/* Navbar */}

          <DashboardNavbar />

          {/* ================================================= */}
          {/* PAGE CONTENT */}
          {/* ================================================= */}

          <div className="relative overflow-hidden px-5 py-6 sm:px-8 lg:px-10">

            {/* Background glow */}

            <div className="pointer-events-none absolute left-1/3 top-0 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-7xl">

              {/* ================================================= */}
              {/* WELCOME */}
              {/* ================================================= */}

              <section className="mb-8">

                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

                  <div>

                    <div className="mb-3 flex items-center gap-2 text-sm text-violet-400">
                      <SparkleIcon />
                      AI Learning Dashboard
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">

                      Welcome back,{" "}

                      <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                        {user?.name || "Learner"}
                      </span>

                    </h1>

                    <p className="mt-2 text-slate-400">
                      Keep learning, keep growing, and let AI
                      guide your journey.
                    </p>

                  </div>

                  {/* Today's Learning */}

                  <button
                    onClick={() => navigate("/planner")}
                    className="flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-slate-300 backdrop-blur-xl transition hover:border-violet-400/30 hover:bg-white/[0.08] hover:text-white"
                  >
                    <Clock3 className="h-4 w-4" />
                    Today's Learning
                    <ArrowUpRight className="h-4 w-4" />
                  </button>

                </div>

              </section>

              {/* ================================================= */}
              {/* ERROR */}
              {/* ================================================= */}

              {error && (
                <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">

                  <div className="flex items-center gap-3">
                    <X className="h-5 w-5" />
                    {error}
                  </div>

                  <button
                    onClick={() => loadProgress(true)}
                    className="rounded-lg px-3 py-1.5 text-xs text-red-300 transition hover:bg-red-500/10"
                  >
                    Retry
                  </button>

                </div>
              )}

              {/* ================================================= */}
              {/* STATS */}
              {/* ================================================= */}

              <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <StatCard
                  title="Average Progress"
                  value={
                    loading ? "..." : `${averageScore}%`
                  }
                  subtitle={
                    totalActivities > 0
                      ? "Across all activities"
                      : "Start learning to track"
                  }
                  icon={
                    <Target className="h-5 w-5" />
                  }
                  iconClass="bg-violet-500/10 text-violet-400"
                />

                <StatCard
                  title="Activities"
                  value={
                    loading ? "..." : totalActivities
                  }
                  subtitle={
                    totalActivities > 0
                      ? `${quizActivities} quizzes completed`
                      : "No activities yet"
                  }
                  icon={
                    <Activity className="h-5 w-5" />
                  }
                  iconClass="bg-cyan-500/10 text-cyan-400"
                />

                <StatCard
                  title="Topics"
                  value={
                    loading ? "..." : uniqueTopics
                  }
                  subtitle={
                    uniqueTopics > 0
                      ? "Topics practiced"
                      : "Explore your first topic"
                  }
                  icon={
                    <BookOpen className="h-5 w-5" />
                  }
                  iconClass="bg-fuchsia-500/10 text-fuchsia-400"
                />

                <StatCard
                  title="Interviews"
                  value={
                    loading
                      ? "..."
                      : interviewActivities
                  }
                  subtitle={
                    interviewActivities > 0
                      ? "Interview sessions"
                      : "Practice your first interview"
                  }
                  icon={
                    <Mic2 className="h-5 w-5" />
                  }
                  iconClass="bg-emerald-500/10 text-emerald-400"
                />

              </section>

              {/* ================================================= */}
              {/* QUICK LEARNING */}
              {/* ================================================= */}

              <section className="mb-8">

                <div className="mb-4 flex items-center justify-between">

                  <div>
                    <h2 className="text-xl font-semibold">
                      AI Learning Tools
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Choose a tool and continue learning.
                    </p>
                  </div>

                  <button
                    onClick={() => navigate("/planner")}
                    className="hidden items-center gap-1 text-sm text-violet-400 transition hover:text-violet-300 sm:flex"
                  >
                    View all
                    <ArrowUpRight className="h-4 w-4" />
                  </button>

                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

                  <ToolCard
                    icon={
                      <MessageSquare className="h-6 w-6" />
                    }
                    title="AI Tutor"
                    description="Ask questions and learn with an intelligent AI tutor."
                    label="Start learning"
                    iconClass="bg-violet-500/10 text-violet-400"
                    buttonClass="bg-violet-600 hover:bg-violet-500"
                    to="/tutor"
                  />

                  <ToolCard
                    icon={
                      <BrainCircuit className="h-6 w-6" />
                    }
                    title="Smart Quiz"
                    description="Test your knowledge with AI-generated quizzes."
                    label="Take quiz"
                    iconClass="bg-cyan-500/10 text-cyan-400"
                    buttonClass="bg-cyan-600 hover:bg-cyan-500"
                    to="/quiz"
                  />

                  <ToolCard
                    icon={
                      <Mic2 className="h-6 w-6" />
                    }
                    title="Interview"
                    description="Practice technical interviews with AI."
                    label="Start interview"
                    iconClass="bg-fuchsia-500/10 text-fuchsia-400"
                    buttonClass="bg-fuchsia-600 hover:bg-fuchsia-500"
                    to="/interview"
                  />

                  <ToolCard
                    icon={
                      <LayoutDashboard className="h-6 w-6" />
                    }
                    title="Learning Planner"
                    description="Build a personalized AI-powered learning path."
                    label="View plan"
                    iconClass="bg-emerald-500/10 text-emerald-400"
                    buttonClass="bg-emerald-600 hover:bg-emerald-500"
                    to="/planner"
                  />

                </div>

              </section>

              {/* ================================================= */}
              {/* BOTTOM GRID */}
              {/* ================================================= */}

              <section className="grid gap-6 xl:grid-cols-3">

                {/* ================================================= */}
                {/* PROGRESS */}
                {/* ================================================= */}

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl xl:col-span-2">

                  <div className="mb-6 flex items-center justify-between">

                    <div>
                      <h2 className="font-semibold">
                        Learning Progress
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Your latest learning performance.
                      </p>
                    </div>

                    <div className="relative">

                      <button
                        onClick={() =>
                          setShowProgressMenu(
                            !showProgressMenu
                          )
                        }
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
                        aria-label="Progress options"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>

                      {showProgressMenu && (
                        <div className="absolute right-0 top-10 z-20 w-48 rounded-xl border border-white/10 bg-slate-900 p-1 shadow-xl">

                          <button
                            onClick={() => {
                              loadProgress(true);
                              setShowProgressMenu(false);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs text-slate-300 transition hover:bg-white/5 hover:text-white"
                          >
                            <RefreshCw className="h-4 w-4" />
                            Refresh progress
                          </button>

                          <button
                            onClick={() => {
                              navigate("/planner");
                              setShowProgressMenu(false);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs text-slate-300 transition hover:bg-white/5 hover:text-white"
                          >
                            <Map className="h-4 w-4" />
                            Open planner
                          </button>

                          <button
                            onClick={() => {
                              setShowAllProgress(true);
                              setShowProgressMenu(false);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs text-slate-300 transition hover:bg-white/5 hover:text-white"
                          >
                            <Activity className="h-4 w-4" />
                            Show all progress
                          </button>

                        </div>
                      )}

                    </div>

                  </div>

                  {loading ? (
                    <LoadingRows />
                  ) : progress.length === 0 ? (
                    <EmptyProgress
                      onStart={() => navigate("/quiz")}
                    />
                  ) : (
                    <div className="space-y-5">

                      {displayedProgress.map(
                        (item, index) => (
                          <ProgressRow
                            key={`${item.topic}-${item.created_at}-${index}`}
                            topic={item.topic}
                            percentage={Number(
                              item.percentage || 0
                            )}
                            activityType={
                              item.activity_type
                            }
                            onClick={() =>
                              navigate(
                                getActivityRoute(
                                  item.activity_type
                                )
                              )
                            }
                          />
                        )
                      )}

                      {progress.length > 5 && (
                        <button
                          onClick={() =>
                            setShowAllProgress(
                              !showAllProgress
                            )
                          }
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-3 text-xs text-violet-400 transition hover:bg-white/[0.06] hover:text-violet-300"
                        >
                          {showAllProgress
                            ? "Show less"
                            : `View all ${progress.length} activities`}

                          <ArrowUpRight className="h-4 w-4" />
                        </button>
                      )}

                    </div>
                  )}

                </div>

                {/* ================================================= */}
                {/* RECENT ACTIVITY */}
                {/* ================================================= */}

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">

                  <div className="mb-6 flex items-center justify-between">

                    <div>
                      <h2 className="font-semibold">
                        Recent Activity
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Your latest learning sessions.
                      </p>
                    </div>

                    <Activity className="h-5 w-5 text-violet-400" />

                  </div>

                  {loading ? (
                    <div className="space-y-5">
                      <ActivitySkeleton />
                      <ActivitySkeleton />
                      <ActivitySkeleton />
                    </div>
                  ) : recentActivities.length === 0 ? (
                    <div className="py-8 text-center">

                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                        <Activity className="h-5 w-5 text-slate-600" />
                      </div>

                      <p className="text-sm text-slate-500">
                        No learning activity yet.
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        Start a quiz or interview to see
                        activity here.
                      </p>

                      <button
                        onClick={() =>
                          navigate("/quiz")
                        }
                        className="mt-4 rounded-xl bg-violet-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-violet-500"
                      >
                        Start your first quiz
                      </button>

                    </div>
                  ) : (
                    <div className="space-y-5">

                      {recentActivities.map(
                        (activity, index) => (
                          <ActivityItem
                            key={`${activity.topic}-${activity.created_at}-${index}`}
                            activity={activity}
                            onClick={() =>
                              navigate(
                                getActivityRoute(
                                  activity.activity_type
                                )
                              )
                            }
                          />
                        )
                      )}

                    </div>
                  )}

                </div>

              </section>

              {/* ================================================= */}
              {/* ACHIEVEMENT / CONTINUE */}
              {/* ================================================= */}

              <section className="mt-6 overflow-hidden rounded-2xl border border-violet-400/10 bg-gradient-to-r from-violet-600/10 via-cyan-500/5 to-fuchsia-600/10 p-6">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-yellow-400/10 bg-yellow-400/10">
                      <Trophy className="h-6 w-6 text-yellow-400" />
                    </div>

                    <div>

                      <h3 className="font-semibold">
                        Keep your learning momentum going
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Complete more quizzes and interviews
                        to build your learning record.
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={() =>
                      navigate(nextLearningRoute)
                    }
                    className="flex w-fit items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/15"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Continue Learning
                    <ArrowUpRight className="h-4 w-4" />
                  </button>

                </div>

              </section>

              {/* ================================================= */}
              {/* FOOTER */}
              {/* ================================================= */}

              <footer className="py-8 text-center text-xs text-slate-600">
                LearnAI • RAG • AI Agents • Personalized Learning
              </footer>

            </div>
          </div>

        </main>

      </div>
    </div>
  );
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  iconClass,
}) => {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-violet-400/20 hover:bg-white/[0.06]">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight">
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-600">
            {subtitle}
          </p>

        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
};

/* =========================================================
   TOOL CARD
========================================================= */

const ToolCard = ({
  icon,
  title,
  description,
  label,
  iconClass,
  buttonClass,
  to,
}) => {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-violet-400/20 hover:bg-white/[0.06]">

      <div
        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${iconClass}`}
      >
        {icon}
      </div>

      <h3 className="font-semibold">
        {title}
      </h3>

      <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <Link
        to={to || "/dashboard"}
        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${buttonClass}`}
      >
        {label}

        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>

    </div>
  );
};

/* =========================================================
   PROGRESS ROW
========================================================= */

const ProgressRow = ({
  topic,
  percentage,
  activityType,
  onClick,
}) => {
  const safePercentage = Math.min(
    100,
    Math.max(0, percentage)
  );

  return (
    <button
      onClick={onClick}
      className="w-full text-left transition hover:opacity-90"
    >

      <div className="mb-2 flex items-center justify-between">

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
            <BookOpen className="h-4 w-4 text-violet-400" />
          </div>

          <div className="min-w-0">

            <p className="truncate text-sm font-medium text-slate-300">
              {topic}
            </p>

            <p className="text-xs capitalize text-slate-600">
              {activityType}
            </p>

          </div>

        </div>

        <span className="ml-3 text-sm font-semibold text-slate-300">
          {Math.round(safePercentage)}%
        </span>

      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/5">

        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 transition-all duration-700"
          style={{
            width: `${safePercentage}%`,
          }}
        />

      </div>

    </button>
  );
};

/* =========================================================
   ACTIVITY ITEM
========================================================= */

const ActivityItem = ({
  activity,
  onClick,
}) => {
  const percentage = Math.round(
    Number(activity.percentage || 0)
  );

  const activityType =
    activity.activity_type || "activity";

  return (
    <button
      onClick={onClick}
      className="flex w-full gap-3 text-left transition hover:opacity-90"
    >

      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
        <CheckCircle2 className="h-4 w-4 text-violet-400" />
      </div>

      <div className="min-w-0 flex-1">

        <div className="flex items-start justify-between gap-2">

          <div>

            <p className="text-sm font-medium capitalize text-slate-300">
              {activityType}
            </p>

            <p className="mt-1 truncate text-xs text-slate-600">
              {activity.topic}
            </p>

          </div>

          <span className="shrink-0 text-xs font-semibold text-cyan-400">
            {percentage}%
          </span>

        </div>

        <p className="mt-2 text-[11px] text-slate-700">
          {activity.created_at}
        </p>

      </div>

    </button>
  );
};

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyProgress = ({ onStart }) => {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center text-center">

      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">
        <BookOpen className="h-6 w-6 text-violet-400" />
      </div>

      <h3 className="text-sm font-medium text-slate-300">
        No progress yet
      </h3>

      <p className="mt-1 max-w-sm text-xs text-slate-600">
        Complete your first quiz or interview and your
        progress will appear here.
      </p>

      <button
        onClick={onStart}
        className="mt-4 rounded-xl bg-violet-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-violet-500"
      >
        Start Learning
      </button>

    </div>
  );
};

/* =========================================================
   LOADING
========================================================= */

const LoadingRows = () => {
  return (
    <div className="space-y-6">

      <ProgressSkeleton />
      <ProgressSkeleton />
      <ProgressSkeleton />
      <ProgressSkeleton />

    </div>
  );
};

const ProgressSkeleton = () => {
  return (
    <div>

      <div className="mb-2 flex justify-between">

        <div className="h-4 w-40 animate-pulse rounded bg-white/5" />

        <div className="h-4 w-10 animate-pulse rounded bg-white/5" />

      </div>

      <div className="h-2 animate-pulse rounded-full bg-white/5" />

    </div>
  );
};

const ActivitySkeleton = () => {
  return (
    <div className="flex gap-3">

      <div className="h-8 w-8 animate-pulse rounded-lg bg-white/5" />

      <div className="flex-1">

        <div className="h-4 w-24 animate-pulse rounded bg-white/5" />

        <div className="mt-2 h-3 w-32 animate-pulse rounded bg-white/5" />

      </div>

    </div>
  );
};

/* =========================================================
   SPARKLE ICON
========================================================= */

const SparkleIcon = () => {
  return (
    <span className="text-base">
      ✦
    </span>
  );
};

export default Dashboard;