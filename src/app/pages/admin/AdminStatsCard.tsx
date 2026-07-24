import { motion } from "motion/react";
import { ArrowUp, ArrowDown, type LucideIcon } from "lucide-react";

interface AdminStatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: {
    direction: "up" | "down";
    percentage: string;
  };
  subtext?: string;
  delay?: number;
}

export default function AdminStatsCard({
  icon: Icon,
  label,
  value,
  trend,
  subtext,
  delay = 0,
}: AdminStatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
      className="group bg-[#111111] border border-white/6 hover:border-[#C9A84C]/20 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(201,168,76,0.06)]"
    >
      <div className="flex items-start justify-between mb-5">
        <div className="w-11 h-11 rounded-xl bg-[#C9A84C]/8 border border-[#C9A84C]/15 flex items-center justify-center text-[#C9A84C] group-hover:bg-[#C9A84C]/12 transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span
            className={`flex items-center gap-1 text-xs font-mono-label px-2 py-1 rounded-full ${
              trend.direction === "up"
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {trend.direction === "up" ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            )}
            {trend.percentage}
          </span>
        )}
      </div>

      <p className="text-[#666] text-xs tracking-[0.08em] uppercase mb-1.5">{label}</p>
      <p className="font-display text-3xl text-[#F0EBE0] tracking-tight">{value}</p>
      {subtext && (
        <p className="text-xs text-[#555] mt-2">{subtext}</p>
      )}
    </motion.div>
  );
}

