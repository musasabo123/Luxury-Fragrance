import { Sparkles } from "lucide-react";

export function GoldDivider() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#C9A84C]/25" />
      <Sparkles className="w-3 h-3 text-[#C9A84C]/50" />
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#C9A84C]/25" />
    </div>
  );
}