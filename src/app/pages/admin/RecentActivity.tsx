import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Clock, Search, Star, MessageSquare, UserPlus, LogIn, LogOut, Eye, Heart, HeartOff, Edit3, Trash2, UserCog, Settings, AlertCircle } from "lucide-react";

interface Activity {
  _id: string;
  userId?: string;
  username: string;
  type: string;
  description: string;
  ip?: string;
  userAgent?: string;
  createdAt: string;
}

function getActivityConfig(type: string) {
  const configs: Record<string, { icon: typeof Search; color: string; bg: string; defaultAction: string }> = {
    search: { icon: Search, color: "text-[#C9A84C]", bg: "bg-[#C9A84C]/8", defaultAction: "searched for" },
    view_fragrance: { icon: Eye, color: "text-[#C9A84C]", bg: "bg-[#C9A84C]/8", defaultAction: "viewed" },
    submit_review: { icon: Star, color: "text-[#C9A84C]", bg: "bg-[#C9A84C]/8", defaultAction: "reviewed" },
    edit_review: { icon: Edit3, color: "text-blue-400", bg: "bg-blue-400/8", defaultAction: "edited their review of" },
    delete_review: { icon: Trash2, color: "text-red-400", bg: "bg-red-400/8", defaultAction: "deleted their review of" },
    submit_feedback: { icon: MessageSquare, color: "text-blue-400", bg: "bg-blue-400/8", defaultAction: "submitted feedback for" },
    registration: { icon: UserPlus, color: "text-emerald-400", bg: "bg-emerald-400/8", defaultAction: "created an account" },
    login: { icon: LogIn, color: "text-purple-400", bg: "bg-purple-400/8", defaultAction: "logged in" },
    logout: { icon: LogOut, color: "text-orange-400", bg: "bg-orange-400/8", defaultAction: "logged out" },
    add_favorite: { icon: Heart, color: "text-rose-400", bg: "bg-rose-400/8", defaultAction: "added to favorites" },
    remove_favorite: { icon: HeartOff, color: "text-rose-400", bg: "bg-rose-400/8", defaultAction: "removed from favorites" },
    update_profile: { icon: UserCog, color: "text-teal-400", bg: "bg-teal-400/8", defaultAction: "updated their profile" },
    change_settings: { icon: Settings, color: "text-teal-400", bg: "bg-teal-400/8", defaultAction: "changed account settings" },
  };
  return configs[type] || { icon: MessageSquare, color: "text-[#666]", bg: "bg-white/5", defaultAction: "performed" };
}

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString();
}

function parseDescription(desc: string): { action: string; target: string } {
  // Try to parse common patterns
  const searchMatch = desc.match(/^Searched for "(.+)"$/);
  if (searchMatch) return { action: "searched for", target: searchMatch[1] };

  const viewMatch = desc.match(/^Viewed "(.+)"$/);
  if (viewMatch) return { action: "viewed", target: viewMatch[1] };

  const reviewMatch = desc.match(/^Reviewed "(.+)" \(/);
  if (reviewMatch) return { action: "reviewed", target: reviewMatch[1] };

  const feedbackMatch = desc.match(/^Submitted feedback: "(.+)"$/);
  if (feedbackMatch) return { action: "submitted feedback", target: feedbackMatch[1] };

  const favoriteMatch = desc.match(/^(Added|Removed) "(.+)" to favorites/);
  if (favoriteMatch) return { action: favoriteMatch[1] === "Added" ? "added to favorites" : "removed from favorites", target: favoriteMatch[2] };

  const deleteReviewMatch = desc.match(/^Deleted their review of "(.+)"$/);
  if (deleteReviewMatch) return { action: "deleted their review of", target: deleteReviewMatch[1] };

  return { action: "", target: desc || "" };
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch("/api/admin/activities?limit=20");
        if (!res.ok) throw new Error("Failed to fetch activities");
        const data = await res.json();
        setActivities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load activities");
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div className="bg-[#111111] border border-white/6 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/6">
        <div>
          <h3 className="font-display text-lg text-[#F0EBE0]">Recent Activity</h3>
          <p className="text-xs text-[#555] mt-0.5">Real-time user actions across the platform</p>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] text-[#555] font-mono-label">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          Live
        </span>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="divide-y divide-white/[0.04]">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex-shrink-0" />
              <div className="flex-1">
                <div className="h-4 w-48 bg-white/5 rounded mb-1" />
                <div className="h-3 w-32 bg-white/5 rounded" />
              </div>
              <div className="h-3 w-16 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="px-6 py-8 text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-sm text-red-300">Failed to load activities</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && activities.length === 0 && (
        <div className="px-6 py-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-5 h-5 text-[#555]" />
          </div>
          <p className="text-sm text-[#666]">No recent activity</p>
          <p className="text-xs text-[#444] mt-1">User actions will appear here as they happen.</p>
        </div>
      )}

      {/* Activity list */}
      {!loading && activities.length > 0 && (
        <div className="divide-y divide-white/[0.04]">
          {activities.map((activity, i) => {
            const config = getActivityConfig(activity.type);
            const Icon = config.icon;
            const parsed = parseDescription(activity.description);
            const actionText = parsed.action || config.defaultAction;
            const targetText = parsed.target;

            return (
              <motion.div
                key={activity._id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors"
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4.5 h-4.5 ${config.color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#F0EBE0] truncate">
                    <span className="font-medium">{activity.username}</span>
                    {actionText && <span className="text-[#888]"> {actionText}</span>}
                    {targetText && (
                      <span className="text-[#C9A84C]"> {targetText}</span>
                    )}
                  </p>
                </div>

                {/* Time */}
                <div className="flex items-center gap-1.5 text-[10px] text-[#555] font-mono-label flex-shrink-0 whitespace-nowrap">
                  <Clock className="w-3 h-3" />
                  {timeAgo(activity.createdAt)}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/6">
        <button className="text-xs text-[#555] hover:text-[#C9A84C] transition-colors cursor-pointer">
          View all activity →
        </button>
      </div>
    </div>
  );
}

