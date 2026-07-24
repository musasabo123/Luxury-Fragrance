import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ThumbsUp, ThumbsDown, MessageSquare, Star, Clock, AlertCircle, Mail } from "lucide-react";

interface FeedbackItem {
  id: string;
  _id?: string;
  userId?: string;
  username: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { icon: typeof MessageSquare; label: string; class: string }> = {
    pending: {
      icon: MessageSquare,
      label: "Pending",
      class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },
    reviewed: {
      icon: ThumbsUp,
      label: "Reviewed",
      class: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    resolved: {
      icon: ThumbsUp,
      label: "Resolved",
      class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
  };

  const c = config[status] || config.pending;
  const Icon = c.icon;

  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-mono-label px-2 py-0.5 rounded-full border ${c.class}`}>
      <Icon className="w-3 h-3" />
      {c.label}
    </span>
  );
}

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function truncate(str: string, len: number): string {
  if (str.length <= len) return str;
  return str.slice(0, len) + "...";
}

export default function RecentFeedback() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch("/api/admin/feedback?limit=10");
        if (!res.ok) throw new Error("Failed to fetch feedback");
        const data = await res.json();
        setFeedback(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load feedback");
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  return (
    <div className="bg-[#111111] border border-white/6 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/6">
        <div>
          <h3 className="font-display text-lg text-[#F0EBE0]">Recent Feedback</h3>
          <p className="text-xs text-[#555] mt-0.5">Latest user feedback and submissions</p>
        </div>
        {!loading && (
          <span className="text-[10px] text-[#555] font-mono-label">{feedback.length} recent</span>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="divide-y divide-white/[0.04]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-6 py-5 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-white/5" />
                <div className="flex-1">
                  <div className="h-4 w-28 bg-white/5 rounded mb-1" />
                  <div className="h-3 w-20 bg-white/5 rounded" />
                </div>
              </div>
              <div className="h-4 w-full bg-white/5 rounded mb-2" />
              <div className="h-4 w-3/4 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="px-6 py-8 text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-sm text-red-300">Failed to load feedback</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && feedback.length === 0 && (
        <div className="px-6 py-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-5 h-5 text-[#555]" />
          </div>
          <p className="text-sm text-[#666]">No feedback yet</p>
          <p className="text-xs text-[#444] mt-1">User feedback will appear here once submitted.</p>
        </div>
      )}

      {/* Feedback list */}
      {!loading && feedback.length > 0 && (
        <div className="divide-y divide-white/[0.04]">
          {feedback.map((item, i) => (
            <motion.div
              key={item.id || item._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="px-6 py-5 hover:bg-white/[0.02] transition-colors"
            >
              {/* User row */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center text-xs font-medium text-[#C9A84C] flex-shrink-0">
                  {getInitials(item.username || item.email || "A")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#F0EBE0]">{item.username || "Anonymous"}</span>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Mail className="w-3 h-3 text-[#555]" />
                    <span className="text-[11px] text-[#666]">{item.email || "No email"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-[#555] font-mono-label flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  {timeAgo(item.createdAt)}
                </div>
              </div>

              {/* Subject + Message */}
              {item.subject && (
                <p className="text-sm text-[#F0EBE0] font-medium mb-1">{item.subject}</p>
              )}
              <p className="text-sm text-[#AAA] leading-relaxed line-clamp-2">
                "{truncate(item.message, 150)}"
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/6">
        <button className="text-xs text-[#555] hover:text-[#C9A84C] transition-colors cursor-pointer">
          View all feedback →
        </button>
      </div>
    </div>
  );
}

