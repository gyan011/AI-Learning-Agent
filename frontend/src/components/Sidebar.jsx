import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BrainCircuit,
  ClipboardCheck,
  Mic2,
  Map,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "AI Tutor",
      path: "/tutor",
      icon: BrainCircuit,
    },
    {
      name: "Smart Quiz",
      path: "/quiz",
      icon: ClipboardCheck,
    },
    {
      name: "Interview",
      path: "/interview",
      icon: Mic2,
    },
    {
      name: "Learning Planner",
      path: "/planner",
      icon: Map,
    },
    {
      name: "Evaluation",
      path: "/evaluation",
      icon: BarChart3,
    },
    {
      name: "Documents",
      path: "/documents",
      icon: FileText,
    },
    {
      name: "AI Usage",
      path: "/usage",
      icon: BarChart3,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 overflow-y-auto border-r border-white/10 bg-slate-950/95 backdrop-blur-xl lg:flex lg:flex-col">

      {/* ================= LOGO ================= */}

      <div className="flex h-20 shrink-0 items-center gap-3 border-b border-white/10 px-6">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-lg shadow-violet-500/20">
          <BrainCircuit size={23} />
        </div>

        <div>
          <div className="text-lg font-bold">
            Learn<span className="text-cyan-400">AI</span>
          </div>

          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            AI Learning Agent
          </p>
        </div>

      </div>

      {/* ================= NAVIGATION ================= */}

      <nav className="flex-1 px-3 py-5">

        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
          Workspace
        </p>

        <div className="space-y-1">

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-gradient-to-r from-violet-500/15 to-cyan-500/10 text-white ring-1 ring-violet-400/20"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      className={
                        isActive
                          ? "text-cyan-400"
                          : "transition group-hover:text-cyan-400"
                      }
                    />

                    {item.name}
                  </>
                )}
              </NavLink>
            );
          })}

        </div>

      </nav>

      {/* ================= AI STATUS ================= */}

      <div className="mx-3 mb-4 shrink-0 rounded-2xl border border-violet-400/10 bg-violet-500/[0.06] p-4">

        <div className="mb-2 flex items-center gap-2">

          <Sparkles
            size={15}
            className="text-violet-400"
          />

          <span className="text-xs font-semibold text-violet-300">
            AI Assistant
          </span>

        </div>

        <p className="text-[11px] leading-5 text-slate-500">
          Your AI learning agents are ready to help.
        </p>

        <div className="mt-3 flex items-center gap-2 text-[10px] text-emerald-400">

          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />

          All systems operational

        </div>

      </div>

      {/* ================= BOTTOM ================= */}

      <div className="shrink-0 border-t border-white/10 p-3">

        <button
          onClick={handleLogout}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={18} />
          Sign out
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;