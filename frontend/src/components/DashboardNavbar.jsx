import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  User,
  ChevronDown,
  LayoutDashboard,
  BrainCircuit,
  ClipboardCheck,
  Mic2,
  Map,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const DashboardNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // =========================
  // Navigation items
  // =========================

  const navigationItems = [
    {
      name: "Dashboard",
      description: "Your learning overview",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "AI Tutor",
      description: "Ask questions and learn",
      path: "/tutor",
      icon: BrainCircuit,
    },
    {
      name: "Smart Quiz",
      description: "Test your knowledge",
      path: "/quiz",
      icon: ClipboardCheck,
    },
    {
      name: "Interview",
      description: "Practice interviews",
      path: "/interview",
      icon: Mic2,
    },
    {
      name: "Learning Planner",
      description: "Plan your learning",
      path: "/planner",
      icon: Map,
    },
    {
      name: "Evaluation",
      description: "Evaluate your answers",
      path: "/evaluation",
      icon: BarChart3,
    },
    {
      name: "Documents",
      description: "Manage study documents",
      path: "/documents",
      icon: FileText,
    },
    {
      name: "AI Usage",
      description: "View AI usage",
      path: "/usage",
      icon: BarChart3,
    },
  ];

  // =========================
  // Search filtering
  // =========================

  const filteredItems = navigationItems.filter((item) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) return false;

    return (
      item.name.toLowerCase().includes(searchText) ||
      item.description.toLowerCase().includes(searchText)
    );
  });

  // =========================
  // Navigation
  // =========================

  const handleNavigation = (path) => {
    navigate(path);

    setSearch("");
    setShowSearch(false);
    setShowNotifications(false);
    setShowProfile(false);
  };

  // =========================
  // Logout
  // =========================

  const handleLogout = () => {
    setShowProfile(false);
    logout();
    navigate("/login");
  };

  // =========================
  // Click outside
  // =========================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowSearch(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-slate-950/70 px-6 backdrop-blur-xl">

      {/* ================================================= */}
      {/* SEARCH */}
      {/* ================================================= */}

      <div
        ref={searchRef}
        className="relative hidden w-80 md:block"
      >
        <Search
          size={17}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowSearch(true);
          }}
          onFocus={() => {
            if (search.trim()) {
              setShowSearch(true);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setSearch("");
              setShowSearch(false);
            }

            if (
              e.key === "Enter" &&
              filteredItems.length > 0
            ) {
              handleNavigation(filteredItems[0].path);
            }
          }}
          placeholder="Search your learning..."
          className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-10 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-violet-400/30 focus:bg-white/[0.05]"
        />

        {search && (
          <button
            onClick={() => {
              setSearch("");
              setShowSearch(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
          >
            <X size={15} />
          </button>
        )}

        {/* Search Results */}

        {showSearch && search.trim() && (
          <div className="absolute left-0 top-12 z-50 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/40">

            {filteredItems.length > 0 ? (
              <div className="p-2">

                <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                  Quick Navigation
                </p>

                {filteredItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.path}
                      onClick={() =>
                        handleNavigation(item.path)
                      }
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/[0.06]"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                        <Icon
                          size={17}
                          className="text-violet-400"
                        />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-white">
                          {item.name}
                        </p>

                        <p className="text-[11px] text-slate-500">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}

              </div>
            ) : (
              <div className="px-4 py-6 text-center">
                <Search
                  size={22}
                  className="mx-auto mb-2 text-slate-600"
                />

                <p className="text-sm text-slate-400">
                  No learning feature found
                </p>

                <p className="mt-1 text-[11px] text-slate-600">
                  Try Tutor, Quiz, Interview or Planner
                </p>
              </div>
            )}

          </div>
        )}
      </div>

      {/* ================================================= */}
      {/* RIGHT SIDE */}
      {/* ================================================= */}

      <div className="ml-auto flex items-center gap-3">

        {/* ================= AI STATUS ================= */}

        <div className="hidden items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/5 px-3 py-1.5 sm:flex">

          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />

          <span className="text-xs text-emerald-400">
            AI Online
          </span>

        </div>

        {/* ================= NOTIFICATIONS ================= */}

        <div
          ref={notificationRef}
          className="relative"
        >

          <button
            onClick={() => {
              setShowNotifications(
                !showNotifications
              );
              setShowProfile(false);
            }}
            className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition ${
              showNotifications
                ? "border-violet-400/30 bg-violet-500/10 text-white"
                : "border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-white"
            }`}
            aria-label="Notifications"
          >
            <Bell size={18} />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-violet-400" />
          </button>

          {/* Notification dropdown */}

          {showNotifications && (
            <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/40">

              <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Notifications
                  </h3>

                  <p className="mt-1 text-[11px] text-slate-500">
                    Stay updated with your learning
                  </p>
                </div>

                <span className="rounded-full bg-violet-500/10 px-2 py-1 text-[10px] text-violet-300">
                  AI
                </span>

              </div>

              <div className="p-3">

                <div className="rounded-xl border border-violet-400/10 bg-violet-500/5 p-3">

                  <div className="flex gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                      <BrainCircuit
                        size={17}
                        className="text-violet-400"
                      />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-white">
                        Your AI learning agents are ready
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-slate-500">
                        Continue learning with Tutor,
                        Quiz, Interview or Planner.
                      </p>
                    </div>

                  </div>

                </div>

                <button
                  onClick={() =>
                    handleNavigation("/planner")
                  }
                  className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-xs text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                >
                  Open Learning Planner
                </button>

              </div>

            </div>
          )}

        </div>

        {/* ================= USER ================= */}

        <div
          ref={profileRef}
          className="relative"
        >

          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className={`flex items-center gap-3 rounded-xl border px-2.5 py-1.5 transition ${
              showProfile
                ? "border-violet-400/30 bg-violet-500/10"
                : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
            }`}
          >

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 text-white">
              <User size={16} />
            </div>

            <div className="hidden text-left sm:block">

              <p className="text-xs font-semibold text-white">
                {user?.name || "Learner"}
              </p>

              <p className="text-[10px] text-slate-500">
                Student
              </p>

            </div>

            <ChevronDown
              size={15}
              className={`hidden text-slate-500 transition sm:block ${
                showProfile
                  ? "rotate-180 text-violet-400"
                  : ""
              }`}
            />

          </button>

          {/* Profile dropdown */}

          {showProfile && (
            <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/40">

              {/* User info */}

              <div className="border-b border-white/10 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400">
                    <User size={20} />
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-semibold text-white">
                      {user?.name || "Learner"}
                    </p>

                    <p className="truncate text-[11px] text-slate-500">
                      {user?.email || "Student account"}
                    </p>

                  </div>

                </div>

              </div>

              {/* Menu */}

              <div className="p-2">

                <button
                  onClick={() =>
                    handleNavigation("/dashboard")
                  }
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <User
                    size={16}
                    className="text-slate-500"
                  />

                  Profile
                </button>

              </div>

              {/* Logout */}

              <div className="border-t border-white/10 p-2">

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-300 transition hover:bg-red-500/10"
                >
                  <LogOut size={16} />

                  Sign out
                </button>

              </div>

            </div>
          )}

        </div>

      </div>

    </header>
  );
};

export default DashboardNavbar;