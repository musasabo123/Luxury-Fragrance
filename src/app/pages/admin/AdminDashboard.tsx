import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Users,
  MessageSquare,
  Star,
  Search,
  TrendingUp,
  CalendarDays,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../AuthContext";
import AdminSidebar from "./AdminSidebar";
import AdminStatsCard from "./AdminStatsCard";
import RecentActivity from "./RecentActivity";
import RecentFeedback from "./RecentFeedback";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalReviews: number;
  totalFeedback: number;
  totalSearches: number;
  totalFragrances: number;
  totalFavorites: number;
  avgRating: number;
  newUsersThisWeek: number;
  pendingFeedback: number;
  trends: {
    users: { value: number; percentage: string };
    reviews: { value: number; percentage: string };
    feedback: { value: number; percentage: string };
    searches: { value: number; percentage: string };
  };
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toLocaleString();
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const trendDirection = (percentage: string): "up" | "down" => {
    return percentage.startsWith("+") ? "up" : "down";
  };

  const trendValue = (percentage: string): string => {
    return percentage;
  };

  // Derive card data from live stats
  const STATS_CARDS = stats
    ? [
        {
          icon: Users,
          label: "Total Users",
          value: formatNumber(stats.totalUsers),
          trend: {
            direction: trendDirection(stats.trends.users.percentage),
            percentage: trendValue(stats.trends.users.percentage),
          },
          subtext: `${stats.newUsersThisWeek} new this week`,
        },
        {
          icon: MessageSquare,
          label: "Total Feedback",
          value: formatNumber(stats.totalFeedback),
          trend: {
            direction: trendDirection(stats.trends.feedback.percentage),
            percentage: trendValue(stats.trends.feedback.percentage),
          },
          subtext: `${stats.pendingFeedback} pending review`,
        },
        {
          icon: Star,
          label: "Total Reviews",
          value: formatNumber(stats.totalReviews),
          trend: {
            direction: trendDirection(stats.trends.reviews.percentage),
            percentage: trendValue(stats.trends.reviews.percentage),
          },
          subtext: `Avg rating: ${stats.avgRating} ★`,
        },
        {
          icon: Search,
          label: "Total Searches",
          value: formatNumber(stats.totalSearches),
          trend: {
            direction: trendDirection(stats.trends.searches.percentage),
            percentage: trendValue(stats.trends.searches.percentage),
          },
          subtext: "This month",
        },
      ]
    : [];

  return (
    <div className="h-screen bg-[#080808]">
      <AdminSidebar />

      {/* Main content area - offset for sidebar */}
      <div className="lg:ml-[240px] h-full transition-all duration-200">
        {/* Top bar */}
        <div className="sticky top-0 z-20 backdrop-blur-xl border-b border-white/6" style={{ backgroundColor: "var(--background)" }}>
          <div className="flex items-center justify-between px-6 lg:px-10 py-4">
            <div className="lg:hidden" /> {/* spacer for mobile hamburger */}
            <div>
              <h1 className="font-display text-xl text-[#F0EBE0]">Dashboard</h1>
              <p className="text-xs text-[#555] mt-0.5">
                Welcome back, {user?.name || "Admin"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#555] font-mono-label bg-[#111] border border-white/6 rounded-full px-4 py-2">
                <CalendarDays className="w-3.5 h-3.5" />
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <button
                onClick={fetchStats}
                disabled={loading}
                className="flex items-center gap-1.5 text-[11px] text-[#555] hover:text-[#C9A84C] font-mono-label bg-[#111] border border-white/6 rounded-full px-3 py-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="px-6 lg:px-10 py-8 space-y-8 overflow-y-auto" style={{ height: "calc(100vh - 64px)" }}>
          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 flex items-center gap-4"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-red-300 font-medium">Failed to load dashboard data</p>
                <p className="text-xs text-red-400/70 mt-0.5">{error}</p>
              </div>
              <button
                onClick={fetchStats}
                className="text-xs text-red-300 hover:text-red-200 border border-red-500/30 rounded-full px-4 py-1.5 transition-colors cursor-pointer"
              >
                Retry
              </button>
            </motion.div>
          )}

          {/* Loading Skeleton */}
          {loading && !stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-[#111111] border border-white/6 rounded-2xl p-6 animate-pulse"
                >
                  <div className="w-11 h-11 rounded-xl bg-white/5 mb-5" />
                  <div className="h-3 w-20 bg-white/5 rounded mb-3" />
                  <div className="h-8 w-24 bg-white/5 rounded mb-2" />
                  <div className="h-3 w-16 bg-white/5 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Stats Cards */}
          {!loading && STATS_CARDS.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {STATS_CARDS.map((stat, i) => (
                <AdminStatsCard
                  key={stat.label}
                  icon={stat.icon}
                  label={stat.label}
                  value={stat.value}
                  trend={stat.trend}
                  subtext={stat.subtext}
                  delay={i * 0.08}
                />
              ))}
            </div>
          )}

          {/* Quick Overview */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-[#111111] border border-white/6 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5.5 h-5.5 text-emerald-400" />
            </div>
            <div className="flex-1">
              {stats ? (
                <>
                  <p className="text-sm text-[#F0EBE0] font-medium">
                    Platform engagement is up{" "}
                    <span className="text-emerald-400">{stats.trends.users.percentage}</span> this week
                  </p>
                  <p className="text-xs text-[#555] mt-1">
                    {stats.totalUsers.toLocaleString()} total users —{" "}
                    {stats.activeUsers.toLocaleString()} active in the last 30 days
                  </p>
                </>
              ) : (
                <>
                  <div className="h-4 w-64 bg-white/5 rounded animate-pulse mb-2" />
                  <div className="h-3 w-48 bg-white/5 rounded animate-pulse" />
                </>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-[#555] font-mono-label">
              <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">
                {stats ? stats.trends.users.percentage : "--"}
              </span>
              <span>from last week</span>
            </div>
          </motion.div>

          {/* Two-column grid: Activity + Feedback */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivity />
            <RecentFeedback />
          </div>
        </div>
      </div>
    </div>
  );
}

