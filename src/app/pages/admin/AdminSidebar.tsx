import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Star,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../../AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../../ThemeContext";

function formatBadge(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toLocaleString();
}

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [liveBadges, setLiveBadges] = useState<Record<string, string>>({});
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  // Fetch live badge counts
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) return;
        const data = await res.json();
        setLiveBadges({
          "/admin/users": formatBadge(data.totalUsers),
          "/admin/feedback": formatBadge(data.totalFeedback),
          "/admin/reviews": formatBadge(data.totalReviews),
          "/admin/searches": formatBadge(data.totalSearches),
        });
      } catch {
        // Silently fail
      }
    };
    fetchBadges();
  }, []);

  const NAV_ITEMS = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { label: "Users", icon: Users, path: "/admin/users", badge: liveBadges["/admin/users"] },
    { label: "Feedback", icon: MessageSquare, path: "/admin/feedback", badge: liveBadges["/admin/feedback"] },
    { label: "Reviews", icon: Star, path: "/admin/reviews", badge: liveBadges["/admin/reviews"] },
    { label: "Search Analytics", icon: Search, path: "/admin/searches", badge: liveBadges["/admin/searches"] },
    { label: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/6">
        <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-[#C9A84C]" />
        </div>
        {!collapsed && (
          <span className="font-display text-lg tracking-[0.08em] text-[#F0EBE0] whitespace-nowrap">
            ScentBase
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                active
                  ? "bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20 shadow-[0_0_20px_rgba(201,168,76,0.06)]"
                  : "text-[#666] hover:text-[#F0EBE0] hover:bg-[#111111] border border-transparent hover:border-white/6"
              }`}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] font-mono-label px-2 py-0.5 rounded-full ${
                      active
                        ? "bg-[#C9A84C]/15 text-[#C9A84C]"
                        : "bg-white/8 text-[#555]"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-white/6 p-3">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-8 h-8 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/20 flex items-center justify-center text-xs font-medium text-[#C9A84C] flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#F0EBE0] truncate">{user?.name || "Admin"}</p>
              <p className="text-[10px] text-[#555] truncate">{user?.email || "admin@scentbase.com"}</p>
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="flex items-center gap-2 px-3 mt-1">
            <button
              onClick={() => toggleTheme()}
              className="flex-1 flex items-center justify-center gap-1.5 text-[10px] text-[#555] hover:text-[#C9A84C] py-1.5 rounded-lg hover:bg-[#111] transition-all cursor-pointer"
            >
              {theme === "light" ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
              <span>{theme === "light" ? "Light" : "Dark"}</span>
            </button>
            <button
              onClick={() => logout()}
              className="flex-1 text-[10px] text-[#555] hover:text-[#C9A84C] py-1.5 rounded-lg hover:bg-[#111] transition-all cursor-pointer"
            >
              Sign out
            </button>
          </div>
        )}
      </div>

      {/* Collapse toggle (desktop only) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex items-center justify-center h-8 mx-3 mb-3 rounded-lg text-[#555] hover:text-[#C9A84C] hover:bg-[#111] transition-all cursor-pointer"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-[#111] border border-white/10 flex items-center justify-center text-[#F0EBE0] hover:text-[#C9A84C] transition-colors cursor-pointer"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 z-40 bg-[#080808]/80 backdrop-blur-sm"
          >
            <motion.div
              key="mobile-sidebar"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="w-[280px] h-full bg-[#080808] border-r border-white/6 overflow-y-auto"
            >
              <div className="flex items-center justify-end p-4">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#666] hover:text-[#F0EBE0] hover:bg-[#111] transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {sidebarContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-full z-30 bg-[#080808] border-r border-white/6 transition-all duration-200 ${
          collapsed ? "w-[68px]" : "w-[240px]"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

